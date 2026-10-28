const assert=require("node:assert/strict");
const {randomUUID,createHash}=require("node:crypto");
const {CASE001_FINAL_REPORT,CASE001_WITNESS,CASE001_SUSPECT,evaluateFullCase001}=require("./case001FullResolutionService.ts");
async function run(){
 assert.ok(CASE001_FINAL_REPORT.length<=400);assert.ok(CASE001_WITNESS.length<=500);
 assert.doesNotMatch(CASE001_WITNESS,/PersonID|ledger|SQL|records staff/i);
 const row=(values:any)=>({values,displayValues:values});
 const crime=[{key:"CrimeID",value:"1080",label:"Murder CrimeID",sourceActionId:"crime"}];
 const report=row({ReportID:90001,CrimeID:1080,ReportCity:"Sequel City",ReportDate:20230502,ReportDescription:CASE001_FINAL_REPORT});
 assert.equal(evaluateFullCase001("case001.murder-type",[row({CrimeID:1080,CrimeType:"Murder"})],[],"action").matched,true);
 assert.equal(evaluateFullCase001("case001.final-report",[report],[],"action").matched,false);
 assert.equal(evaluateFullCase001("case001.final-report",[report],crime,"action").matched,true);
 assert.deepEqual(evaluateFullCase001("case001.final-report",[report],crime,"action").facts.map((f:any)=>[f.key,f.value]),[["ReportID","90001"]]);
 assert.equal(evaluateFullCase001("case001.final-report",[row({...report.values,CrimeID:2080})],crime,"action").matched,false);
 assert.doesNotMatch(CASE001_WITNESS,/bottle|tipped|poison/i);assert.ok(CASE001_SUSPECT.length<=500);
 assert.equal(evaluateFullCase001("case001.final-report",[report,report],crime,"action").matched,false);
 assert.equal(evaluateFullCase001("case001.witness-account",[row({LogID:1,ReportID:90001,PersonID:62764,LogTranscript:CASE001_WITNESS})],[],"action").matched,false);
 assert.equal(evaluateFullCase001("case001.suspect-identity",[row({PersonID:27412,PersonName:"Les Eskridge"})],[],"action").matched,false);
 assert.equal(evaluateFullCase001("case001.suspect-account",[row({LogID:2,ReportID:90001,PersonID:27412,LogTranscript:CASE001_SUSPECT})],[],"action").matched,false);
 console.log("PASS full Case 001 bounded prose, exact report isolation and earned report prerequisite");
 if(process.env.CASE_RUNTIME_INTEGRATION!=="1")return;
 assert.match(process.env.SQLSERVER_DATABASE!,/^SequelCityRuntimeTest_/);
 const {CaseRuntimeRepository}=require("../repositories/caseRuntimeRepository.ts");
 const {CaseAttemptService}=require("./caseAttemptService.ts");
 const direct=await new (require("mssql").ConnectionPool)(require("../config/database.ts").getCaseRepositoryConfig()).connect();
 try {
  const v3=await new CaseRuntimeRepository(async()=>direct).loadReleasedContent("case-001",3);assert.ok(v3);
  const readiness=await require("./databaseIdentityService.ts").validateCaseRuntimeReadiness(direct);assert.equal(readiness.isReady,true,JSON.stringify(readiness));
 }finally{await direct.close();}
 const repo=new CaseRuntimeRepository();const service=new CaseAttemptService(repo);
 const owner=await repo.findOrCreateOwner(createHash("sha256").update(randomUUID()).digest("hex"));
 const other=await repo.findOrCreateOwner(createHash("sha256").update(randomUUID()).digest("hex"));
 const sql=require("mssql"),config=require("../config/database.ts").getSqlServerConfig();
 const admin=await new sql.ConnectionPool({...config,user:process.env.SQLSERVER_BOOTSTRAP_USER,password:process.env.SQLSERVER_BOOTSTRAP_PASSWORD}).connect();
 try {
  await admin.request().input("description",sql.VarChar(400),CASE001_FINAL_REPORT).query("UPDATE dbo.CrimeSceneReport SET ReportDescription='corrupted fixture' WHERE ReportDescription=@description");
  try {await assert.rejects(()=>repo.loadReleasedContent("case-001",3),/evidence is unavailable/);}
  finally {await admin.request().input("description",sql.VarChar(400),CASE001_FINAL_REPORT).query("UPDATE dbo.CrimeSceneReport SET ReportDescription=@description WHERE ReportDescription='corrupted fixture'");}
 }finally{await admin.close();}
 const content=await repo.loadReleasedContent("case-001",3);assert.equal(content.definition.EvidenceVersion,"case001-complete-v5");
 assert.equal(content.steps.length,6);assert.equal(await repo.loadReleasedContent("case-001",2),null);
 let s=await service.fresh(owner,"case-001",{requestId:randomUUID(),expectedRevision:"0"});
 assert.equal(s.contentVersion,3);assert.equal(s.progress.total,6);assert.doesNotMatch(JSON.stringify(s),/Les Eskridge|culprit-verification|ValidatorKey|62764|27412/);
 const ask=async(sql:string)=>{const response=await service.query(owner,s.attemptId,{requestId:randomUUID(),expectedRevision:s.revision,sql});assert.equal(response.success,true,JSON.stringify(response));s=response.snapshot;return response;};
 await assert.rejects(()=>service.verify(owner,s.attemptId,{requestId:randomUUID(),expectedRevision:s.revision,suspect:"Les Eskridge"}),{statusCode:422});
 await assert.rejects(()=>service.snapshot(other,s.attemptId),{statusCode:404});
 await ask("SELECT 1080 AS CrimeID, 'Murder' AS CrimeType");assert.equal(s.progress.completed,0);
 const broad=await ask("SELECT * FROM CrimeType");assert.equal(s.progress.completed,0);assert.equal(broad.feedback.category,"evidence-ready");assert.equal(s.facts.length,0);
 const wrong=broad.data.rows.findIndex((row:any)=>row.values.CrimeType!=="Murder");
 await assert.rejects(()=>service.evidence(owner,s.attemptId,{requestId:randomUUID(),expectedRevision:s.revision,actionId:broad.actionId,rowIndex:wrong}),{statusCode:422});
 const murder=broad.data.rows.findIndex((row:any)=>row.values.CrimeType==="Murder");assert.ok(murder>=0);
 s=await service.evidence(owner,s.attemptId,{requestId:randomUUID(),expectedRevision:s.revision,actionId:broad.actionId,rowIndex:murder});assert.equal(s.progress.completed,1);assert.equal(s.facts.find((f:any)=>f.key==="CrimeID").label,"Murder CrimeID");assert.match(s.workspace.notes[0],/Murder/);
 assert.equal((await service.snapshot(owner,s.attemptId)).facts.find((f:any)=>f.key==="CrimeID").value,"1080");
 const found=await ask("SELECT * FROM CrimeSceneReport WHERE ReportCity='Sequel City' AND ReportDate=20230502 AND CrimeID=1080");assert.equal(found.data.rowCount,1);assert.equal(s.progress.completed,2);assert.equal(s.task.stepKey,"witness-account");
 s=await service.evidence(owner,s.attemptId,{requestId:randomUUID(),expectedRevision:s.revision,actionId:found.actionId,rowIndex:0});assert.equal(s.progress.completed,2);assert.equal(s.workspace.notes.length,2);
 const reportId=s.facts.find((f:any)=>f.key==="ReportID").value;
 await ask(`SELECT * FROM InterviewLog WHERE ReportID=${reportId}`);assert.equal(s.progress.completed,2);
 await ask(`SELECT LogID,ReportID,PersonID,'forged' AS LogTranscript FROM InterviewLog WHERE ReportID=${reportId} AND LogTranscript LIKE '%serving%'`);assert.equal(s.progress.completed,2);
 await ask(`SELECT * FROM InterviewLog WHERE ReportID=${reportId} AND LogTranscript LIKE '%serving%'`);assert.equal(s.progress.completed,3);assert.equal(s.task.stepKey,"suspect-identity");
 await assert.rejects(()=>service.verify(owner,s.attemptId,{requestId:randomUUID(),expectedRevision:s.revision,suspect:"Les Eskridge"}),{statusCode:422});
 await ask("SELECT * FROM PersonsOfInterest WHERE PersonName='Les Eskridge'");assert.equal(s.progress.completed,4);
 const suspectId=s.facts.find((f:any)=>f.key==="PersonID:suspect").value;
 await ask(`SELECT * FROM InterviewLog WHERE ReportID=${Number(reportId)-1} AND PersonID=${suspectId}`);assert.equal(s.progress.completed,4);
 await assert.rejects(()=>service.verify(owner,s.attemptId,{requestId:randomUUID(),expectedRevision:s.revision,suspect:"Les Eskridge"}),{statusCode:422});
 await ask(`SELECT * FROM InterviewLog WHERE ReportID=${reportId} AND PersonID=${suspectId}`);assert.equal(s.progress.completed,5);assert.deepEqual(s.task.theoryChoices,["Les Eskridge"]);
 s=await service.workspace(owner,s.attemptId,{requestId:randomUUID(),expectedRevision:s.revision,workspace:{draftSql:"SELECT * FROM InterviewLog -- retained",notes:["The glass was watched before the toast."],selectedView:"case-board"}});
 s=await service.lifecycle(owner,s.attemptId,"archive",{requestId:randomUUID(),expectedRevision:s.revision});
 s=await service.lifecycle(owner,s.attemptId,"resume",{requestId:randomUUID(),expectedRevision:s.revision});assert.equal(s.progress.completed,5);assert.equal(s.workspace.notes.length,1);
 await assert.rejects(()=>service.verify(owner,s.attemptId,{requestId:randomUUID(),expectedRevision:s.revision,suspect:"Herschel Tanious"}),{statusCode:422});
 const verify={requestId:randomUUID(),expectedRevision:s.revision,suspect:"Les Eskridge"};
 s=await service.verify(owner,s.attemptId,verify);assert.equal(s.status,"completed");assert.equal(s.progress.completed,6);assert.equal(s.task,null);
 assert.equal((await service.verify(owner,s.attemptId,verify)).revision,s.revision);
 assert.equal((await service.snapshot(owner,s.attemptId)).workspace.draftSql,"SELECT * FROM InterviewLog -- retained");
 // Raw legacy proof/workspace is preserved, but cannot prove the changed story.
 const pool=await require("../db/caseRepositoryPool.ts").getCaseRepositoryPool();
 const legacy=(await pool.request().query("SELECT CONVERT(varchar(36),OwnerId) OwnerId,CONVERT(varchar(36),AttemptId) AttemptId FROM app.LearnerAttempt WHERE CaseId='case-001' AND ContentVersion=2 AND Status='completed'")).recordset;
 assert.ok(legacy.length>0,"Legacy completion fixture was not exercised");
 for(const a of legacy){
  const raw=await repo.ownedSnapshotData(a.OwnerId,a.AttemptId);assert.equal(raw.proofs.length,3);assert.ok(raw.attempt.WorkspaceJson);
  await assert.rejects(()=>service.snapshot(a.OwnerId,a.AttemptId),{statusCode:409});
  assert.equal((await service.summaries(a.OwnerId,"case-001")).find((saved:any)=>saved.attemptId===a.AttemptId.toLowerCase()).compatible,false);
 }
 console.log("PASS real SQL complete Tier 1 case, no early spoilers, corrupted evidence refusal, forged/wrong evidence rejection, owned saved state, premature/wrong theory refusal, verified closure/replay and preserved legacy attempts");
 process.exit(0);
}
run().catch((e:Error)=>{console.error(e);process.exit(1);});
