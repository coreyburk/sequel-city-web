import { useMemo, useState } from "react";
import { DeveloperInvestigationThreadsPanel } from "./components/developer/DeveloperInvestigationThreadsPanel";
import { HealthStatus } from "./components/HealthStatus";
import { QueryHistoryPanel } from "./components/QueryHistoryPanel";
import { QueryRunner } from "./components/QueryRunner";
import { SchemaExplorer } from "./components/SchemaExplorer";
import { SuspectVerificationPanel } from "./components/SuspectVerificationPanel";
import { StudentBriefingView } from "./components/student/StudentBriefingView";
import { StudentEvidenceBoardView } from "./components/student/StudentEvidenceBoardView";
import { StudentMentorHeader } from "./components/student/StudentMentorHeader";
import { StudentWorkbenchView } from "./components/student/StudentWorkbenchView";
import { useInvestigationThreads } from "./features/investigationThreads";
import { useStudentCaseState } from "./useStudentCaseState";

type WorkspaceMode = "student" | "developer";

export default function App(): JSX.Element {
  const [mode, setMode] = useState<WorkspaceMode>("student");
  const {
    activeCaseReviewStatus,
    activeLeads,
    activeSamuelStep,
    caseMomentum,
    caseReviewCheck,
    caseStatus,
    completedCount,
    completedMilestones,
    handleCaseReviewChoice,
    handleManualNotebookAdd,
    handleQueryExecutionComplete,
    handleStudentEvidenceLog,
    highlightedNotebookEntryId,
    insightMarks,
    leadBoardCards,
    manualNotebookDraft,
    mentorMessage,
    mentorTitle,
    notebookEntries,
    removeNotebookEntry,
    samuelAvatarSrc,
    samuelCompletedCount,
    samuelTrustLabel,
    samuelVisualState,
    selectedStudentTable,
    selectedTableDetails,
    setManualNotebookDraft,
    setSelectedStudentTable,
    setStudentView,
    shouldShowCrimeReportHandoff,
    shouldShowWitnessTrailGuide,
    studentCaseHeaderRef,
    studentDraftQuery,
    studentEvidencePrompt,
    studentLastQueryExecution,
    studentQueryFailureGuidance,
    studentQueryReinforcement,
    studentQueryRunnerInstruction,
    studentScene,
    studentSchema,
    studentSchemaError,
    studentSchemaLoading,
    studentView,
    visibleMilestones,
    witnessBundleCount,
    witnessChecklistItems
  } = useStudentCaseState(mode);

  const notebookEntryIds = useMemo(
    () => notebookEntries.map((entry) => entry.id),
    [notebookEntries]
  );
  const threadsApi = useInvestigationThreads(notebookEntryIds);

  return (
    <main className={`app-shell ${mode === "student" ? "app-shell--student" : ""}`}>
      <header className="app-header">
        <h1>Sequel City Case Files</h1>
        <div className="mode-toggle" role="group" aria-label="Workspace Mode">
          <button
            type="button"
            aria-pressed={mode === "student"}
            onClick={() => setMode("student")}
          >
            Student Mode
          </button>
          <button
            type="button"
            aria-pressed={mode === "developer"}
            onClick={() => setMode("developer")}
          >
            Developer Mode
          </button>
        </div>
      </header>
      {mode === "student" ? (
        <>
          <StudentMentorHeader
            caseMomentum={caseMomentum}
            caseStatus={caseStatus}
            headerRef={studentCaseHeaderRef}
            mentorMessage={mentorMessage}
            mentorTitle={mentorTitle}
            samuelAvatarSrc={samuelAvatarSrc}
            samuelTrustLabel={samuelTrustLabel}
            samuelVisualState={samuelVisualState}
            insightMarks={insightMarks}
            studentScene={studentScene}
          />
          <nav
            className="student-view-tabs student-action-nav"
            aria-label="Student Case Actions"
          >
            <button
              type="button"
              aria-pressed={studentView === "briefing"}
              aria-current={studentView === "briefing" ? "page" : undefined}
              disabled={studentView === "briefing"}
              onClick={() => setStudentView("briefing")}
            >
              Samuel&apos;s Briefing
            </button>
            <button
              type="button"
              aria-pressed={studentView === "workbench"}
              aria-current={studentView === "workbench" ? "page" : undefined}
              disabled={studentView === "workbench"}
              onClick={() => setStudentView("workbench")}
            >
              Query Lab
            </button>
            <button
              type="button"
              aria-pressed={studentView === "case-board"}
              aria-current={studentView === "case-board" ? "page" : undefined}
              disabled={studentView === "case-board"}
              onClick={() => setStudentView("case-board")}
            >
              Evidence Board
            </button>
          </nav>
          {studentView === "briefing" ? (
            <StudentBriefingView
              activeSamuelStep={activeSamuelStep}
              samuelCompletedCount={samuelCompletedCount}
            />
          ) : null}
          {studentView === "workbench" ? (
            <StudentWorkbenchView
              highlightedNotebookEntryId={highlightedNotebookEntryId}
              notebookEntries={notebookEntries}
              onQueryExecutionComplete={handleQueryExecutionComplete}
              onStudentEvidenceLog={handleStudentEvidenceLog}
              selectedStudentTable={selectedStudentTable}
              selectedTableDetails={selectedTableDetails}
              setSelectedStudentTable={setSelectedStudentTable}
              shouldShowWitnessTrailGuide={shouldShowWitnessTrailGuide}
              studentDraftQuery={studentDraftQuery}
              studentEvidencePrompt={studentEvidencePrompt}
              studentFailureGuidance={studentQueryFailureGuidance}
              studentInstruction={studentQueryRunnerInstruction}
              studentLastQueryExecution={studentLastQueryExecution}
              studentReinforcement={studentQueryReinforcement}
              studentSchema={studentSchema}
              studentSchemaError={studentSchemaError}
              studentSchemaLoading={studentSchemaLoading}
              witnessBundleCount={witnessBundleCount}
            />
          ) : null}
          {studentView === "case-board" ? (
            <StudentEvidenceBoardView
              activeCaseReviewStatus={activeCaseReviewStatus}
              activeLeads={activeLeads}
              caseReviewCheck={caseReviewCheck}
              completedCount={completedCount}
              completedMilestones={completedMilestones}
              handleCaseReviewChoice={handleCaseReviewChoice}
              handleManualNotebookAdd={handleManualNotebookAdd}
              highlightedNotebookEntryId={highlightedNotebookEntryId}
              insightMarks={insightMarks}
              leadBoardCards={leadBoardCards}
              manualNotebookDraft={manualNotebookDraft}
              notebookEntries={notebookEntries}
              removeNotebookEntry={removeNotebookEntry}
              setManualNotebookDraft={setManualNotebookDraft}
              shouldShowCrimeReportHandoff={shouldShowCrimeReportHandoff}
              visibleMilestones={visibleMilestones}
              witnessChecklistItems={witnessChecklistItems}
            />
          ) : null}
        </>
      ) : (
        <section className="panel panel--full guidance-panel" aria-labelledby="first-run-guidance-title">
          <div className="section-heading">
            <h2 id="first-run-guidance-title">First-Run Guidance</h2>
            <p className="message-muted">
              Keep this visible during first launch so the required command, URLs, and smoke-test
              query are easy to reference.
            </p>
          </div>
          <dl className="key-value-grid">
            <div className="key-value-card">
              <dt>Startup Command</dt>
              <dd><code>npm run dev</code></dd>
            </div>
            <div className="key-value-card">
              <dt>Frontend URL</dt>
              <dd><code>http://127.0.0.1:5173</code></dd>
            </div>
            <div className="key-value-card">
              <dt>Backend API URL</dt>
              <dd><code>http://127.0.0.1:3001</code></dd>
            </div>
            <div className="key-value-card">
              <dt>First Test Query</dt>
              <dd><code>SELECT DB_NAME() AS CurrentDatabase</code></dd>
            </div>
          </dl>
        </section>
      )}
      {mode === "developer" ? (
        <div className="app-grid">
          <HealthStatus />
          <SchemaExplorer />
          <SuspectVerificationPanel />
          <QueryRunner />
          <QueryHistoryPanel />
          <DeveloperInvestigationThreadsPanel
            threads={threadsApi.threads}
            completedMilestones={completedMilestones}
            notebookEntries={notebookEntries}
          />
        </div>
      ) : null}
    </main>
  );
}

