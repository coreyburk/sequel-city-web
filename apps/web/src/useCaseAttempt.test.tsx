import { act, renderHook, waitFor } from "@testing-library/react";
import { useCaseAttempt } from "./useCaseAttempt";
import { caseRequest, createCaseAttempt, getCaseAttempts, getCaseDossiers, saveCaseWorkspace } from "./api/client";
import type { AttemptSnapshot } from "./api/types";
vi.mock("./api/client", async importOriginal => ({ ...(await importOriginal<typeof import("./api/client")>()), getCaseDossiers: vi.fn(), getCaseAttempts: vi.fn(), caseRequest: vi.fn(), createCaseAttempt: vi.fn(), saveCaseWorkspace: vi.fn() }));
const snapshot: AttemptSnapshot = { caseId: "case-001", contentVersion: 1, evidenceVersion: "v1", attemptId: "00000000-0000-4000-8000-000000000001", revision: "0", status: "active", completionScope: "evidence-review", progress: { completed: 0, total: 3, savedAtUtc: "2026-10-08T00:00:00Z" }, evidenceSteps: [{ stepKey: "crime-type", title: "Inspect", status: "current" }], task: { stepKey: "crime-type", title: "Inspect", objective: "Read", direction: "Start with CrimeType" }, facts: [], workspace: { draftSql: "", notes: [], selectedView: "briefing" } };
beforeEach(() => {
  vi.mocked(getCaseDossiers).mockResolvedValue({ cases: [] });
  vi.mocked(getCaseAttempts).mockResolvedValue({ attempts: [] });
  vi.mocked(createCaseAttempt).mockResolvedValue(structuredClone(snapshot));
});
it("retains typing after a delayed workspace save while adopting its revision", async () => {
  let finish!: (value: AttemptSnapshot) => void;
  vi.mocked(saveCaseWorkspace).mockImplementation(() => new Promise(resolve => { finish = resolve; }));
  const { result } = renderHook(() => useCaseAttempt("case-001"));
  await act(async () => { await result.current.open(true); });
  act(() => result.current.updateWorkspace({ ...snapshot.workspace, draftSql: "first edit" }));
  let saving!: Promise<void>;
  act(() => { saving = result.current.save(); });
  await waitFor(() => expect(finish).toBeTypeOf("function"));
  act(() => result.current.updateWorkspace({ ...snapshot.workspace, draftSql: "newer typing" }));
  await act(async () => { finish({ ...snapshot, revision: "1", workspace: { ...snapshot.workspace, draftSql: "first edit" } }); await saving; });
  expect(result.current.workspace.draftSql).toBe("newer typing");
  expect(result.current.snapshot?.revision).toBe("1"); expect(result.current.dirty).toBe(true);
});
it("ignores an in-flight save after selecting a different case", async () => {
  let finish!: (value: AttemptSnapshot) => void;
  vi.mocked(saveCaseWorkspace).mockImplementation(() => new Promise(resolve => { finish = resolve; }));
  const { result, rerender } = renderHook(({ id }) => useCaseAttempt(id), { initialProps: { id: "case-001" as string | null } });
  await act(async () => { await result.current.open(true); });
  let saving!: Promise<void>; act(() => { saving = result.current.save(); });
  await waitFor(() => expect(finish).toBeTypeOf("function"));
  rerender({ id: null });
  await act(async () => { finish({ ...snapshot, revision: "1" }); await saving; });
  expect(result.current.snapshot).toBeNull();
});

it("deletes the selected archived attempt while preserving the open attempt and draft", async () => {
  const archived = { attemptId: "00000000-0000-4000-8000-000000000002", revision: "7", status: "archived", compatible: true, progress: snapshot.progress };
  vi.mocked(getCaseAttempts).mockResolvedValue({ attempts: [archived] });
  vi.mocked(caseRequest).mockResolvedValue({ deleted: true });
  const { result } = renderHook(() => useCaseAttempt("case-001"));
  await act(async () => { await result.current.open(true); });
  act(() => result.current.updateWorkspace({ ...snapshot.workspace, draftSql: "my current draft" }));
  vi.mocked(getCaseAttempts).mockResolvedValue({ attempts: [] });
  await act(async () => { await result.current.remove(archived.attemptId); });
  expect(caseRequest).toHaveBeenCalledWith(`/api/attempts/${archived.attemptId}`, "DELETE", { requestId: expect.any(String), expectedRevision: "7" });
  expect(result.current.snapshot?.attemptId).toBe(snapshot.attemptId);
  expect(result.current.workspace.draftSql).toBe("my current draft");
  expect(result.current.dirty).toBe(true);
  expect(result.current.summaries).toEqual([]);
});
it("shows the available dossier while summaries load and prevents implicit fresh entry until they finish", async () => {
  let finish!: (value: { attempts: [] }) => void;
  vi.mocked(getCaseDossiers).mockResolvedValue({ cases: [{ caseId:"case-001", contentVersion:2, title:"Available case", dossier:"Known briefing", wholeCaseObjective:"Whole case",completionScope:"evidence-review" }] });
  vi.mocked(getCaseAttempts).mockImplementationOnce(() => new Promise(resolve => { finish=resolve; }));
  const { result }=renderHook(()=>useCaseAttempt("case-001"));
  await waitFor(()=>expect(result.current.dossier?.title).toBe("Available case"));
  expect(result.current.busy).toBe(true);expect(result.current.snapshot).toBeNull();
  await act(async()=>finish({attempts:[]}));
  expect(result.current.busy).toBe(false);
});