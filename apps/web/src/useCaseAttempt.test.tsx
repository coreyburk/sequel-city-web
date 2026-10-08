import { act, renderHook, waitFor } from "@testing-library/react";
import { useCaseAttempt } from "./useCaseAttempt";
import { createCaseAttempt, getCaseAttempts, getCaseDossiers, saveCaseWorkspace } from "./api/client";
import type { AttemptSnapshot } from "./api/types";
vi.mock("./api/client", async importOriginal => ({ ...(await importOriginal<typeof import("./api/client")>()), getCaseDossiers: vi.fn(), getCaseAttempts: vi.fn(), createCaseAttempt: vi.fn(), saveCaseWorkspace: vi.fn() }));
const snapshot: AttemptSnapshot = { caseId: "case-001", contentVersion: 1, evidenceVersion: "v1", attemptId: "00000000-0000-4000-8000-000000000001", revision: "0", status: "active", completionScope: "evidence-review", progress: { completed: 0, total: 3, savedAtUtc: "2026-10-08T00:00:00Z" }, task: { stepKey: "crime-type", title: "Inspect", objective: "Read", direction: "Start with CrimeType" }, facts: [], workspace: { draftSql: "", notes: [], selectedView: "briefing" } };
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
