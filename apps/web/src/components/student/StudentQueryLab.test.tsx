import * as apiClient from "../../api/client";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { StudentQueryLab } from "./StudentQueryLab";
import type { CaseAttemptController } from "../../useCaseAttempt";
function controller(caseId: string): CaseAttemptController {
  return { caseId, dossier:{caseId,title:"Authored case",dossier:"Public briefing",wholeCaseObjective:"Prove the whole case"},summaries:[],
    snapshot:{caseId,attemptId:"owned",status:"active",progress:{completed:0,total:16,savedAtUtc:"2026-10-14"},evidenceSteps:[],facts:[],
      briefingFacts:[{key:"city",label:"City from case briefing",value:"O'Brien City",displayValue:"O'Brien City",column:"ReportCity",valueType:"text",operator:"equals"},{key:"date",label:"Date from case briefing",value:"20230115",displayValue:"January 15, 2023",column:"ReportDate",valueType:"integer",operator:"equals"}],
      task:{stepKey:"report",title:"Authored current task",objective:"Current evidence",direction:"Only this direction",hint:"Authored hint",completionMode:"log",collection:{accepted:1,required:2}}},
    workspace:{draftSql:"SELECT * FROM CrimeSceneReport WHERE CrimeID = 1080 AND;",notes:[],selectedView:"workbench"},error:null,busy:false,dirty:false,updateWorkspace:vi.fn(),run:vi.fn(),verify:vi.fn().mockResolvedValue(undefined),log:vi.fn(),save:vi.fn() } as unknown as CaseAttemptController;
}
it.each(["case-001","case-004"])("uses one editor and typed briefing tokens without earning progress for %s",caseId=>{
  const c=controller(caseId);render(<StudentQueryLab controller={c} entered onEnter={vi.fn()}/>);
  expect(screen.getAllByLabelText("SQL Query")).toHaveLength(1);
  const helperTokens=screen.getByRole("region",{name:"Current query helper tokens"});
  expect(helperTokens.closest("details")).toBeNull();
  expect(screen.getByRole("button",{name:/City from case briefing/})).toBeVisible();
  expect(screen.getByRole("button",{name:/Date from case briefing/})).toBeVisible();
  const editor=screen.getByLabelText("SQL Query") as HTMLTextAreaElement; editor.setSelectionRange(editor.value.length,editor.value.length);
  fireEvent.click(screen.getByRole("button",{name:/City from case briefing/}));
  expect(c.updateWorkspace).toHaveBeenCalledWith({...c.workspace,draftSql:"SELECT * FROM CrimeSceneReport WHERE CrimeID = 1080 AND ReportCity = 'O''Brien City';"});
  fireEvent.click(screen.getByRole("button",{name:/Date from case briefing/}));
  expect(c.updateWorkspace).toHaveBeenCalledWith({...c.workspace,draftSql:"SELECT * FROM CrimeSceneReport WHERE CrimeID = 1080 AND ReportDate = 20230115;"});
  expect(c.run).not.toHaveBeenCalled(); expect(c.log).not.toHaveBeenCalled(); expect(c.snapshot!.progress.completed).toBe(0);
});
it("shows partial collection progress and keeps its retained draft",()=>{
 const c=controller("case-004");render(<StudentQueryLab controller={c} entered onEnter={vi.fn()}/>);
 expect(screen.getByText("Collected evidence: 1 / 2")).toBeInTheDocument();expect(screen.getByLabelText("SQL Query")).toHaveValue(c.workspace.draftSql);
});
it("uses database column and prefix operator for an earned membership token",()=>{
 const c=controller("case-004");c.snapshot!.facts=[{key:"FitMemberID:prefix",label:"Membership lead",value:"48Z",sourceActionId:"observed",column:"FitMemberID",valueType:"text",operator:"prefix"}];
 render(<StudentQueryLab controller={c} entered onEnter={vi.fn()}/>);fireEvent.click(screen.getByRole("button",{name:/Membership lead.*LIKE/}));
 expect(c.updateWorkspace).toHaveBeenCalledWith({...c.workspace,draftSql:expect.stringContaining("FitMemberID LIKE '48Z%'")});
});
it("shows a theory action only when the backend current task permits verification",async()=>{
 const c=controller("case-004");c.workspace.selectedView="case-board";c.snapshot!.task!.completionMode="verify";
 render(<StudentQueryLab controller={c} entered onEnter={vi.fn()}/>);fireEvent.change(screen.getByLabelText("Suspect name"),{target:{value:"My theory"}});
 await act(async()=>fireEvent.click(screen.getByRole("button",{name:"Test Theory"})));
 expect(c.verify).toHaveBeenCalledWith("My theory");expect(c.log).not.toHaveBeenCalled();
});

it("shows known briefing tokens before any query even when the current task does not consume them",()=>{
 const c=controller("case-004");for(const fact of c.snapshot!.briefingFacts!)fact.eligibleForTask=false;
 render(<StudentQueryLab controller={c} entered onEnter={vi.fn()}/>);
 expect(screen.getByRole("button",{name:/City from case briefing/})).toBeVisible();
 expect(screen.getByRole("button",{name:/Date from case briefing/})).toBeVisible();
 expect(c.run).not.toHaveBeenCalled();expect(c.log).not.toHaveBeenCalled();
 fireEvent.click(screen.getByRole("button",{name:"Case File"}));fireEvent.click(screen.getByRole("tab",{name:"Case Facts"}));
 expect(screen.getAllByRole("button",{name:/City from case briefing/})).toHaveLength(2);expect(c.snapshot!.progress.completed).toBe(0);
});
it("replaces a draft without a popup and can undo the starter",()=>{
 const c=controller("case-004");c.snapshot!.task!.starter={sql:"SELECT * FROM CrimeSceneReport",placeholders:{}};
 const original=c.workspace.draftSql;const confirm=vi.spyOn(window,"confirm");
 const view=render(<StudentQueryLab controller={c} entered onEnter={vi.fn()}/>);
 fireEvent.click(screen.getByRole("button",{name:"Use starter"}));
 expect(confirm).not.toHaveBeenCalled();expect(c.updateWorkspace).toHaveBeenLastCalledWith({...c.workspace,draftSql:c.snapshot!.task!.starter.sql});
 c.workspace={...c.workspace,draftSql:c.snapshot!.task!.starter.sql};view.rerender(<StudentQueryLab controller={c} entered onEnter={vi.fn()}/>);
 fireEvent.click(screen.getByRole("button",{name:"Undo starter"}));expect(c.updateWorkspace).toHaveBeenLastCalledWith({...c.workspace,draftSql:original});
 expect(screen.queryByRole("button",{name:"Undo starter"})).not.toBeInTheDocument();confirm.mockRestore();
});
it("explains a saved attempt pinned to an older case version",()=>{
 const c=controller("case-001");c.snapshot!.contentVersion=1;c.dossier!.contentVersion=2;
 render(<StudentQueryLab controller={c} entered onEnter={vi.fn()}/>);
 expect(screen.getByText(/This saved attempt uses case version 1/)).toHaveTextContent("Start Fresh to use version 2");
 expect(c.snapshot!.contentVersion).toBe(1);
});
it("explains report columns used against CrimeType without replacing the failed draft",async()=>{
 const schema=vi.spyOn(apiClient,"getSchemaTables").mockResolvedValue({success:true,data:{tables:[{schemaName:"dbo",tableName:"CrimeType",fullName:"dbo.CrimeType",columns:["CrimeID","CrimeType"].map((columnName,ordinal)=>({columnName,ordinal,dataType:"varchar",isNullable:false,maxLength:null,numericPrecision:null,numericScale:null,isPrimaryKey:false,isForeignKey:false})),primaryKey:null}],relationships:[]}} as Awaited<ReturnType<typeof apiClient.getSchemaTables>>);
 const c=controller("case-001");c.workspace.draftSql="SELECT * FROM CrimeType WHERE ReportCity = 'Sequel City' AND ReportDate = 20230502";
 c.snapshot!.task!.starter={sql:"SELECT * FROM CrimeSceneReport",placeholders:{}};
 c.run=vi.fn().mockResolvedValue({success:false,safety:{isAllowed:true},message:"Query execution failed. Verify the SQL and database connection.",feedback:{category:"invalid-column",execution:"failed",evidence:"unchanged",severity:"error",title:"Check the column names",explanation:"ReportCity and ReportDate are not columns in CrimeType.",nextAction:"This task's starter queries CrimeSceneReport"},snapshot:c.snapshot,progressSaved:false});
 render(<StudentQueryLab controller={c} entered onEnter={vi.fn()}/>);
 await waitFor(()=>expect(schema).toHaveBeenCalled());await act(async()=>{fireEvent.click(screen.getByRole("button",{name:"Run Query"}));});
 expect(screen.getByLabelText("Query feedback")).toHaveTextContent("ReportCity and ReportDate are not columns in CrimeType");
 expect(screen.getByLabelText("Query feedback")).toHaveTextContent("This task's starter queries CrimeSceneReport");
 expect(screen.getByLabelText("SQL Query")).toHaveValue(c.workspace.draftSql);expect(c.updateWorkspace).not.toHaveBeenCalled();expect(c.log).not.toHaveBeenCalled();schema.mockRestore();
});
it.each(["case-001","case-004"])("renders server feedback once and preserves the draft for %s",async(caseId)=>{
 const c=controller(caseId);c.run=vi.fn().mockResolvedValue({success:true,safety:{isAllowed:true},data:{rows:[],columns:[],rowCount:0},snapshot:c.snapshot,progressSaved:true,message:"Query executed successfully.",feedback:{category:"no-matches",execution:"succeeded",evidence:"unchanged",severity:"info",title:"No matching rows",explanation:"The query ran and returned 0 rows.",nextAction:"Check observed values and remove a condition."}});
 const view=render(<StudentQueryLab controller={c} entered onEnter={vi.fn()}/>);
 await act(async()=>{fireEvent.click(screen.getByRole("button",{name:"Run Query"}));});
 expect(screen.getAllByText("No matching rows")).toHaveLength(1);
 expect(screen.queryByRole("heading",{name:"Query Results"})).not.toBeInTheDocument();
 expect(screen.queryByText(/sticky Log Clue/)).not.toBeInTheDocument();expect(screen.getByLabelText("Query feedback")).toHaveTextContent("Check observed values");
 expect(screen.queryByText("Query executed successfully.")).not.toBeInTheDocument();expect(c.updateWorkspace).not.toHaveBeenCalled();expect(c.log).not.toHaveBeenCalled();
 c.workspace={...c.workspace,draftSql:"an edited draft"};view.rerender(<StudentQueryLab controller={c} entered onEnter={vi.fn()}/>);
 expect(screen.getByText(/This feedback is for the last executed query/)).toBeVisible();
});
it("does not replace newer feedback with an older query response",async()=>{
 const c=controller("case-001");let first!:(value:unknown)=>void;let second!:(value:unknown)=>void;
 c.run=vi.fn().mockImplementationOnce(()=>new Promise(resolve=>{first=resolve})).mockImplementationOnce(()=>new Promise(resolve=>{second=resolve}));
 render(<StudentQueryLab controller={c} entered onEnter={vi.fn()}/>);
 fireEvent.click(screen.getByRole("button",{name:"Run Query"}));fireEvent.click(screen.getByRole("button",{name:"Run Query"}));
 const response=(message:string)=>({success:false,safety:{isAllowed:true},message,snapshot:c.snapshot,progressSaved:false});
 await act(async()=>{second(response("Newer feedback"));});await act(async()=>{first(response("Older feedback"));});
 expect(screen.getByText("Newer feedback")).toBeVisible();expect(screen.queryByText("Older feedback")).not.toBeInTheDocument();
});
it.each([true,false])("keeps one feedback area for a clue logging outcome (%s)",async(logged)=>{
 const c=controller("case-004");c.log=vi.fn().mockResolvedValue(logged);
 c.run=vi.fn().mockResolvedValue({success:true,safety:{isAllowed:true},message:"Query executed successfully.",data:{columns:[{name:"CrimeID",ordinal:0,dataType:"number"}],rows:[{values:{CrimeID:1080},displayValues:{CrimeID:"1080"}}],rowCount:1},actionId:"action",snapshot:c.snapshot,progressSaved:true,feedback:{title:"Inspect this evidence",explanation:"One row returned",nextAction:"Read and log a clue"}});
 render(<StudentQueryLab controller={c} entered onEnter={vi.fn()}/>);
 await act(async()=>{fireEvent.click(screen.getByRole("button",{name:"Run Query"}));});
 await act(async()=>{fireEvent.click(screen.getByRole("button",{name:"Log row 1 as evidence"}));});
 const area=screen.getByLabelText("Query feedback");expect(area.querySelectorAll('[role="status"]')).toHaveLength(1);
 expect(area).toHaveTextContent(logged?"Row logged to your saved notebook.":"This clue is already logged.");
 expect(screen.queryByText("Inspect this evidence")).not.toBeInTheDocument();
 expect(document.querySelectorAll(".student-evidence-feedback--success")).toHaveLength(logged?1:0);
});
it("does not let a late clue log replace newer query feedback",async()=>{
 const c=controller("case-004");let finishLog!:(value:boolean)=>void;c.log=vi.fn().mockImplementation(()=>new Promise(resolve=>{finishLog=resolve}));
 c.run=vi.fn().mockResolvedValueOnce({success:true,safety:{isAllowed:true},message:"Old query",data:{columns:[{name:"CrimeID",ordinal:0,dataType:"number"}],rows:[{values:{CrimeID:1080},displayValues:{CrimeID:"1080"}}],rowCount:1},actionId:"old-action",snapshot:c.snapshot,progressSaved:true}).mockResolvedValueOnce({success:false,safety:{isAllowed:true},message:"New query feedback",snapshot:c.snapshot,progressSaved:false});
 render(<StudentQueryLab controller={c} entered onEnter={vi.fn()}/>);
 await act(async()=>{fireEvent.click(screen.getByRole("button",{name:"Run Query"}));});fireEvent.click(screen.getByRole("button",{name:"Log row 1 as evidence"}));
 await act(async()=>{fireEvent.click(screen.getByRole("button",{name:"Run Query"}));});await act(async()=>{finishLog(true);});
 expect(screen.getByText("New query feedback")).toBeVisible();expect(screen.queryByText("Clue logged")).not.toBeInTheDocument();
});
it("renders each pinned fact once, with only currently usable facts clickable",()=>{
 const c=controller("case-001");c.snapshot!.facts=[{key:"ReportCity",label:"Report city",value:"Sequel City",sourceActionId:"report",column:null},{key:"CrimeID",label:"Murder CrimeID",value:"1080",sourceActionId:"crime",column:null},{key:"ReportID",label:"Incident ReportID",value:"11229",sourceActionId:"report",column:"ReportID",valueType:"integer"}];
 render(<StudentQueryLab controller={c} entered onEnter={vi.fn()}/>);fireEvent.click(screen.getByRole("button",{name:"Case File"}));fireEvent.click(screen.getByRole("tab",{name:"Pinned Facts"}));
 expect(screen.getAllByText("Report city: Sequel City")).toHaveLength(1);expect(screen.getAllByText("Murder CrimeID: 1080")).toHaveLength(1);expect(screen.getAllByText("Incident ReportID: 11229")).toHaveLength(1);
 expect(screen.queryByRole("button",{name:"Report city: Sequel City",hidden:true})).not.toBeInTheDocument();expect(screen.getByRole("button",{name:"Incident ReportID: 11229"})).toBeVisible();
});