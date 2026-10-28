const assert = require("node:assert/strict");
const { executionFailureFeedback, queryLearningFeedback } = require("./queryAttemptFeedbackService.ts");
const schema = { tables: [
  {schemaName:"dbo",tableName:"CrimeType",columns:[{columnName:"CrimeID"},{columnName:"CrimeType"}]},
  {schemaName:"dbo",tableName:"CrimeSceneReport",columns:[{columnName:"ReportCity"},{columnName:"ReportDate"}]},
  {schemaName:"app",tableName:"HiddenContent",columns:[{columnName:"SecretColumn"}]}
],relationships:[] };
async function run() {
  const cases = [[207,"invalid-column"],[208,"invalid-table"],[209,"ambiguous-column"],[102,"syntax"],[105,"syntax"],[156,"syntax"],[245,"conversion"],[241,"conversion"],[8114,"conversion"],[8115,"conversion"],[-2,"timeout"],[18456,"unavailable"],[99999,"execution-error"]];
  for (const [number,category] of cases) {
    const feedback = await executionFailureFeedback({number,message:"password=SECRET server=PRIVATE hidden=ANSWER"},"SELECT * FROM CrimeType",async()=>schema);
    assert.equal(feedback.category,category);assert.equal(feedback.execution,"failed");assert.doesNotMatch(JSON.stringify(feedback),/SECRET|PRIVATE|ANSWER/);
  }
  for (const code of ["ETIMEOUT","ELOGIN","ESOCKET","ECONNCLOSED","ENOTOPEN","ECONNREFUSED"]) assert.equal((await executionFailureFeedback({code},"SELECT * FROM CrimeType",async()=>schema)).category,code==="ETIMEOUT"?"timeout":"unavailable");
  assert.equal((await executionFailureFeedback({originalError:{info:{number:209}}},"SELECT * FROM CrimeType",async()=>schema)).category,"ambiguous-column");
  const failure={number:207,message:"Invalid column name 'ReportDate'.",precedingErrors:[{number:207,message:"Invalid column name 'ReportCity'."},{number:207,message:"Invalid column name 'SecretColumn'."}]};
  const mismatch=await executionFailureFeedback(failure,"SELECT * FROM [dbo].[CrimeType] c WHERE c.ReportDate=20230502",async()=>schema);
  assert.match(mismatch.explanation,/ReportDate and ReportCity are not columns in CrimeType/);assert.doesNotMatch(JSON.stringify(mismatch),/SecretColumn/);
  for(const sql of ["SELECT a.ReportDate FROM CrimeType a JOIN CrimeSceneReport b ON a.CrimeID=b.CrimeID","WITH c AS (SELECT * FROM CrimeType) SELECT ReportDate FROM c","SELECT * FROM CrimeType -- FROM x"]){
    const fallback=await executionFailureFeedback(failure,sql,async()=>schema);assert.match(fallback.explanation,/query context/);
  }
  const unavailableMetadata=await executionFailureFeedback(failure,"SELECT * FROM CrimeType",async()=>{throw new Error("private metadata")});assert.equal(unavailableMetadata.category,"invalid-column");assert.doesNotMatch(JSON.stringify(unavailableMetadata),/private metadata/);
  const before={task:{completionMode:"query",starter:{sql:"SELECT * FROM CrimeSceneReport"}},status:"active",completionScope:"evidence-review",facts:[]};
  const success=(count:number)=>({success:true,safety:{isAllowed:true},message:"Query executed successfully.",data:{rowCount:count,rows:[],columns:[]}});
  const describe=(count:number,extra:any={})=>queryLearningFeedback(success(count),{before,saved:true,...extra});
  assert.equal(describe(0).category,"no-matches");assert.doesNotMatch(JSON.stringify(describe(0)),/1080|2080|Sequel City|ReportID/);
  assert.equal(describe(183).category,"results"); // Broad inspection is not automatically an error.
  assert.equal(describe(183,{isolationNeeded:true}).category,"narrow-results");
  assert.match(describe(2,{isolationNeeded:true}).explanation,/one isolated evidence record/);
  assert.doesNotMatch(describe(2,{isolationNeeded:true}).explanation,/isolated incident/);
  assert.equal(describe(1,{sourcePresent:false}).category,"unrelated-results");
  assert.equal(describe(2,{readyToLog:true}).category,"evidence-ready");
  const selected=describe(2,{before:{...before,task:{completionMode:"query"}},readyToLog:true});
  assert.equal(selected.title,"Read and select the relevant account");
  assert.match(selected.nextAction,/Other returned statements can be saved as notes/);
  assert.equal(describe(2,{before:{...before,task:{collection:{accepted:1,required:2}}},readyToLog:true}).category,"partial-collection");
  assert.equal(describe(1,{matched:true,after:{status:"active"}}).category,"task-proved");
  const end=describe(1,{matched:true,after:{status:"completed",completionScope:"evidence-review"}});assert.equal(end.category,"review-complete");assert.match(end.nextAction,/not included/);
  assert.equal(describe(1,{matched:true,after:{status:"completed",completionScope:"full-resolution"}}).category,"investigation-complete");
  assert.equal(describe(1,{saved:false,matched:true}).category,"progress-not-saved");
  assert.equal(describe(0,{before:{...before,task:null}}).category,"review-complete");
  const limited=queryLearningFeedback({...success(100),data:{...success(100).data,isTruncated:true}},{before,saved:true,candidateLimit:true});assert.match(limited.explanation,/at least 100/);assert.equal(limited.countIsLimited,true);
  const failed=queryLearningFeedback({success:false,safety:{isAllowed:true},message:"generic",feedback:mismatch},{before,saved:false,starter:"SELECT * FROM CrimeSceneReport"});assert.match(failed.nextAction,/starter is SELECT \* FROM CrimeSceneReport/);
  const denied=queryLearningFeedback({success:false,safety:{isAllowed:false},message:"Query blocked: read-only"},{before,saved:false});assert.equal(denied.category,"blocked");assert.match(denied.explanation,/Query blocked/);
  console.log("PASS structured SQL diagnostics, public-schema-only mismatch guidance, honest fallbacks, learning outcomes and bounded counts");
}
run().catch((error:unknown)=>{console.error(error);process.exitCode=1});
