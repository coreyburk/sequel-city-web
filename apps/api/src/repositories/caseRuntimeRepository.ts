import sql from "mssql";
import type { ConnectionPool, Request, Transaction } from "mssql";
import { randomUUID } from "node:crypto";
import { getCaseRepositoryPool } from "../db/caseRepositoryPool.ts";
import type { AttemptRecord, CaseContent, CaseDefinitionRecord, CasePrerequisiteRecord, CaseStepRecord } from "../types/caseRuntime.ts";
import { validateCaseContent } from "../services/caseContentValidationService.ts";
import { CaseRuntimeError, type StepProof } from "../types/caseRuntime.ts";

type PoolProvider = () => Promise<ConnectionPool>;
function uuid(value: string): string {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) throw new Error("Invalid UUID.");
  return value;
}
function bind(request: Request, values: Record<string, string | number>): Request {
  for (const [name, value] of Object.entries(values)) request.input(name, sql.NVarChar, String(value));
  return request;
}
export class CaseRuntimeRepository {
  private readonly poolProvider: PoolProvider;
  constructor(poolProvider: PoolProvider = getCaseRepositoryPool) { this.poolProvider = poolProvider; }

  async listReleasedCases(): Promise<CaseDefinitionRecord[]> {
    const pool = await this.poolProvider();
    return (await pool.request().query<CaseDefinitionRecord>("SELECT * FROM app.CaseDefinition WHERE ReleaseStatus='released' ORDER BY CaseId,ContentVersion DESC")).recordset;
  }

  async listAttempts(ownerId: string, caseId: string): Promise<AttemptRecord[]> {
    const pool = await this.poolProvider();
    return (await bind(pool.request(), { ownerId: uuid(ownerId), caseId }).query<AttemptRecord>(`
      SELECT a.AttemptId,a.OwnerId,a.CaseId,a.ContentVersion,a.EvidenceVersion,a.Status,a.UpdatedAtUtc,CONVERT(VARCHAR(20),a.Revision) Revision,w.WorkspaceJson FROM app.LearnerAttempt a
      JOIN app.AttemptWorkspace w ON a.AttemptId=w.AttemptId WHERE OwnerId=@ownerId AND CaseId=@caseId ORDER BY UpdatedAtUtc DESC`)).recordset;
  }

  async proofs(attemptId: string): Promise<StepProof[]> {
    const pool = await this.poolProvider();
    return (await bind(pool.request(), { attemptId: uuid(attemptId) }).query<StepProof>(
      "SELECT StepKey,CONVERT(VARCHAR(36),ActionId) ActionId,ProofJson FROM app.AttemptStepEvidence WHERE AttemptId=@attemptId")).recordset;
  }

  async ownedSnapshotData(ownerId: string, attemptId: string): Promise<{ attempt: AttemptRecord; proofs: StepProof[] }> {
    const tx = new sql.Transaction(await this.poolProvider());
    await tx.begin(sql.ISOLATION_LEVEL.SERIALIZABLE);
    try {
      await bind(new sql.Request(tx), { ownerId: uuid(ownerId) }).query("SELECT OwnerId FROM app.LocalLearner WITH (UPDLOCK,HOLDLOCK) WHERE OwnerId=@ownerId");
      const result = await bind(new sql.Request(tx), { ownerId: uuid(ownerId), attemptId: uuid(attemptId) }).query<AttemptRecord>(`
        SELECT a.AttemptId,a.OwnerId,a.CaseId,a.ContentVersion,a.EvidenceVersion,a.Status,a.UpdatedAtUtc,
         CONVERT(VARCHAR(20),a.Revision) Revision,w.WorkspaceJson
        FROM app.LearnerAttempt a WITH (HOLDLOCK) JOIN app.AttemptWorkspace w ON a.AttemptId=w.AttemptId
        WHERE a.OwnerId=@ownerId AND a.AttemptId=@attemptId`);
      if (!result.recordset[0]) throw new CaseRuntimeError(404, "Attempt unavailable.");
      const proofs = (await bind(new sql.Request(tx), { attemptId }).query<StepProof>("SELECT StepKey,CONVERT(VARCHAR(36),ActionId) ActionId,ProofJson FROM app.AttemptStepEvidence WHERE AttemptId=@attemptId")).recordset;
      await tx.commit(); return { attempt: result.recordset[0], proofs };
    } catch (error) { await tx.rollback().catch(() => undefined); throw error; }
  }

  // Serialize owner mutations, including fresh/resume, and retain request outcomes
  // independently of attempts. SQL execution happens before this transaction.
  async mutate<T>(ownerId: string, requestId: string, digest: string,
    operation: (tx: Transaction) => Promise<T>): Promise<{ outcome: T; replay: boolean }> {
    const tx = new sql.Transaction(await this.poolProvider());
    await tx.begin(sql.ISOLATION_LEVEL.SERIALIZABLE);
    try {
      const owner = await bind(new sql.Request(tx), { ownerId: uuid(ownerId) }).query(
        "SELECT OwnerId FROM app.LocalLearner WITH (UPDLOCK,HOLDLOCK) WHERE OwnerId=@ownerId");
      if (!owner.recordset[0]) throw new CaseRuntimeError(404, "Owner unavailable.");
      const existing = await bind(new sql.Request(tx), { ownerId, requestId: uuid(requestId) }).query<{ Digest: string; OutcomeJson: string }>(
        "SELECT CONVERT(VARCHAR(64),RequestDigest,2) Digest,OutcomeJson FROM app.LearnerRequest WHERE OwnerId=@ownerId AND RequestId=@requestId");
      if (existing.recordset[0]) {
        if (existing.recordset[0].Digest.toLowerCase() !== digest.toLowerCase()) throw new CaseRuntimeError(409, "Request ID was already used for different input.");
        await tx.commit();
        return { outcome: JSON.parse(existing.recordset[0].OutcomeJson) as T, replay: true };
      }
      const outcome = await operation(tx);
      const resultJson = JSON.stringify(outcome);
      if (Buffer.byteLength(resultJson, "utf16le") > 262144) throw new CaseRuntimeError(422, "Request outcome exceeds storage limit.");
      await bind(new sql.Request(tx), { ownerId, requestId, digest, outcome: resultJson }).query(
        "INSERT app.LearnerRequest(OwnerId,RequestId,RequestDigest,OutcomeJson) VALUES (@ownerId,@requestId,CONVERT(BINARY(32),@digest,2),@outcome)");
      await tx.commit();
      return { outcome, replay: false };
    } catch (error) {
      await tx.rollback().catch(() => undefined);
      if ((error as { number?: number }).number === 51005) throw new CaseRuntimeError(422, "Execution expired; run the query again before logging.");
      throw error;
    }
  }

  async replay<T>(ownerId: string, requestId: string, digest: string): Promise<T | null> {
    const pool = await this.poolProvider();
    const rows = await bind(pool.request(), { ownerId: uuid(ownerId), requestId: uuid(requestId) }).query<{ Digest: string; OutcomeJson: string }>(
      "SELECT CONVERT(VARCHAR(64),RequestDigest,2) Digest,OutcomeJson FROM app.LearnerRequest WHERE OwnerId=@ownerId AND RequestId=@requestId");
    if (!rows.recordset[0]) return null;
    if (rows.recordset[0].Digest.toLowerCase() !== digest) throw new CaseRuntimeError(409, "Request ID was already used for different input.");
    return JSON.parse(rows.recordset[0].OutcomeJson) as T;
  }

  async checkedAttempt(tx: Transaction, ownerId: string, attemptId: string, revision: string): Promise<AttemptRecord> {
    const result = await bind(new sql.Request(tx), { ownerId: uuid(ownerId), attemptId: uuid(attemptId) }).query<AttemptRecord>(`
      SELECT a.AttemptId,a.OwnerId,a.CaseId,a.ContentVersion,a.EvidenceVersion,a.Status,a.UpdatedAtUtc,CONVERT(VARCHAR(20),a.Revision) Revision,w.WorkspaceJson FROM app.LearnerAttempt a WITH (UPDLOCK,HOLDLOCK)
      JOIN app.AttemptWorkspace w ON a.AttemptId=w.AttemptId WHERE a.OwnerId=@ownerId AND a.AttemptId=@attemptId`);
    const a = result.recordset[0];
    if (!a) throw new CaseRuntimeError(404, "Attempt unavailable.");
    if (a.Revision !== revision) throw new CaseRuntimeError(409, "Saved progress changed. Review the latest attempt before retrying.");
    return a;
  }

  async command(tx: Transaction, values: Record<string, string | number>, command: string): Promise<void> {
    await bind(new sql.Request(tx), values).query(command);
  }

  async action(attemptId: string, actionId: string): Promise<{ ProofJson: string; ExpiresAtUtc: Date | null } | null> {
    const pool = await this.poolProvider();
    return (await bind(pool.request(), { attemptId: uuid(attemptId), actionId: uuid(actionId) }).query<{ ProofJson: string; ExpiresAtUtc: Date | null }>(
      "SELECT ProofJson,ExpiresAtUtc FROM app.AttemptAction WHERE AttemptId=@attemptId AND ActionId=@actionId AND ActionKind='query'")).recordset[0] ?? null;
  }

  async loadReleasedContent(caseId: string, version: number): Promise<CaseContent | null> {
    const pool = await this.poolProvider();
    const d = await bind(pool.request(), { caseId, version }).query<CaseDefinitionRecord>(
      "SELECT * FROM app.CaseDefinition WHERE CaseId=@caseId AND ContentVersion=@version AND ReleaseStatus='released'");
    if (!d.recordset[0]) return null;
    const steps = await bind(pool.request(), { caseId, version }).query<CaseStepRecord>(
      "SELECT * FROM app.CaseStep WHERE CaseId=@caseId AND ContentVersion=@version ORDER BY DisplayOrder");
    const prerequisites = await bind(pool.request(), { caseId, version }).query<CasePrerequisiteRecord>(
      "SELECT * FROM app.CaseStepPrerequisite WHERE CaseId=@caseId AND ContentVersion=@version");
    const content = { definition: d.recordset[0], steps: steps.recordset, prerequisites: prerequisites.recordset };
    const errors = validateCaseContent(content);
    if (errors.length) throw new Error(`Case content unavailable: ${errors.join(" ")}`);
    return content;
  }

  async findOrCreateOwner(capabilityHash: string): Promise<string> {
    if (!/^[0-9a-f]{64}$/i.test(capabilityHash)) throw new Error("Invalid owner capability hash.");
    const pool = await this.poolProvider();
    const result = await bind(pool.request(), { hash: capabilityHash, ownerId: randomUUID() }).query<{ OwnerId: string }>(`
      SET XACT_ABORT ON;
      BEGIN TRY
       BEGIN TRANSACTION;
       IF NOT EXISTS (SELECT 1 FROM app.LocalLearner WITH (UPDLOCK,HOLDLOCK) WHERE CapabilityHash=CONVERT(BINARY(32),@hash,2))
        INSERT app.LocalLearner (OwnerId,CapabilityHash) VALUES (@ownerId,CONVERT(BINARY(32),@hash,2));
       UPDATE app.LocalLearner SET LastSeenAtUtc=SYSUTCDATETIME() WHERE CapabilityHash=CONVERT(BINARY(32),@hash,2);
       SELECT CONVERT(VARCHAR(36),OwnerId) OwnerId FROM app.LocalLearner WHERE CapabilityHash=CONVERT(BINARY(32),@hash,2);
       COMMIT;
      END TRY BEGIN CATCH IF @@TRANCOUNT>0 ROLLBACK; THROW; END CATCH;`);
    return result.recordset[0].OwnerId;
  }

  async findOwner(hash: string): Promise<string> {
    const pool = await this.poolProvider();
    const row = (await bind(pool.request(), { hash }).query<{ OwnerId: string }>(
      "SELECT CONVERT(VARCHAR(36),OwnerId) OwnerId FROM app.LocalLearner WHERE CapabilityHash=CONVERT(BINARY(32),@hash,2)")).recordset[0];
    if (!row) throw new CaseRuntimeError(401, "Case session unavailable.");
    return row.OwnerId;
  }

  async createAttempt(ownerId: string, caseId: string, version: number): Promise<string> {
    uuid(ownerId);
    const content = await this.loadReleasedContent(caseId, version);
    if (!content) throw new Error("Released case version unavailable.");
    const attemptId = randomUUID();
    const pool = await this.poolProvider();
    await bind(pool.request(), { ownerId, attemptId, caseId, version, evidenceVersion: content.definition.EvidenceVersion }).query(`
      SET XACT_ABORT ON;
      BEGIN TRY
       BEGIN TRANSACTION;
       IF NOT EXISTS (SELECT 1 FROM app.LocalLearner WITH (UPDLOCK,HOLDLOCK) WHERE OwnerId=@ownerId) THROW 51002,'Owner unavailable.',1;
       UPDATE app.LearnerAttempt SET ArchivedFromStatus=Status,Status='archived',Revision=Revision+1,UpdatedAtUtc=SYSUTCDATETIME()
        WHERE OwnerId=@ownerId AND CaseId=@caseId AND Status='active';
       INSERT app.LearnerAttempt (AttemptId,OwnerId,CaseId,ContentVersion,EvidenceVersion,Status)
        VALUES (@attemptId,@ownerId,@caseId,@version,@evidenceVersion,'active');
       INSERT app.AttemptWorkspace (AttemptId,WorkspaceJson) VALUES (@attemptId,N'{"draftSql":"","notes":[],"selectedView":"briefing"}');
       COMMIT;
      END TRY BEGIN CATCH IF @@TRANCOUNT>0 ROLLBACK; THROW; END CATCH;`);
    return attemptId;
  }

  async loadOwnedAttempt(ownerId: string, attemptId: string): Promise<AttemptRecord | null> {
    const pool = await this.poolProvider();
    const result = await bind(pool.request(), { ownerId: uuid(ownerId), attemptId: uuid(attemptId) }).query<AttemptRecord>(`
      SELECT a.AttemptId,a.OwnerId,a.CaseId,a.ContentVersion,a.EvidenceVersion,a.Status,
       CONVERT(VARCHAR(20),a.Revision) Revision,a.UpdatedAtUtc,w.WorkspaceJson
      FROM app.LearnerAttempt a JOIN app.AttemptWorkspace w ON w.AttemptId=a.AttemptId
      WHERE a.OwnerId=@ownerId AND a.AttemptId=@attemptId`);
    return result.recordset[0] ?? null;
  }

  // Progress/action transactions are added in WP-288, not inferred from workspace.
  async saveWorkspace(ownerId: string, attemptId: string, revision: string, workspace: unknown): Promise<string> {
    if (!/^(0|[1-9][0-9]{0,18})$/.test(revision) || BigInt(revision) >= 9223372036854775807n) throw new Error("Invalid revision.");
    if (!workspace || typeof workspace !== "object" || Array.isArray(workspace)) throw new Error("Invalid workspace.");
    const data = workspace as Record<string, unknown>;
    if (Object.keys(data).some(key => !["draftSql", "notes", "selectedView"].includes(key)) || typeof data.draftSql !== "string" || Buffer.byteLength(data.draftSql, "utf16le") > 32768 || !Array.isArray(data.notes) || typeof data.selectedView !== "string" || !["briefing", "workbench", "case-board"].includes(data.selectedView)) throw new Error("Invalid workspace fields.");
    const json = JSON.stringify(workspace);
    if (Buffer.byteLength(json, "utf16le") > 262144) throw new Error("Workspace too large.");
    const pool = await this.poolProvider();
    const result = await bind(pool.request(), { ownerId: uuid(ownerId), attemptId: uuid(attemptId), revision, workspace: json }).query<{ Revision: string }>(`
      SET XACT_ABORT ON;
      BEGIN TRY
       BEGIN TRANSACTION;
       IF NOT EXISTS (SELECT 1 FROM app.LearnerAttempt WITH (UPDLOCK,HOLDLOCK)
        WHERE AttemptId=@attemptId AND OwnerId=@ownerId AND Revision=CONVERT(BIGINT,@revision) AND Status IN ('active','completed'))
        THROW 51003,'Attempt unavailable or revision conflict.',1;
       UPDATE app.AttemptWorkspace SET WorkspaceJson=@workspace WHERE AttemptId=@attemptId;
       UPDATE app.LearnerAttempt SET Revision=Revision+1,UpdatedAtUtc=SYSUTCDATETIME() WHERE AttemptId=@attemptId;
       SELECT CONVERT(VARCHAR(20),Revision) Revision FROM app.LearnerAttempt WHERE AttemptId=@attemptId;
       COMMIT;
      END TRY BEGIN CATCH IF @@TRANCOUNT>0 ROLLBACK; THROW; END CATCH;`);
    return result.recordset[0].Revision;
  }
}
