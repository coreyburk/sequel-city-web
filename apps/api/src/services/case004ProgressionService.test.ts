const assert = require("node:assert/strict");
const { collectCase004, profileCategories } = require("./case004ProgressionService.ts");
const row = (values: Record<string, any>) => ({ values, displayValues: Object.fromEntries(Object.entries(values).map(([k,v]) => [k,String(v)])) });
const fact = (key: string, value: string) => ({ key, value, label: key, sourceActionId: "observed" });
const collect = (step: string, rows: any[], facts: any[] = [], previous?: any, index = 0) => collectCase004(step, rows, rows[index], facts, previous, "action", {ReportCity:"SQL City",ReportDate:"20230115"});
assert.equal(collect("crime-type", [row({ CrimeType: "Murder" })]), null);
assert.equal(collect("crime-type", [row({ CrimeID: 1080, CrimeType: "Theft" })]), null);
assert.equal(collect("crime-type", [row({ CrimeID: 1080, CrimeType: "Murder" })]).completed, true);
const report = row({ ReportID: 10975, CrimeID: 1080, ReportCity: "SQL City", ReportDate: 20230115 });
assert.equal(collect("report-isolation", [report,report], [fact("CrimeID","1080")]), null);
assert.equal(collect("report-isolation", [report], [fact("CrimeID","1080")]).completed, true);
const witness = (id: number) => row({ LogID: id, PersonID: id, ReportID: 10975, LogTranscript: "I saw a gold membership starting 48Z." });
const linked = [fact("ReportID","10975")];
const first = collect("witness-observations", [witness(1),witness(2)], linked);
assert.equal(first.completed, false); assert.equal(first.items.length,1);
assert.equal(collect("witness-observations", [witness(1),witness(2)], linked, first).items.length,1);
assert.equal(collect("witness-observations", [witness(1),witness(2)], linked, first,1).completed,true);
assert.equal(collect("witness-observations", [row({ LogID:3, PersonID:3, ReportID:10975, LogTranscript:"I delivered the hit" })], linked),null);
assert.equal(collect("witness-observations", [witness(1)], [fact("ReportID","wrong")]),null);
assert.equal(collect("suspect-identity", [row({ PersonID:99,PersonName:"Guess" })], [fact("PersonID:suspect","1")]),null);
const profile = "A client put out a contract. The lady is a high-roller. We met three times last December near the Symphony. She wore stilettos and expensive jewelry. A redhead with a BMW M8, five foot five.";
assert.equal(profileCategories(profile).length,10);
const interview = row({ LogID: 10, PersonID:1,ReportID:10975,LogTranscript:profile });
assert.equal(collect("mastermind-profile",[interview],[...linked,fact("PersonID:suspect","1")]).completed,true);
const people = [fact("EventPersonID:candidate:1","1"),fact("EventPersonID:candidate:2","2")];
const events = [1,2,3].map(n => fact(`EventID:${n}`,String(n)));
const attendance = [1,2].flatMap(person => [1,2,3].map(event => row({ EventPersonID:person,EventID:event })));
assert.equal(collect("attendance-comparison",attendance,[...people,...events]).completed,true);
assert.equal(collect("attendance-comparison",attendance.slice(1),[...people,...events]),null);
const employment = [row({ SSN:1,AnnualIncome:200 }),row({ SSN:2,AnnualIncome:2000 })];
const ssns = [fact("SSN:candidate:1","1"),fact("SSN:candidate:2","2")];
assert.equal(collect("employment-comparison",employment,ssns),null);
assert.equal(collect("employment-comparison",employment,ssns,undefined,1).completed,true);
assert.equal(collect("employment-comparison",employment.slice(1),ssns),null);
console.log("PASS Case 004 distinct partial collections, source links, no fallback identifiers, profile coverage and ambiguous attendance/wealth comparison");

async function integration() {
  if (process.env.CASE_RUNTIME_INTEGRATION !== "1") return;
  assert.match(process.env.SQLSERVER_DATABASE!, /^SequelCityRuntimeTest_/);
  const { CaseAttemptService } = require("./caseAttemptService.ts");
  const { CaseRuntimeRepository } = require("../repositories/caseRuntimeRepository.ts");
  const { randomUUID, createHash } = require("node:crypto");
  const repo = new CaseRuntimeRepository();
  const owner = await repo.findOrCreateOwner(createHash("sha256").update(randomUUID()).digest("hex"));
  const other = await repo.findOrCreateOwner(createHash("sha256").update(randomUUID()).digest("hex"));
  const service = new CaseAttemptService(repo);
  let s = await service.fresh(owner,"case-004",{ requestId:randomUUID(),expectedRevision:"0" });
  let result:any;
  const mutate = () => ({ requestId:randomUUID(),expectedRevision:s.revision });
  async function query(sql:string) {
    result = await service.query(owner,s.attemptId,{ ...mutate(),sql });
    assert.equal(result.success,true,result.message); assert.equal(result.progressSaved,true,result.message);
    s=result.snapshot; return result.data.rows;
  }
  async function log(index:number) { s=await service.evidence(owner,s.attemptId,{ ...mutate(),actionId:result.actionId,rowIndex:index }); }
  async function findLog(column:string,value:string) { const index=result.data.rows.findIndex((row:any)=>String(row.values[column]).includes(value)); assert.ok(index>=0,`${column}: ${value}`); await log(index); }
  async function expectStep(key:string) { assert.equal(s.task?.stepKey,key); const restored=await new CaseAttemptService(new CaseRuntimeRepository()).snapshot(owner,s.attemptId); assert.deepEqual(restored.facts,s.facts); assert.equal(restored.task?.stepKey,key); }
  await expectStep("crime-type"); assert.equal(s.briefingFacts.length,2); assert.equal(s.facts.length,0);
  await assert.rejects(()=>service.verify(owner,s.attemptId,{...mutate(),suspect:"Jeremy Bowers"}),{statusCode:422});
  await assert.rejects(()=>service.query(other,s.attemptId,{...mutate(),sql:"SELECT * FROM CrimeType"}),{statusCode:404});
  await query("SELECT 1080 AS CrimeID, 'Murder' AS CrimeType"); assert.equal(s.progress.completed,0);
  await query("SELECT 1080 AS CrimeID, 'Murder' AS CrimeType FROM CrimeType WHERE CrimeID=1080");
  await assert.rejects(()=>service.evidence(owner,s.attemptId,{...mutate(),actionId:result.actionId,rowIndex:0}),{statusCode:422});
  assert.equal(s.progress.completed,0);
  await query("SELECT CrimeID AS Crime_ID, CrimeType AS Crime_Type FROM dbo.CrimeType");
  const pool=await require("../db/caseRepositoryPool.ts").getCaseRepositoryPool();
  const sqlTypes=require("mssql");
  await pool.request().input("attemptId",sqlTypes.NVarChar,s.attemptId).input("actionId",sqlTypes.NVarChar,result.actionId).query("UPDATE app.AttemptAction SET ExpiresAtUtc=DATEADD(second,-1,SYSUTCDATETIME()) WHERE AttemptId=@attemptId AND ActionId=@actionId");
  await assert.rejects(()=>service.evidence(owner,s.attemptId,{...mutate(),actionId:result.actionId,rowIndex:0}),{statusCode:422});
  await query("SELECT CrimeID AS Crime_ID, CrimeType AS Crime_Type FROM dbo.CrimeType");
  const murderIndex=result.data.rows.findIndex((row:any)=>row.values.Crime_Type==="Murder"); assert.ok(murderIndex>=0);
  const beforeRace=s.revision;
  s=await service.workspace(owner,s.attemptId,{...mutate(),workspace:{...s.workspace,draftSql:"retained draft"}});
  await assert.rejects(()=>service.evidence(owner,s.attemptId,{requestId:randomUUID(),expectedRevision:beforeRace,actionId:result.actionId,rowIndex:murderIndex}),{statusCode:409});
  const crimeAction=result.actionId;
  await log(murderIndex);
  await assert.rejects(()=>service.evidence(owner,s.attemptId,{...mutate(),actionId:crimeAction,rowIndex:murderIndex}),{statusCode:422});
  const otherCase=await service.fresh(owner,"case-001",{requestId:randomUUID(),expectedRevision:"0"});
  await assert.rejects(()=>service.evidence(owner,otherCase.attemptId,{requestId:randomUUID(),expectedRevision:otherCase.revision,actionId:crimeAction,rowIndex:murderIndex}),{statusCode:422});
  assert.equal((await service.snapshot(owner,s.attemptId)).status,"active");
  assert.equal((await service.snapshot(owner,otherCase.attemptId)).progress.completed,0);
  await expectStep("report-inspection"); await query("SELECT * FROM CrimeSceneReport");
  await expectStep("report-isolation");
  await query("SELECT 999999 AS ReportID, CrimeID,ReportCity,ReportDate FROM CrimeSceneReport WHERE ReportID=10975");
  await assert.rejects(()=>service.evidence(owner,s.attemptId,{...mutate(),actionId:result.actionId,rowIndex:0}),{statusCode:422});
  await query("SELECT * FROM CrimeSceneReport WHERE CrimeID=1080"); assert.equal(s.progress.completed,2);
  await query("SELECT * FROM CrimeSceneReport WHERE ReportCity='SQL City' AND ReportDate=20230115 AND CrimeID=1080"); await log(0);
  await expectStep("witness-observations"); await query("SELECT * FROM InterviewLog WHERE ReportID=10975 ORDER BY PersonID,LogID");
  await findLog("PersonID","14887"); await expectStep("witness-observations");
  const count=s.task.collection.accepted; await findLog("PersonID","14887"); assert.equal(s.task.collection.accepted,count);
  await findLog("PersonID","16371"); await expectStep("witness-identities");
  await query("SELECT * FROM PersonsOfInterest WHERE PersonID IN (14887,16371)"); await log(0); await expectStep("witness-identities"); await log(1);
  await expectStep("gym-lead"); await query("SELECT * FROM FitNFlabClub WHERE FitMemberID LIKE '48Z%' AND FitMembershipStatus='gold'"); await findLog("PersonID","67318");
  await expectStep("suspect-identity"); await query("SELECT * FROM PersonsOfInterest WHERE PersonID=67318"); await log(0);
  await expectStep("suspect-confession"); await query("SELECT * FROM InterviewLog WHERE ReportID=10975 AND PersonID=67318");
  const confession=result.data.rows.findIndex((row:any)=>/i whacked|so i delivered|i delivered the hit|i delivered\./i.test(row.values.LogTranscript)); assert.ok(confession>=0); await log(confession);
  await expectStep("murderer-verification");
  await assert.rejects(()=>service.verify(owner,s.attemptId,{...mutate(),suspect:"Miranda Priestly"}),{statusCode:422});
  await assert.rejects(()=>service.verify(owner,s.attemptId,{...mutate(),suspect:"   "}),{statusCode:422});
  await assert.rejects(()=>service.verify(owner,s.attemptId,{...mutate(),suspect:"nobody"}),{statusCode:422});
  s=await service.verify(owner,s.attemptId,{...mutate(),suspect:"Jeremy Bowers"}); await expectStep("mastermind-profile");
  await query("SELECT * FROM InterviewLog WHERE PersonID=67318 AND ReportID=10975");
  for(let i=0;i<result.data.rows.length && s.task.stepKey==="mastermind-profile";i++) {
    if(profileCategories(result.data.rows[i].values.LogTranscript).length) await log(i);
  }
  await expectStep("mastermind-candidates");
  await query("SELECT * FROM DriversLicense WHERE Gender='female' AND HairColor='red' AND CarMake='BMW' AND CarModel='M8' AND Height BETWEEN 65 AND 67");
  await log(0); await expectStep("mastermind-candidates"); await log(1); await expectStep("mastermind-identities");
  await query("SELECT * FROM PersonsOfInterest WHERE LicenseID IN (202298,857212)"); await log(0); await expectStep("mastermind-identities"); await log(1);
  await expectStep("symphony-events"); await query("SELECT * FROM EventSchedule WHERE EventDate LIKE '2022-12%' AND EventName LIKE '%Symphony%'");
  for(let i=0;i<3;i++){await log(i); if(i<2) await expectStep("symphony-events");}
  await expectStep("attendance-comparison");
  await query("SELECT * FROM EventRegistration WHERE EventID IN (2669,3005,3257) AND EventPersonID IN (14307,99716)");
  await expectStep("employment-comparison"); await query("SELECT * FROM Employment WHERE SSN IN (987756388,362878596)"); await findLog("SSN","987756388");
  await expectStep("mastermind-verification"); s=await service.verify(owner,s.attemptId,{...mutate(),suspect:"Miranda Priestly"});
  assert.equal(s.task,null); assert.equal(s.status,"completed"); assert.equal(s.progress.completed,16);
  console.log("PASS live Case 004 sixteen-step path, distinct collection resume, both prerequisite-gated roles and complete resolution");
}
integration().then(()=>{if(process.env.CASE_RUNTIME_INTEGRATION==="1")process.exit(0);}).catch((error:any)=>{console.error(error);process.exit(1);});
