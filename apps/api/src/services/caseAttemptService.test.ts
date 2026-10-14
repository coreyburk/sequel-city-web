const assert = require("node:assert/strict");
const { randomUUID } = require("node:crypto");
const { validateWorkspace, CaseAttemptService } = require("./caseAttemptService.ts");
const { CaseRuntimeRepository } = require("../repositories/caseRuntimeRepository.ts");
async function run() {
  assert.throws(() => validateWorkspace({ draftSql: "", notes: [], selectedView: "workbench", completed: true }));
  assert.throws(() => validateWorkspace({ draftSql: "x".repeat(20000), notes: [], selectedView: "briefing" }));
  assert.throws(() => validateWorkspace({ draftSql: "", notes: [{ milestone: true }], selectedView: "briefing" }));
  validateWorkspace({ draftSql: "SELECT * FROM CrimeType;", notes: ["my note"], selectedView: "workbench" });
  console.log("PASS bounded notes/draft import rejects progress authority");
  const databaseSteps = [
    { StepKey: "third", DisplayOrder: 2, TaskTitle: "Database interview evidence", StepObjective: "Third objective", SamuelDirection: "HIDDEN_FUTURE_DIRECTION", Hint: "HIDDEN_FUTURE_HINT", StarterSql: "HIDDEN_FUTURE_STARTER", ValidatorParametersJson: "HIDDEN_VALIDATOR" },
    { StepKey: "first", DisplayOrder: 0, TaskTitle: "Database crime evidence", StepObjective: "First objective", SamuelDirection: "First direction" },
    { StepKey: "second", DisplayOrder: 1, TaskTitle: "Database report evidence", StepObjective: "Second objective", SamuelDirection: "Second direction" }
  ];
  let provedKeys: string[] = [];
  const attempt = { AttemptId: "owned", CaseId: "fixture", ContentVersion: 1, EvidenceVersion: "v1", Status: "active", Revision: "0", UpdatedAtUtc: "2026-10-13T00:00:00Z", WorkspaceJson: JSON.stringify({ draftSql: "", notes: ["I solved it"], selectedView: "case-board" }) };
  const snapshotRepository = {
    loadOwnedAttempt: async () => attempt,
    loadReleasedContent: async () => ({ definition: { EvidenceVersion: "v1", CompletionScope: "evidence-review" }, steps: databaseSteps, prerequisites: [{ StepKey: "second", RequiredStepKey: "first" }, { StepKey: "third", RequiredStepKey: "second" }] }),
    ownedSnapshotData: async () => ({ attempt, proofs: provedKeys.map(StepKey => ({ StepKey, ProofJson: JSON.stringify({ facts: [] }) })) })
  };
  const projectionService = new CaseAttemptService(snapshotRepository);
  const freshProjection = await projectionService.snapshot("owner", "owned");
  assert.deepEqual(freshProjection.evidenceSteps, [{ stepKey: "first", title: "Database crime evidence", status: "current" }]);
  provedKeys = ["first"];
  const progressedProjection = await projectionService.snapshot("owner", "owned");
  assert.deepEqual(progressedProjection.evidenceSteps, [
    { stepKey: "first", title: "Database crime evidence", status: "proved" },
    { stepKey: "second", title: "Database report evidence", status: "current" }
  ]);
  assert.doesNotMatch(JSON.stringify(progressedProjection), /HIDDEN_|Database interview evidence/);
  provedKeys = ["third", "first", "second"];
  const completedProjection = await projectionService.snapshot("owner", "owned");
  assert.deepEqual(completedProjection.evidenceSteps.map((step: any) => step.title), ["Database crime evidence", "Database report evidence", "Database interview evidence"]);
  assert.ok(completedProjection.evidenceSteps.every((step: any) => step.status === "proved"));
  assert.equal(completedProjection.task, null);
  assert.doesNotMatch(JSON.stringify(completedProjection), /HIDDEN_/);
  console.log("PASS database-authored evidence titles, ordered server proof status and no future guidance/validator leakage");
  if (process.env.CASE_RUNTIME_INTEGRATION !== "1") return;
  assert.match(process.env.SQLSERVER_DATABASE!, /^SequelCityRuntimeTest_/);
  const { createHash } = require("node:crypto");
  const repo = new CaseRuntimeRepository();
  const mutate = repo.mutate.bind(repo);
  repo.mutate = async (...args: any[]) => { try { return await mutate(...args); } catch (error) { if (!(error as any).statusCode) console.error("Integration transaction diagnostic:", (error as Error).message); throw error; } };
  const owner = await repo.findOrCreateOwner(createHash("sha256").update(randomUUID()).digest("hex"));
  const other = await repo.findOrCreateOwner(createHash("sha256").update(randomUUID()).digest("hex"));
  const service = new CaseAttemptService(repo);
  const freshInput = { requestId: randomUUID(), expectedRevision: "0" };
  let s = await service.fresh(owner, "case-001", freshInput);
  assert.equal((await service.fresh(owner, "case-001", freshInput)).attemptId, s.attemptId);
  assert.equal((await service.fresh(owner, "case-001", { expectedRevision: "0", requestId: freshInput.requestId })).attemptId, s.attemptId);
  assert.equal(s.task.stepKey, "crime-type"); assert.equal(s.progress.completed, 0);
  const empty = await service.query(owner,s.attemptId,{requestId:randomUUID(),expectedRevision:s.revision,sql:"SELECT * FROM CrimeType WHERE CrimeID=2080"});
  assert.equal(empty.success,true);assert.equal(empty.data.rowCount,0);assert.equal(empty.feedback.category,"no-matches");assert.equal(empty.snapshot.progress.completed,0);assert.doesNotMatch(JSON.stringify(empty.feedback),/1080/);s=empty.snapshot;
  for(const [sql,category] of [
    ["SELECT * FROM CrimeType WHERE ReportCity='Sequel City' AND ReportDate=20230502","invalid-column"],
    ["SELECT c.ReportDate FROM dbo.CrimeType c JOIN dbo.CrimeSceneReport r ON c.CrimeID=r.CrimeID","invalid-column"],
    ["SELECT * FROM PublicTableThatDoesNotExist","blocked"],
    ["SELECT * FROM CrimeType WHERE CrimeID =","syntax"],
    ["SELECT CrimeID FROM CrimeType c JOIN CrimeSceneReport r ON c.CrimeID=r.CrimeID","ambiguous-column"],
    ["SELECT * FROM CrimeType WHERE CrimeID='not-a-number'","conversion"]
  ]){
    const bad=await service.query(owner,s.attemptId,{requestId:randomUUID(),expectedRevision:s.revision,sql});assert.equal(bad.success,false,sql);assert.equal(bad.feedback.category,category,sql);assert.equal(bad.snapshot.revision,s.revision);assert.equal(bad.snapshot.progress.completed,0);assert.doesNotMatch(JSON.stringify(bad.feedback),/password|CaseAnswerKey|ValidatorKey/);
    if(sql.includes("ReportCity"))assert.match(bad.feedback.explanation,/ReportCity|column/);
  }
  console.log("PASS actual SQL feedback: empty values, wrong-table columns, aliases/joins, missing table, syntax, ambiguity and conversion; no proof or answer leakage");
  await assert.rejects(() => service.snapshot(other, s.attemptId), { statusCode: 404 });
  const { getCaseRepositoryPool } = require("../db/caseRepositoryPool.ts");
  const pool = await getCaseRepositoryPool();
  await pool.request().input("id", require("mssql").NVarChar, s.attemptId).query("UPDATE app.LearnerAttempt SET EvidenceVersion='invalid' WHERE AttemptId=@id");
  await assert.rejects(() => service.snapshot(owner, s.attemptId), { statusCode: 409 });
  await pool.request().input("id", require("mssql").NVarChar, s.attemptId).query("UPDATE app.LearnerAttempt SET EvidenceVersion='sequel-evidence-v1' WHERE AttemptId=@id");
  const skipped = await service.query(owner, s.attemptId, { requestId: randomUUID(), expectedRevision: s.revision, sql: "SELECT * FROM InterviewLog WHERE ReportID = 10001;" });
  assert.equal(skipped.snapshot.progress.completed, 0); assert.equal(skipped.feedback.category,"unrelated-results"); s = skipped.snapshot;
  const fake = await service.query(owner, s.attemptId, { requestId: randomUUID(), expectedRevision: s.revision, sql: "SELECT 1080 AS CrimeID, 'Murder' AS CrimeType;" });
  assert.equal(fake.snapshot.progress.completed, 0); s = fake.snapshot;
  const queryInput = { requestId: randomUUID(), expectedRevision: s.revision, sql: 'SELECT CrimeID AS Crime_ID, LOWER(CrimeType) AS Crime_Type FROM "dbo"."CrimeType";' };
  const crime = await service.query(owner, s.attemptId, queryInput);
  assert.equal(crime.feedback.category,"task-proved"); assert.equal(crime.snapshot.progress.completed, 1, JSON.stringify({ saved: crime.progressSaved, message: crime.message, rows: crime.data?.rows })); assert.equal(crime.snapshot.task.stepKey, "clocktower-report"); s = crime.snapshot;
  assert.equal((await service.query(owner, s.attemptId, queryInput)).snapshot.revision, s.revision);
  await assert.rejects(() => service.query(owner, s.attemptId, { ...queryInput, sql: "SELECT * FROM InterviewLog;" }), { statusCode: 409 });
  const stale = { requestId: randomUUID(), expectedRevision: "0", workspace: { draftSql: "stale", notes: [], selectedView: "workbench" } };
  await assert.rejects(() => service.workspace(owner, s.attemptId, stale), { statusCode: 409 });
  const write = { requestId: randomUUID(), expectedRevision: s.revision, workspace: { draftSql: "SELECT * FROM CrimeSceneReport WHERE CrimeID=1080;", notes: ["preserved"], selectedView: "workbench" } };
  const race = await Promise.allSettled([service.workspace(owner, s.attemptId, write), service.workspace(owner, s.attemptId, { ...write, requestId: randomUUID() })]);
  assert.equal(race.filter((r: any) => r.status === "fulfilled").length, 1);
  s = await service.snapshot(owner, s.attemptId);
  const broad = await service.query(owner, s.attemptId, { requestId: randomUUID(), expectedRevision: s.revision, sql: write.workspace.draftSql });
  assert.ok(broad.data.rowCount > 1); assert.equal(broad.feedback.category,"narrow-results"); assert.equal(broad.snapshot.progress.completed, 1); assert.equal(broad.snapshot.task.stepKey, "clocktower-report"); s = broad.snapshot;
  const forgedReport = await service.query(owner, s.attemptId, { requestId: randomUUID(), expectedRevision: s.revision, sql: "SELECT 999999 AS ReportID, CrimeID,ReportDate,ReportCity,ReportDescription FROM CrimeSceneReport WHERE CrimeID=1080 AND ReportCity='Sequel City' AND ReportDate='20230502';" });
  assert.equal(forgedReport.snapshot.progress.completed, 1); s = forgedReport.snapshot;
  const report = await service.query(owner, s.attemptId, { requestId: randomUUID(), expectedRevision: s.revision, sql: "SELECT * FROM CrimeSceneReport WHERE CrimeID=1080 AND ReportCity='Sequel City' AND ReportDate='20230502';" });
  assert.equal(report.data.rowCount, 1); assert.equal(report.snapshot.progress.completed, 2); s = report.snapshot;
  const reportId = s.facts.find((f: any) => f.key === "ReportID").value;
  const interviews = await service.query(owner, s.attemptId, { requestId: randomUUID(), expectedRevision: s.revision, sql: `SELECT * FROM InterviewLog WHERE ReportID=${reportId};` });
  assert.equal(interviews.snapshot.progress.completed, 3); assert.equal(interviews.snapshot.task, null); assert.equal(interviews.snapshot.status, "completed"); s = interviews.snapshot;
  const original = s;
  const second = await service.fresh(owner, "case-001", { requestId: randomUUID(), expectedRevision: "0" });
  assert.equal((await service.snapshot(owner, original.attemptId)).workspace.notes[0], "preserved");
  const old = await service.snapshot(owner, original.attemptId);
  const resumed = await service.lifecycle(owner, old.attemptId, "resume", { requestId: randomUUID(), expectedRevision: old.revision });
  assert.equal(resumed.status, "completed");
  const third = await service.fresh(owner, "case-001", { requestId: randomUUID(), expectedRevision: "0" });
  const deletion = { requestId: randomUUID(), expectedRevision: third.revision };
  assert.deepEqual(await service.lifecycle(owner, third.attemptId, "delete", deletion), { deleted: true });
  assert.deepEqual(await service.lifecycle(owner, third.attemptId, "delete", deletion), { deleted: true });
  console.log("PASS actual SQL durable ordered flow, multi-row refinement, retry/delete replay, owner isolation, concurrent revision and fresh/resume retention");
  const { buildApp: buildRoutesApp } = require("../app.ts");
  const routesApp = await buildRoutesApp();
  try {
    const origin = "http://127.0.0.1:5173";
    const session = await routesApp.inject({ url: "/api/session", headers: { origin } });
    assert.equal(session.statusCode, 200);
    const cookie = String(session.headers["set-cookie"]).split(";")[0];
    const headers = { origin, cookie, "x-csrf-token": session.json().csrfToken };
    const payload = { requestId: randomUUID(), expectedRevision: "0" };
    assert.equal((await routesApp.inject({ method: "POST", url: "/api/cases/case-001/attempts", payload, headers: { cookie, origin } })).statusCode, 403);
    assert.equal((await routesApp.inject({ method: "POST", url: "/api/cases/case-001/attempts", payload: { ...payload, completed: true }, headers })).statusCode, 400);
    const created = await routesApp.inject({ method: "POST", url: "/api/cases/case-001/attempts", payload, headers });
    assert.equal(created.statusCode, 200);
    assert.equal((await routesApp.inject({ url: `/api/attempts/${s.attemptId}`, headers: { cookie } })).statusCode, 404);
    const apiId = created.json().attemptId;
    const query = await routesApp.inject({ method: "POST", url: `/api/attempts/${apiId}/query`, headers, payload: { requestId: randomUUID(), expectedRevision: "0", sql: "SELECT * FROM CrimeType;" } });
    assert.equal(query.statusCode, 200); assert.equal(query.json().snapshot.progress.completed, 1);
    assert.equal((await routesApp.inject({ method: "POST", url: `/api/attempts/${apiId}/query`, headers, payload: { requestId: randomUUID(), expectedRevision: "0", sql: "SELECT * FROM InterviewLog;" } })).statusCode, 409);
    assert.equal((await routesApp.inject({ method: "POST", url: `/api/attempts/${apiId}/evidence`, headers, payload: { requestId: randomUUID(), expectedRevision: "1", actionId: randomUUID(), rowIndex: 0, rows: [{ CrimeID: 1080 }] } })).statusCode, 400);
    console.log("PASS actual SQL/API owner/CSRF, strict authority fields and stale request boundaries");
  } finally { await routesApp.close(); }
  // Feedback consumes the existing Case 004 canonical collection decisions.
  let c4 = await service.fresh(owner,"case-004",{requestId:randomUUID(),expectedRevision:"0"});
  const ask4 = async(sql:string)=>{const result=await service.query(owner,c4.attemptId,{requestId:randomUUID(),expectedRevision:c4.revision,sql});c4=result.snapshot;return result;};
  const crime4=await ask4("SELECT * FROM CrimeType");assert.equal(crime4.feedback.category,"evidence-ready");
  const murderIndex=crime4.data.rows.findIndex((row:any)=>String(row.values.CrimeType).toLowerCase()==="murder");assert.ok(murderIndex>=0);
  c4=await service.evidence(owner,c4.attemptId,{requestId:randomUUID(),expectedRevision:c4.revision,actionId:crime4.actionId,rowIndex:murderIndex});
  const inspected4=await ask4("SELECT * FROM CrimeSceneReport");assert.equal(inspected4.feedback.category,"task-proved");
  const broad4=await ask4("SELECT * FROM CrimeSceneReport WHERE ReportCity='SQL City'");assert.equal(broad4.feedback.category,"narrow-results");assert.equal(c4.progress.completed,2);
  const isolated4=await ask4("SELECT * FROM CrimeSceneReport WHERE CrimeID=1080 AND ReportCity='SQL City' AND ReportDate=20230115");assert.equal(isolated4.feedback.category,"evidence-ready");
  c4=await service.evidence(owner,c4.attemptId,{requestId:randomUUID(),expectedRevision:c4.revision,actionId:isolated4.actionId,rowIndex:0});
  const witness4=await ask4("SELECT * FROM InterviewLog WHERE ReportID=10975 AND PersonID=14887");assert.equal(witness4.feedback.category,"evidence-ready");
  const witnessIndex=witness4.data.rows.findIndex((row:any)=>/i saw|i heard|i recognized|he had|he got into|there was/i.test(String(row.values.LogTranscript)));assert.ok(witnessIndex>=0);
  c4=await service.evidence(owner,c4.attemptId,{requestId:randomUUID(),expectedRevision:c4.revision,actionId:witness4.actionId,rowIndex:witnessIndex});assert.equal(c4.task.collection.accepted,1);
  const partial4=await ask4("SELECT * FROM InterviewLog WHERE ReportID=10975 AND PersonID=14887");assert.equal(partial4.feedback.category,"partial-collection");assert.match(partial4.feedback.explanation,/1 of 2/);
  const duplicate4=await service.evidence(owner,c4.attemptId,{requestId:randomUUID(),expectedRevision:c4.revision,actionId:partial4.actionId,rowIndex:witnessIndex});assert.equal(duplicate4.revision,c4.revision);assert.equal(duplicate4.task.collection.accepted,1);
  const originalMutate=repo.mutate;repo.mutate=async()=>{throw new Error("private write failure")};
  try {const unsaved4=await service.query(owner,c4.attemptId,{requestId:randomUUID(),expectedRevision:c4.revision,sql:"SELECT * FROM InterviewLog WHERE ReportID=10975 AND PersonID=14887"});assert.equal(unsaved4.success,true);assert.equal(unsaved4.feedback.category,"progress-not-saved");assert.equal(unsaved4.snapshot.revision,c4.revision);assert.doesNotMatch(JSON.stringify(unsaved4.feedback),/private write failure/);}finally{repo.mutate=originalMutate;}
  console.log("PASS actual SQL Case 004 feedback: inspection, narrowing, canonical log-ready rows, partial/duplicate collection and persistence failure");
  if (process.env.CASE_RUNTIME_BROWSER_TESTS === "1") {
    const { buildApp } = require("../app.ts");
    const { spawn } = require("node:child_process");
    const path = require("node:path");
    const net = require("node:net");
    const probe = net.createServer();
    await new Promise(resolve => probe.listen(0, "127.0.0.1", resolve));
    const webPort = probe.address().port;
    await new Promise(resolve => probe.close(resolve));
    process.env.CASE_RUNTIME_ALLOWED_ORIGINS = `http://127.0.0.1:${webPort},http://127.0.0.1:5173`;
    const app = await buildApp();
    await app.listen({ host: "127.0.0.1", port: 0 });
    const apiPort = (app.server.address() as any).port;
    const root = path.resolve(process.cwd(), "../..");
    const browserEnv = { ...process.env, VITE_API_BASE_URL: `http://127.0.0.1:${apiPort}`, PLAYWRIGHT_BASE_URL: `http://127.0.0.1:${webPort}`, CASE_001_LIVE_SMOKE: "1" };
    const vite = spawn(process.execPath, [path.join(root, "node_modules/vite/bin/vite.js"), "--host", "127.0.0.1", "--port", String(webPort), "--strictPort"], { cwd: path.join(root, "apps/web"), env: browserEnv, stdio: "ignore", windowsHide: true });
    try {
      let ready = false;
      for (let n = 0; n < 100; n++) { try { if ((await fetch(`http://127.0.0.1:${webPort}`)).ok) { ready = true; break; } } catch {} await new Promise(r => setTimeout(r, 100)); }
      assert.equal(ready, true, "Isolated Vite did not start.");
      console.log(`Disposable browser stack: ${process.env.SQLSERVER_DATABASE}; API ${apiPort}; web ${webPort}`);
      const result: number = await new Promise(resolve => {
        const child = spawn(process.execPath, [path.join(root, "node_modules/@playwright/test/cli.js"), "test", "case-001-live-smoke.spec.ts", "student-mode.spec.ts", "outlier-user-path.spec.ts"], { cwd: path.join(root, "apps/web"), env: browserEnv, stdio: "inherit", windowsHide: true });
        child.on("exit", (code: number) => resolve(code ?? 1));
      });
      assert.equal(result, 0, "Browser reference playthroughs failed.");
    } finally { vite.kill(); await app.close(); }
  }
}
run().catch((error: Error) => { console.error(error); process.exitCode = 1; });
