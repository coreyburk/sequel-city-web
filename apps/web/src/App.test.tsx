import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import App from "./App";
import { createCaseAttempt, getCaseDossiers, getFullHealth, saveCaseWorkspace } from "./api/client";
import type { AttemptSnapshot } from "./api/types";
const readyHealth = { success:true,data:{ api:"ok",database:{status:"ok",isConnected:true,databaseName:"SequelCityCrimesDB",message:"Connected"},bootstrap:{status:"ready",pendingMigrationKeys:[],message:"Ready"},schema:{status:"ok",tableCount:10} } };
vi.mock("./api/client",async importOriginal=>({ ...await importOriginal<typeof import("./api/client")>(),
 getFullHealth:vi.fn(),getCaseDossiers:vi.fn().mockResolvedValue({cases:["case-001","case-004"].map(caseId=>({caseId,contentVersion:2,title:`Database title ${caseId}`,dossier:`Database dossier ${caseId}`,wholeCaseObjective:`Whole investigation ${caseId}`,completionScope:caseId==="case-001"?"evidence-review":"full-resolution"}))}),
 getCaseAttempts:vi.fn().mockResolvedValue({attempts:[]}),createCaseAttempt:vi.fn(),saveCaseWorkspace:vi.fn(),getSchemaTables:vi.fn().mockResolvedValue({success:true,data:{tables:[]}})
}));
vi.mock("./components/HealthStatus",()=>({HealthStatus:()=> <h2>Health Status</h2>}));
vi.mock("./components/SchemaExplorer",()=>({SchemaExplorer:()=> <h2>Schema Explorer</h2>}));
vi.mock("./components/QueryRunner",()=>({QueryRunner:()=> <h2>Admin Query Runner</h2>}));
vi.mock("./components/QueryHistoryPanel",()=>({QueryHistoryPanel:()=> <h2>Query History</h2>}));
vi.mock("./components/SuspectVerificationPanel",()=>({SuspectVerificationPanel:()=> <h2>Admin Verification</h2>}));
function snapshot(caseId:string):AttemptSnapshot {
 return {caseId,contentVersion:2,evidenceVersion:"v1",attemptId:"00000000-0000-4000-8000-000000000001",revision:"0",status:"active",completionScope:caseId==="case-001"?"evidence-review":"full-resolution",progress:{completed:0,total:caseId==="case-001"?3:16,savedAtUtc:"2026-10-14"},evidenceSteps:[{stepKey:"crime-type",title:"Recorded crime type",status:"current"}],task:{stepKey:"crime-type",title:"Recorded crime type",objective:"Current evidence objective",direction:"Database current direction",starter:{sql:"SELECT * FROM CrimeType",placeholders:{}}},facts:[],workspace:{draftSql:"",notes:[],selectedView:"briefing"}};
}
beforeEach(()=>{
 window.localStorage.clear();window.history.replaceState({},"",window.location.href);
 vi.mocked(getCaseDossiers).mockResolvedValue({cases:["case-001","case-004"].map(caseId=>({caseId,contentVersion:2,title:`Database title ${caseId}`,dossier:`Database dossier ${caseId}`,wholeCaseObjective:`Whole investigation ${caseId}`,completionScope:caseId==="case-001"?"evidence-review" as const:"full-resolution" as const}))});
 vi.mocked(getFullHealth).mockResolvedValue(readyHealth as any);
 vi.mocked(createCaseAttempt).mockImplementation(async caseId=>snapshot(caseId));
 vi.mocked(saveCaseWorkspace).mockImplementation(async(s,workspace)=>({...s,workspace,revision:String(BigInt(s.revision)+1n)}));
});
function menu(){fireEvent.click(screen.getByRole("button",{name:"Menu"}));}
async function enter(caseNumber:string){
 fireEvent.click(screen.getByRole("button",{name:new RegExp(`Select Case ${caseNumber}:`)}));
 const open=await screen.findByRole("button",{name:"Open Case File"});await waitFor(()=>expect(open).toBeEnabled());
 await act(async()=>fireEvent.click(open));await screen.findByRole("button",{name:"Query Lab"});
}
it("keeps the detective brand, shelf, and prominent mentor at the student entry",()=>{
 render(<App/>);expect(screen.getByRole("img",{name:"Sequel Detective"})).toBeVisible();expect(screen.getByRole("heading",{name:"I'm Samuel Tupleton."})).toBeVisible();expect(screen.queryByLabelText("SQL Query")).not.toBeInTheDocument();expect(screen.queryByText("Admin Query Runner")).not.toBeInTheDocument();
});
it.each(["001","004"])("loads Case %s from the database into the same student editor",async number=>{
 render(<App/>);await enter(number);expect(screen.getByLabelText("Whole case briefing")).toHaveTextContent(`Whole investigation case-${number}`);
 fireEvent.click(screen.getByRole("button",{name:"Query Lab"}));expect(screen.getAllByLabelText("SQL Query")).toHaveLength(1);expect(screen.getAllByText("Database current direction")).toHaveLength(1);
 expect(screen.queryByText("Admin Query Runner")).not.toBeInTheDocument();expect(document.querySelector('[data-stable-grid="student-header-grid"]')).toBeInTheDocument();expect(document.querySelectorAll('[data-stable-region]')).toHaveLength(3);
});
it("uses database titles and whole-case objectives instead of legacy guidance",async()=>{
 render(<App/>);fireEvent.click(screen.getByRole("button",{name:/Select Case 004:/}));
 expect(await screen.findByRole("heading",{name:"Case 004: Database title case-004"})).toBeVisible();expect(screen.getByText("Whole investigation case-004")).toBeVisible();expect(screen.queryByText("Database current direction")).not.toBeInTheDocument();
});
it("preserves legacy notes and progress flags without promoting them into proof",async()=>{
 const legacy=JSON.stringify({state:{completedMilestones:{"mastermind-trace":true},studentDraftQuery:"Legacy SQL",notebookEntries:[{detail:"old note"}]}});
 window.localStorage.setItem("sequel-city.student.case-004.v1",legacy);render(<App/>);await enter("004");expect(screen.getByRole("status")).toHaveTextContent("0 of 16 tasks proved");expect(window.localStorage.getItem("sequel-city.student.case-004.v1")).toBe(legacy);
});
it("retains a student draft across the shared Briefing, Query Lab and Evidence Board",async()=>{
 render(<App/>);await enter("004");fireEvent.click(screen.getByRole("button",{name:"Query Lab"}));fireEvent.change(screen.getByLabelText("SQL Query"),{target:{value:"SELECT * FROM CrimeType WHERE CrimeID > 0"}});
 fireEvent.click(screen.getByRole("button",{name:"Evidence Board"}));expect(screen.getByLabelText("Case Progress",{exact:true})).toHaveTextContent("Completed milestones: 0 / 16");fireEvent.click(screen.getByRole("button",{name:"Samuel's Briefing"}));fireEvent.click(screen.getByRole("button",{name:"Query Lab"}));expect(screen.getByLabelText("SQL Query")).toHaveValue("SELECT * FROM CrimeType WHERE CrimeID > 0");
});
it("returns to the library through the menu without refresh",async()=>{
 render(<App/>);await enter("004");menu();fireEvent.click(screen.getByRole("button",{name:"Case Library"}));expect(screen.getByRole("heading",{name:"I'm Samuel Tupleton."})).toBeVisible();expect(screen.queryByLabelText("SQL Query")).not.toBeInTheDocument();
});
it("keeps Admin tools separate from the student editor",async()=>{
 render(<App/>);menu();fireEvent.click(screen.getByRole("button",{name:"Admin Mode"}));expect(screen.getByText("Admin Query Runner")).toBeVisible();expect(screen.getByText("Health Status")).toBeVisible();expect(screen.getByText("Schema Explorer")).toBeVisible();expect(screen.queryByLabelText("SQL Query")).not.toBeInTheDocument();expect(screen.getByRole("heading",{name:"Investigation Trail Diagnostics"})).toBeInTheDocument();
});
it("persists bounded text-size preferences and rejects unsupported stored sizes",()=>{
 window.localStorage.setItem("sequel-city.text-size","huge");render(<App/>);expect(screen.getByRole("main")).toHaveAttribute("data-text-size","default");menu();fireEvent.click(screen.getByRole("button",{name:"Text: Larger"}));expect(screen.getByRole("main")).toHaveAttribute("data-text-size","larger");expect(window.localStorage.getItem("sequel-city.text-size")).toBe("larger");
});
it("closes the application menu with Escape and returns focus",async()=>{
 render(<App/>);menu();fireEvent.keyDown(document,{key:"Escape"});expect(screen.queryByRole("navigation",{name:"Application menu"})).not.toBeInTheDocument();await waitFor(()=>expect(screen.getByRole("button",{name:"Menu"})).toHaveFocus());
});
it("shows setup guidance and permits Admin access when the database is degraded",async()=>{
 vi.mocked(getFullHealth).mockResolvedValue({...readyHealth,data:{...readyHealth.data,bootstrap:{...readyHealth.data.bootstrap,status:"degraded",canApplyInApp:true,message:"Upgrade required"}}} as any);
 render(<App/>);expect(await screen.findByRole("heading",{name:"Case Database Upgrade Required"})).toBeVisible();expect(screen.queryByLabelText("SQL Query")).not.toBeInTheDocument();fireEvent.click(screen.getByRole("button",{name:"Open Admin Mode"}));expect(screen.getByText("Health Status")).toBeVisible();
});
it("requires explicit owned attempt selection when browser history enters a case",async()=>{
 render(<App/>);await act(async()=>window.dispatchEvent(new PopStateEvent("popstate",{state:{"student-case-screen":"case","student-case-id":"case-004"}})));
 expect(await screen.findByRole("button",{name:"Open Case File"})).toBeInTheDocument();expect(screen.queryByRole("button",{name:"Query Lab"})).not.toBeInTheDocument();
});
it("does not enter a locked case from forged browser history",async()=>{
 render(<App/>);await act(async()=>window.dispatchEvent(new PopStateEvent("popstate",{state:{"student-case-screen":"case","student-case-id":"case-006"}})));
 expect(screen.queryByLabelText("SQL Query")).not.toBeInTheDocument();expect(screen.queryByRole("button",{name:"Query Lab"})).not.toBeInTheDocument();
});

it("opens an additional database-released case without a frontend case module or alternate editor",async()=>{
 vi.mocked(getCaseDossiers).mockResolvedValue({cases:[{caseId:"case-008",contentVersion:1,title:"An additional authored case",dossier:"New database dossier",wholeCaseObjective:"New whole-case objective",completionScope:"evidence-review"}]});
 render(<App/>);fireEvent.click(await screen.findByRole("button",{name:"An additional authored case"}));
 const open=await screen.findByRole("button",{name:"Open Case File"});await waitFor(()=>expect(open).toBeEnabled());
 await act(async()=>fireEvent.click(open));fireEvent.click(await screen.findByRole("button",{name:"Query Lab"}));
 expect(screen.getAllByLabelText("SQL Query",{exact:true})).toHaveLength(1);expect(screen.getByText("Case 008: An additional authored case")).toBeVisible();
});