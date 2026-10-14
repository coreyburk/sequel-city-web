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
 c.run=vi.fn().mockResolvedValue({success:false,safety:{isAllowed:true},message:"Query execution failed. Verify the SQL and database connection.",snapshot:c.snapshot,progressSaved:false});
 render(<StudentQueryLab controller={c} entered onEnter={vi.fn()}/>);
 await waitFor(()=>expect(schema).toHaveBeenCalled());await act(async()=>{fireEvent.click(screen.getByRole("button",{name:"Run Query"}));});
 expect(screen.getByText(/ReportCity and ReportDate are not columns in CrimeType/)).toHaveTextContent("This task's starter queries CrimeSceneReport");
 expect(screen.getByLabelText("SQL Query")).toHaveValue(c.workspace.draftSql);expect(c.updateWorkspace).not.toHaveBeenCalled();expect(c.log).not.toHaveBeenCalled();schema.mockRestore();
});