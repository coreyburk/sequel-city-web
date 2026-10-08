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