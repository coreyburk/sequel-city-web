const assert = require("node:assert/strict");
const { CaseRuntimeRepository } = require("./caseRuntimeRepository.ts");
const { getCaseRepositoryConfig } = require("../config/database.ts");
const { randomUUID, createHash } = require("node:crypto");

async function run() {
 const owner=randomUUID(),attempt=randomUUID();
 let touched=false;
 const fake = new CaseRuntimeRepository(async()=>{touched=true;throw Error("No SQL expected");});
 await assert.rejects(()=>fake.findOrCreateOwner("bad hash"));
 await assert.rejects(()=>fake.saveWorkspace(owner,attempt,"0",{draftSql:"",notes:[],selectedView:"briefing",completed:true}));
 await assert.rejects(()=>fake.saveWorkspace(owner,attempt,"0",{draftSql:"x".repeat(20000),notes:[],selectedView:"briefing"}));
 assert.equal(touched,false);
 const inputs:any={};let command="";
 const pool={request:()=>({input(name:string,_type:unknown,value:unknown){inputs[name]=value;return this;},async query(text:string){command=text;return {recordset:[]};}})};
 const repo=new CaseRuntimeRepository(async()=>pool as never);
 assert.equal(await repo.loadReleasedContent("case'; DROP TABLE app.CaseStep;--",1),null);
 assert.ok(command.includes("@caseId"));assert.equal(command.includes("DROP TABLE"),false);assert.ok(String(inputs.caseId).includes("DROP TABLE"));
 assert.equal(await repo.loadOwnedAttempt(owner,attempt),null);
 assert.ok(command.includes("a.OwnerId=@ownerId"));
 const oldUser=process.env.SQLSERVER_APP_USER,oldPassword=process.env.SQLSERVER_APP_PASSWORD;
 try {process.env.SQLSERVER_APP_USER=process.env.SQLSERVER_USER || "";process.env.SQLSERVER_APP_PASSWORD="test";assert.throws(()=>getCaseRepositoryConfig());}
 finally {if(oldUser===undefined)delete process.env.SQLSERVER_APP_USER;else process.env.SQLSERVER_APP_USER=oldUser;if(oldPassword===undefined)delete process.env.SQLSERVER_APP_PASSWORD;else process.env.SQLSERVER_APP_PASSWORD=oldPassword;}
 console.log("PASS parameterized repository, wrong-owner query boundary, untrusted workspace and connection isolation");
 if(process.env.CASE_RUNTIME_INTEGRATION!=="1") return;
 assert.match(process.env.SQLSERVER_DATABASE!,/^SequelCityRuntimeTest_[A-Za-z0-9_]+$/);
 const sql=require("mssql");
 const { getCaseRepositoryPool }=require("../db/caseRepositoryPool.ts");
 const { getSqlServerConfig }=require("../config/database.ts");
 const { validateCaseRuntimeReadiness,validateDatabaseIdentity }=require("../services/databaseIdentityService.ts");
 const { getDatabaseMigrationStatus }=require("../services/databaseMigrationService.ts");
 const { runIntegratedBootstrapProvisioning }=require("../services/databaseBootstrapService.ts");
 const { getSchemaMetadata }=require("../services/schemaService.ts");
 const repositoryPool=await getCaseRepositoryPool();
 const admin=await new sql.ConnectionPool({...getSqlServerConfig(),user:process.env.SQLSERVER_BOOTSTRAP_USER,password:process.env.SQLSERVER_BOOTSTRAP_PASSWORD}).connect();
 try {
  // Exercise the API provisioning path as well as the PowerShell setup path.
  await runIntegratedBootstrapProvisioning();
  const readiness=await validateCaseRuntimeReadiness(repositoryPool);
  assert.equal(readiness.isReady,true,JSON.stringify(readiness));
  assert.equal((await validateCaseRuntimeReadiness(repositoryPool)).isReady,true);
  const identity=await validateDatabaseIdentity(repositoryPool,await getDatabaseMigrationStatus(repositoryPool));
  assert.equal(identity.status,"ready");
  const schema=await getSchemaMetadata();
  assert.equal(schema.data.tables.length,10);assert.ok(schema.data.tables.every((t:any)=>t.schemaName==="dbo"));
  const live=new CaseRuntimeRepository(async()=>repositoryPool);
  const hash=createHash("sha256").update(randomUUID()).digest("hex");
  const id=await live.findOrCreateOwner(hash);assert.equal(await live.findOrCreateOwner(hash),id);
  const a=await live.createAttempt(id,"case-001",1);
  const first=await live.loadOwnedAttempt(id,a);assert.equal(first.Status,"active");assert.equal(first.Revision,"0");
  assert.equal(await live.loadOwnedAttempt(randomUUID(),a),null);
  assert.equal(await live.saveWorkspace(id,a,"0",{draftSql:"SELECT * FROM CrimeType;",notes:["my note"],selectedView:"workbench"}),"1");
  await assert.rejects(()=>live.saveWorkspace(id,a,"0",{draftSql:"stale",notes:[],selectedView:"workbench"}));
  assert.match((await live.loadOwnedAttempt(id,a)).WorkspaceJson,/my note/);
  const b=await live.createAttempt(id,"case-001",1);
  assert.equal((await live.loadOwnedAttempt(id,a)).Status,"archived");
  assert.equal((await live.loadOwnedAttempt(id,b)).Status,"active");
  const action=randomUUID(),request=randomUUID();
  await repositoryPool.request().input("attempt",sql.NVarChar,a).input("action",sql.NVarChar,action).input("request",sql.NVarChar,request).query("INSERT app.AttemptAction (ActionId,AttemptId,RequestId,ActionKind,RequestDigest,PrerequisiteRevision,SqlOrSubmission,ValidatorResult,ProofJson) VALUES (@action,@attempt,@request,'query',0x01,0,N'SELECT * FROM CrimeType;',N'matched',N'{}')");
  await assert.rejects(()=>repositoryPool.request().input("attempt",sql.NVarChar,b).input("action",sql.NVarChar,action).query("INSERT app.AttemptStepEvidence (AttemptId,StepKey,CaseId,ContentVersion,ActionId,ValidatorVersion,ProofJson) VALUES (@attempt,'crime-type','case-001',1,@action,1,N'{}')"));
  await assert.rejects(()=>live.createAttempt(id,"fixture-foundation",1));
  await assert.rejects(()=>live.createAttempt(id,"case-001",99));
  await admin.request().query("ALTER TABLE app.AttemptWorkspace NOCHECK CONSTRAINT FK_Workspace_Attempt");
  assert.equal((await validateCaseRuntimeReadiness(repositoryPool)).isReady,false);
  await admin.request().query("ALTER TABLE app.AttemptWorkspace WITH CHECK CHECK CONSTRAINT FK_Workspace_Attempt");
  await admin.request().query("DISABLE TRIGGER app.ProtectReleasedStep ON app.CaseStep");
  assert.equal((await validateCaseRuntimeReadiness(repositoryPool)).isReady,false);
  await admin.request().query("ENABLE TRIGGER app.ProtectReleasedStep ON app.CaseStep");
  await admin.request().query("REVOKE SELECT ON sys.tables FROM sequel_learner");
  assert.equal((await validateCaseRuntimeReadiness(repositoryPool)).isReady,false);
  await admin.request().query("DENY SELECT ON sys.tables TO sequel_learner");
  await admin.request().query("EXEC sp_rename N'app.CaseStep.Hint', N'InvalidHint', N'COLUMN'");
  assert.equal((await validateCaseRuntimeReadiness(repositoryPool)).isReady,false);
  await admin.request().query("EXEC sp_rename N'app.CaseStep.InvalidHint', N'Hint', N'COLUMN'");
  await admin.request().query("DISABLE TRIGGER app.ProtectReleasedStep ON app.CaseStep; UPDATE app.CaseStep SET ValidatorKey=N'unsupported' WHERE CaseId='case-001' AND StepKey='crime-type'; ENABLE TRIGGER app.ProtectReleasedStep ON app.CaseStep;");
  assert.equal((await validateCaseRuntimeReadiness(repositoryPool)).isReady,false);
  await admin.request().query("DISABLE TRIGGER app.ProtectReleasedStep ON app.CaseStep; UPDATE app.CaseStep SET ValidatorKey=N'case001.crime-type' WHERE CaseId='case-001' AND StepKey='crime-type'; ENABLE TRIGGER app.ProtectReleasedStep ON app.CaseStep;");
  await admin.request().query("UPDATE dbo.CrimeType SET CrimeType='invalid' WHERE CrimeID=1080");
  assert.equal((await validateCaseRuntimeReadiness(repositoryPool)).isReady,false);
  await admin.request().query("UPDATE dbo.CrimeType SET CrimeType='Murder' WHERE CrimeID=1080");
  await admin.request().query("DELETE dbo.AppSchemaVersion WHERE MigrationKey='case-runtime-v1'");
  assert.equal((await validateCaseRuntimeReadiness(repositoryPool)).isReady,false);
  await admin.request().query("INSERT dbo.AppSchemaVersion(MigrationKey,AppliedBy) VALUES ('case-runtime-v1','integration')");
  assert.equal((await validateCaseRuntimeReadiness(repositoryPool)).isReady,true);
  const { buildApp }=require("../app.ts");
  const app=await buildApp();
  try {
   const tables=await app.inject({method:"GET",url:"/api/schema/tables"});
   assert.equal(tables.statusCode,200);assert.equal(tables.json().data.tables.length,10);
   const query=await app.inject({method:"POST",url:"/api/query/execute",payload:{sql:"SELECT * FROM CrimeType;"}});
   assert.equal(query.json().success,true);assert.ok(query.json().data.rowCount>0);
   for(const text of ["SELECT * FROM app.CaseStep;","SELECT * FROM CaseAnswerKey;","SELECT * FROM sys.tables;","SELECT * FROM INFORMATION_SCHEMA.TABLES;"]){
    const blocked=await app.inject({method:"POST",url:"/api/query/execute",payload:{sql:text}});
    assert.equal(blocked.json().success,false,text);
   }
  } finally {
   await app.close();
   const { getSqlServerPool }=require("../db/sqlServerPool.ts");
   await (await getSqlServerPool()).close();
  }
  console.log("PASS live content, metadata, both provisioning paths, owner isolation, archive, stale workspace and partial/mismatched readiness");
 } finally {await admin.close();await repositoryPool.close();}
}
run().catch((error:unknown)=>{console.error(error);process.exitCode=1;});
