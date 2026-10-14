const assert = require("node:assert/strict");
const { validateCaseContent } = require("./caseContentValidationService.ts");
function fixture() {
 return {
  definition: { CaseId:"fixture",ContentVersion:1,Title:"Fixture",Dossier:"Inspect evidence.",WholeCaseObjective:"Identify the crime type.",EntryStepKey:"first",EvidenceVersion:"sequel-evidence-v1",CompletionScope:"evidence-review",ReleaseStatus:"draft" },
  steps:[{CaseId:"fixture",ContentVersion:1,StepKey:"first",DisplayOrder:0,TaskTitle:"Inspect.",StepObjective:"Find evidence.",SamuelDirection:"Begin with the catalogue.",Hint:null,StarterSql:"SELECT * FROM CrimeType;",CompletionMode:"query",ValidatorKey:"case001.crime-type",ValidatorParametersJson:"{}"}],
  prerequisites:[]
 };
}
assert.deepEqual(validateCaseContent(fixture()),[]);
for (const alter of [
 (c:any)=>{c.steps[0].ValidatorKey="arbitrary.script";},
 (c:any)=>{c.steps[0].CompletionMode="verify";},
 (c:any)=>{c.steps[0].ValidatorParametersJson='{"sql":"DROP TABLE x"}';},
 (c:any)=>{c.steps[0].StarterSql="SELECT * FROM app.CaseStep;";},
 (c:any)=>{c.steps[0].StarterSql="SELECT * FROM CrimeType WHERE CrimeID=1080;";},
 (c:any)=>{c.steps[0].SamuelDirection="Use PersonID = 12345";},
 (c:any)=>{c.steps[0].ContentVersion=2;},
 (c:any)=>{c.definition.EvidenceVersion="other";},
 (c:any)=>{c.prerequisites.push({CaseId:"fixture",ContentVersion:1,StepKey:"first",RequiredStepKey:"missing"});},
 (c:any)=>{c.steps.push({...c.steps[0],StepKey:"second",DisplayOrder:1});},
 (c:any)=>{c.steps.push({...c.steps[0],StepKey:"second",DisplayOrder:1});c.prerequisites.push({CaseId:"fixture",ContentVersion:1,StepKey:"first",RequiredStepKey:"second"},{CaseId:"fixture",ContentVersion:1,StepKey:"second",RequiredStepKey:"first"});}
]) {const c=fixture();alter(c);assert.ok(validateCaseContent(c).length);}
console.log("PASS author validation: supported scaffold, validator/mode/parameter schema, spoiler IDs, versions, reachability and cycles");
{
 const base = { definition: {CaseId:"future-case",ContentVersion:1,Title:"Future case",Dossier:"Public dossier",WholeCaseObjective:"Resolve evidence",EntryStepKey:"entry",EvidenceVersion:"sequel-evidence-v1",CompletionScope:"evidence-review",ReleaseStatus:"draft"},
 steps:["entry","left","right","join"].map((StepKey,index)=>({CaseId:"future-case",ContentVersion:1,StepKey,DisplayOrder:index,TaskTitle:StepKey,StepObjective:"Read evidence",SamuelDirection:"Inspect records",Hint:null,StarterSql:"SELECT * FROM CrimeType",CompletionMode:"query",ValidatorKey:"case001.crime-type",ValidatorParametersJson:"{}"})),
 prerequisites:[{StepKey:"left",RequiredStepKey:"entry"},{StepKey:"right",RequiredStepKey:"entry"},{StepKey:"join",RequiredStepKey:"left"},{StepKey:"join",RequiredStepKey:"right"}].map(edge=>({CaseId:"future-case",ContentVersion:1,...edge})),
 factDefinitions:[{CaseId:"future-case",ContentVersion:1,FactKey:"city",Label:"Known city",EvidenceColumn:"ReportCity",ValueType:"text",Cardinality:"single"}],
 briefingFacts:[{CaseId:"future-case",ContentVersion:1,FactKey:"city",ItemKey:"known",ValueType:"text",TextValue:"Public City",IntegerValue:null,DecimalValue:null,DateValue:null,DisplayValue:"Public City"}],
 factBindings:[{CaseId:"future-case",ContentVersion:1,StepKey:"entry",FactKey:"city",BindingUse:"output",SourceStepKey:null,InsertOperator:null},{CaseId:"future-case",ContentVersion:1,StepKey:"join",FactKey:"city",BindingUse:"input",SourceStepKey:"entry",InsertOperator:"equals"}]
 };
 assert.deepEqual(validateCaseContent(base),[]);
 const bad=structuredClone(base);bad.briefingFacts[0].IntegerValue=123;
 assert.ok(validateCaseContent(bad).some((error:string)=>error.includes("typed briefing")));
 const duplicateBriefing=structuredClone(base);duplicateBriefing.briefingFacts.push({...duplicateBriefing.briefingFacts[0],ItemKey:"second"});
 assert.ok(validateCaseContent(duplicateBriefing).some((error:string)=>error.includes("Single briefing fact")));
 const wrongSource=structuredClone(base);wrongSource.factBindings[1].SourceStepKey="join";
 assert.ok(validateCaseContent(wrongSource).some((error:string)=>error.includes("prerequisite output")));
 console.log("PASS synthetic branched AND case, typed authored facts and prerequisite-bound provenance");
}