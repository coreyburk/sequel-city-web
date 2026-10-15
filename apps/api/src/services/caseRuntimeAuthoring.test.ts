const assert = require("node:assert/strict");
const { randomUUID } = require("node:crypto");
const { CaseAttemptService } = require("./caseAttemptService.ts");

async function run() {
  // Display counts depend on a registered handler, not a production case ID.
  const attempt = { AttemptId:"owned",CaseId:"case-008",ContentVersion:1,EvidenceVersion:"sequel-evidence-v1",Status:"active",Revision:"0",UpdatedAtUtc:new Date(),WorkspaceJson:JSON.stringify({draftSql:"retained",notes:[],selectedView:"workbench"}) };
  const content = { definition:{EvidenceVersion:attempt.EvidenceVersion,CompletionScope:"evidence-review"},steps:[{StepKey:"witness-notes",ValidatorKey:"case004.witness-observations",DisplayOrder:0,TaskTitle:"Read the witnesses.",StepObjective:"Read accounts.",SamuelDirection:"Inspect accounts.",CompletionMode:"log"}],prerequisites:[] };
  const fake = {loadOwnedAttempt:async()=>attempt,loadReleasedContent:async()=>content,ownedSnapshotData:async()=>({attempt,proofs:[],items:[{StepKey:"witness-notes",ItemKey:"one",ProofJson:'{"facts":[]}'}]})};
  const snapshot = await new CaseAttemptService(fake).snapshot("owner","owned");
  assert.deepEqual(snapshot.task.collection,{accepted:1,required:2});
  assert.equal(snapshot.workspace.draftSql,"retained");
  content.steps[0].ValidatorKey="case001.crime-type";
  assert.equal((await new CaseAttemptService(fake).snapshot("owner","owned")).task.collection,undefined);
  console.log("PASS registered-handler collection counts independent of case ID; query handlers retain their projection");
  if(process.env.CASE_RUNTIME_INTEGRATION!=="1") return;
  assert.match(process.env.SQLSERVER_DATABASE!,/^SequelCityRuntimeTest_[A-Za-z0-9_]+$/);
  const sql=require("mssql");const {readFileSync}=require("node:fs");const path=require("node:path");
  const {getSqlServerConfig}=require("../config/database.ts");
  const {CaseRuntimeRepository}=require("../repositories/caseRuntimeRepository.ts");
  const {getCaseRepositoryPool}=require("../db/caseRepositoryPool.ts");
  const repo=new CaseRuntimeRepository();
  assert.equal((await repo.listReleasedCases()).some((d:any)=>d.CaseId==="case-008"),false,"Fixture entered shipped seed");
  const admin=await new sql.ConnectionPool({...getSqlServerConfig(),user:process.env.SQLSERVER_BOOTSTRAP_USER,password:process.env.SQLSERVER_BOOTSTRAP_PASSWORD}).connect();
  try {
    const fixture=readFileSync(path.join(process.cwd(),"src/services/fixtures/case-runtime-authoring.sql"),"utf8");
    await admin.request().query(fixture);
    const {validateCaseContent}=require("./caseContentValidationService.ts");
    const authored=await repo.loadReleasedContent("case-008",1);assert.deepEqual(validateCaseContent(authored),[]);
    assert.equal(authored.definition.CompletionScope,"evidence-review");
    assert.equal(await repo.loadReleasedContent("fixture-authoring-draft",1),null);
    assert.equal(await repo.loadReleasedContent("fixture-authoring-retired",1),null);
    await assert.rejects(()=>admin.request().query("UPDATE app.CaseStep SET Hint='rewritten' WHERE CaseId='case-008'"));
    // Changes to an unpublished draft cannot mutate the released fixture.
    assert.equal((await repo.loadReleasedContent("case-008",1)).steps[0].StepKey,"catalogue");
    const {buildApp}=require("../app.ts");const app=await buildApp();
    try {
      const origin="http://127.0.0.1:4173";
      const session=await app.inject({url:"/api/session",headers:{origin}});assert.equal(session.statusCode,200);
      const cookie=String(session.headers["set-cookie"]).split(";")[0];
      const headers={origin,cookie,"x-csrf-token":session.json().csrfToken};
      const dossiers=(await app.inject({url:"/api/cases"})).json().cases;
      assert.ok(dossiers.some((d:any)=>d.caseId==="case-008"));
      assert.ok(dossiers.every((d:any)=>!d.caseId.startsWith("fixture-")));
      for(const id of ["fixture-authoring-draft","fixture-authoring-retired"]) {
        const denied=await app.inject({method:"POST",url:`/api/cases/${id}/attempts`,headers,payload:{requestId:randomUUID(),expectedRevision:"0"}});assert.equal(denied.statusCode,404);
      }
      let response=await app.inject({method:"POST",url:"/api/cases/case-008/attempts",headers,payload:{requestId:randomUUID(),expectedRevision:"0"}});
      assert.equal(response.statusCode,200);let s=response.json();
      const id=s.attemptId;
      const mutate=async(suffix:string,extra:any={},method="POST")=>{
        const result=await app.inject({method,url:`/api/attempts/${id}${suffix}`,headers,payload:{requestId:randomUUID(),expectedRevision:s.revision,...extra}});
        assert.equal(result.statusCode,200,result.body);return result.json();
      };
      assert.equal(s.task.stepKey,"catalogue");assert.deepEqual(s.task.collection,{accepted:0,required:1});
      assert.equal(s.briefingFacts.find((f:any)=>f.column==="ReportCity").value,"Sequel City");
      assert.doesNotMatch(JSON.stringify(s),/Inspect the incident archive|Isolate the briefing incident|case004\.|ValidatorParametersJson/);
      const forged=await mutate("/query",{sql:"SELECT 1080 AS CrimeID, 'Murder' AS CrimeType FROM CrimeType WHERE CrimeID=1080"});s=forged.snapshot;
      const deniedForgery=await app.inject({method:"POST",url:`/api/attempts/${id}/evidence`,headers,payload:{requestId:randomUUID(),expectedRevision:s.revision,actionId:forged.actionId,rowIndex:0}});
      assert.equal(deniedForgery.statusCode,422);assert.equal(s.progress.completed,0);
      let q=await mutate("/query",{sql:"SELECT * FROM CrimeType WHERE CrimeType='Murder'"});s=q.snapshot;
      assert.equal(s.progress.completed,0,"Execution alone cannot log a clue");
      const crime=q.actionId;s=await mutate("/evidence",{actionId:crime,rowIndex:0});
      assert.equal(s.task.stepKey,"archive");assert.equal(s.progress.completed,1);
      const retained={draftSql:"SELECT * FROM CrimeSceneReport -- retained custom draft",notes:["my independent case note"],selectedView:"workbench"};
      s=await mutate("/workspace",{workspace:retained},"PATCH");
      const proofBefore=JSON.stringify(await repo.proofs(id));
      s=await mutate("/archive");s=await mutate("/resume");
      assert.deepEqual(s.workspace,retained);assert.equal(JSON.stringify(await repo.proofs(id)),proofBefore);
      const invalid=await app.inject({method:"POST",url:`/api/attempts/${id}/evidence`,headers,payload:{requestId:randomUUID(),expectedRevision:s.revision,actionId:crime,rowIndex:0}});assert.equal(invalid.statusCode,422);
      const theory=await app.inject({method:"POST",url:`/api/attempts/${id}/verify`,headers,payload:{requestId:randomUUID(),expectedRevision:s.revision,suspect:"nobody"}});assert.equal(theory.statusCode,422);
      q=await mutate("/query",{sql:"SELECT * FROM CrimeSceneReport"});s=q.snapshot;assert.equal(s.task.stepKey,"incident");
      q=await mutate("/query",{sql:"SELECT * FROM CrimeSceneReport WHERE ReportCity='Sequel City'"});s=q.snapshot;
      assert.equal(s.progress.completed,2);assert.equal(q.feedback.category,"narrow-results");
      const rejected=await app.inject({method:"POST",url:`/api/attempts/${id}/evidence`,headers,payload:{requestId:randomUUID(),expectedRevision:s.revision,actionId:q.actionId,rowIndex:0}});assert.equal(rejected.statusCode,422);
      q=await mutate("/query",{sql:"SELECT * FROM CrimeSceneReport WHERE CrimeID=1080 AND ReportCity='Sequel City' AND ReportDate=20230115"});s=q.snapshot;
      s=await mutate("/evidence",{actionId:q.actionId,rowIndex:0});
      assert.equal(s.status,"completed");assert.equal(s.task,null);assert.equal(s.progress.completed,3);
      assert.equal((await repo.proofs(id)).length,3);assert.equal((await repo.evidenceItems(id)).length,2);
      assert.equal(s.facts.find((f:any)=>f.key==="ReportID").value,"10975");
      const restored=(await app.inject({url:`/api/attempts/${id}`,headers:{cookie}})).json();assert.equal(restored.status,"completed");assert.ok(restored.workspace.notes.includes(retained.notes[0]));
      console.log("PASS disposable SQL-authored case through real API: discovery, typed facts, canonical log/query/log proof, ordered resume, catalogue isolation, immutability and verifier refusal");
      if(process.env.CASE_RUNTIME_BROWSER_TESTS==="1") {
        const {spawn}=require("node:child_process");const net=require("node:net");
        const probe=net.createServer();await new Promise(r=>probe.listen(0,"127.0.0.1",r));const webPort=probe.address().port;await new Promise(r=>probe.close(r));
        // Runtime routes capture allowed origins at registration; build a fresh app after setting it.
        process.env.CASE_RUNTIME_ALLOWED_ORIGINS=`http://127.0.0.1:${webPort},http://127.0.0.1:4173`;
        const browserApp=await buildApp();await browserApp.listen({host:"127.0.0.1",port:0});
        const root=path.resolve(process.cwd(),"../..");const env={...process.env,VITE_API_BASE_URL:`http://127.0.0.1:${browserApp.server.address().port}`,PLAYWRIGHT_BASE_URL:`http://127.0.0.1:${webPort}`,CASE_AUTHORING_LIVE:"1"};
        const vite=spawn(process.execPath,[path.join(root,"node_modules/vite/bin/vite.js"),"--host","127.0.0.1","--port",String(webPort),"--strictPort"],{cwd:path.join(root,"apps/web"),env,stdio:"ignore",windowsHide:true});
        try {
          let ready=false;for(let n=0;n<100;n++){try{if((await fetch(env.PLAYWRIGHT_BASE_URL)).ok){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,100));}assert.equal(ready,true);
          const code=await new Promise(resolve=>{const child=spawn(process.execPath,[path.join(root,"node_modules/@playwright/test/cli.js"),"test","case-runtime-authoring.spec.ts"],{cwd:path.join(root,"apps/web"),env,stdio:"inherit",windowsHide:true});child.on("exit",(c:number)=>resolve(c??1));child.on("error",()=>resolve(1));});
          assert.equal(code,0,"Authored-case browser proof failed");
        } finally {vite.kill();await browserApp.close();}
      }
    } finally {await app.close();}
  } finally {await admin.close();}
}
run().then(()=>{if(process.env.CASE_RUNTIME_INTEGRATION==="1")process.exit(0);}).catch((error:any)=>{console.error(error);process.exit(1);});
