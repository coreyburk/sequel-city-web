import { useEffect, useMemo, useState } from "react";
import { getFullHealth } from "./api/client";
import type { HealthFullResponse } from "./api/types";
import { DeveloperInvestigationThreadsPanel } from "./components/developer/DeveloperInvestigationThreadsPanel";
import { HealthStatus } from "./components/HealthStatus";
import { QueryHistoryPanel } from "./components/QueryHistoryPanel";
import { QueryRunner } from "./components/QueryRunner";
import { SchemaExplorer } from "./components/SchemaExplorer";
import { SuspectVerificationPanel } from "./components/SuspectVerificationPanel";
import { StudentBriefingView } from "./components/student/StudentBriefingView";
import { StudentCaseEntryFlow } from "./components/student/StudentCaseEntryFlow";
import { StudentCaseLandingPage } from "./components/student/StudentCaseLandingPage";
import { StudentEvidenceBoardView } from "./components/student/StudentEvidenceBoardView";
import { StudentMentorHeader } from "./components/student/StudentMentorHeader";
import { StudentWorkbenchView } from "./components/student/StudentWorkbenchView";
import { getStudentCaseLibraryEntry } from "./components/student/studentCaseLibrary";
import { useInvestigationThreads } from "./features/investigationThreads";
import {
  STUDENT_SETUP_REQUIRED_GUIDANCE,
  STUDENT_SETUP_REQUIRED_TITLE
} from "./guidance";
import { useStudentCaseState } from "./useStudentCaseState";

const STUDENT_LIBRARY_HISTORY_KEY = "student-case-screen";
const STUDENT_LIBRARY_CASE_KEY = "student-case-id";
type StudentCaseScreenState = "library" | "landing" | "case";

type WorkspaceMode = "student" | "developer";
type StudentSetupState =
  | { status: "checking" | "ready" }
  | { status: "setup-required"; title: string; message: string; details: string[] };

type AppProps = {
  initialStudentCaseEntered?: boolean;
};

export default function App({
  initialStudentCaseEntered = false
}: AppProps): JSX.Element {
  const [mode, setMode] = useState<WorkspaceMode>("student");
  const [studentCaseScreen, setStudentCaseScreen] = useState<StudentCaseScreenState>(
    initialStudentCaseEntered ? "case" : "library"
  );
  const [selectedLibraryCaseId, setSelectedLibraryCaseId] = useState<string | null>(
    initialStudentCaseEntered ? "case-004" : null
  );
  const [studentSetupState, setStudentSetupState] = useState<StudentSetupState>({
    status: "checking"
  });
  const {
    activeCaseReviewStatus,
    activeLeads,
    activeSamuelStep,
    caseMomentum,
    caseReviewCheck,
    caseStatus,
    collectedSuspectTheoryNames,
    confirmedTriggerSuspectName,
    confirmedTriggerSuspectPersonId,
    completedCount,
    completedMilestones,
    handleCaseReviewChoice,
    handleManualNotebookAdd,
    handleQueryExecutionComplete,
    setNotebookEntryPage,
    handleStudentEvidenceLog,
    handleStudentSuspectTheorySubmit,
    handleStudentSqlEdit,
    highlightedNotebookEntryId,
    hasPinnedMastermindIdentities,
    insightMarks,
    isMastermindEmploymentReady,
    isMastermindEventRegistrationActive,
    isMastermindEventScheduleActive,
    leadBoardCards,
    manualNotebookDraft,
    mastermindCurrentStepDetail,
    mastermindCurrentStepTitle,
    mastermindEndgamePhase,
    mastermindEventIds,
    mastermindNotebookSummary,
    mastermindSharedEventIds,
    mentorMessage,
    mentorTitle,
    notebookEntries,
    pendingEvidenceStep,
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
    shouldShowGymLeadGuide,
    shouldShowSuspectCandidateGuide,
    shouldShowSuspectInterviewGuide,
    shouldShowMastermindHandoffGuide,
    shouldShowTriggerCheckGuide,
    shouldShowWitnessIdentityGuide,
    shouldShowWitnessTrailGuide,
    studentCaseHeaderRef,
    studentDraftQuery,
    studentEvidenceFeedback,
    studentEvidenceFeedbackTone,
    studentEvidenceFeedbackVersion,
    studentEvidencePrompt,
    studentQueryRunnerResetKey,
    studentRestoredExecution,
    studentObjective,
    studentQueryFailureGuidance,
    studentQueryReinforcement,
    studentQueryRunnerInstruction,
    studentSamuelReaction,
    studentScene,
    studentSchema,
    studentSchemaError,
    studentSchemaLoading,
    setStudentSuspectTheoryDraft,
    studentSuspectTheoryDraft,
    studentSuspectTheoryError,
    studentSuspectTheoryLoading,
    studentSuspectTheoryResult,
    pinnedReportId,
    studentView,
    visibleMilestones,
    witnessChecklistItems
  } = useStudentCaseState(mode);

  const notebookEntryIds = useMemo(
    () => notebookEntries.map((entry) => entry.id),
    [notebookEntries]
  );
  const selectedLibraryCase = useMemo(
    () => getStudentCaseLibraryEntry(selectedLibraryCaseId),
    [selectedLibraryCaseId]
  );
  const studentLogFeedbackContextKey = useMemo(
    () =>
      [
        pendingEvidenceStep ?? "none",
        mastermindEndgamePhase,
        completedMilestones["suspect-interview"] ? "suspect-interview:done" : "suspect-interview:open",
        completedMilestones["trigger-check"] ? "trigger-check:done" : "trigger-check:open",
        completedMilestones["mastermind-profile"] ? "mastermind-profile:done" : "mastermind-profile:open",
        completedMilestones["mastermind-trace"] ? "mastermind-trace:done" : "mastermind-trace:open"
      ].join("|"),
    [completedMilestones, mastermindEndgamePhase, pendingEvidenceStep]
  );
  const threadsApi = useInvestigationThreads(notebookEntryIds);

  async function refreshStudentSetupState(): Promise<void> {
    try {
      const health = await getFullHealth();
      setStudentSetupState(getStudentSetupStateFromHealth(health));
    } catch (loadError) {
      const message =
        loadError instanceof Error
          ? loadError.message
          : "The classroom setup check could not reach the API.";

      setStudentSetupState({
        status: "setup-required",
        title: STUDENT_SETUP_REQUIRED_TITLE,
        message: STUDENT_SETUP_REQUIRED_GUIDANCE,
        details: [
          message,
          "Start the API and web server with npm run dev from the repository root before students begin the case."
        ]
      });
    }
  }

  useEffect(() => {
    let active = true;

    async function loadStudentSetupState(): Promise<void> {
      try {
        const health = await getFullHealth();

        if (!active) {
          return;
        }

        setStudentSetupState(getStudentSetupStateFromHealth(health));
      } catch (loadError) {
        if (!active) {
          return;
        }

        const message =
          loadError instanceof Error
            ? loadError.message
            : "The classroom setup check could not reach the API.";

        setStudentSetupState({
          status: "setup-required",
          title: STUDENT_SETUP_REQUIRED_TITLE,
          message: STUDENT_SETUP_REQUIRED_GUIDANCE,
          details: [
            message,
            "Start the API and web server with npm run dev from the repository root before students begin the case."
          ]
        });
      }
    }

    void loadStudentSetupState();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const nextScreen = studentCaseScreen;
    const currentState =
      window.history.state && typeof window.history.state === "object" ? window.history.state : {};

    if (
      currentState?.[STUDENT_LIBRARY_HISTORY_KEY] !== nextScreen ||
      currentState?.[STUDENT_LIBRARY_CASE_KEY] !== selectedLibraryCaseId
    ) {
      window.history.replaceState(
        {
          ...currentState,
          [STUDENT_LIBRARY_HISTORY_KEY]: nextScreen,
          [STUDENT_LIBRARY_CASE_KEY]: selectedLibraryCaseId
        },
        "",
        window.location.href
      );
    }
  }, [selectedLibraryCaseId, studentCaseScreen]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    function handlePopState(event: PopStateEvent): void {
      const state =
        event.state && typeof event.state === "object" ? event.state : null;
      const nextScreen = state?.[STUDENT_LIBRARY_HISTORY_KEY];
      const nextCaseId =
        typeof state?.[STUDENT_LIBRARY_CASE_KEY] === "string"
          ? state[STUDENT_LIBRARY_CASE_KEY]
          : null;

      if (nextScreen === "library") {
        setStudentCaseScreen("library");
        setSelectedLibraryCaseId(nextCaseId);
      } else if (nextScreen === "landing") {
        setStudentCaseScreen("landing");
        setSelectedLibraryCaseId(nextCaseId);
      } else if (nextScreen === "case") {
        setStudentCaseScreen("case");
        setSelectedLibraryCaseId(nextCaseId ?? "case-004");
      }
    }

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  function pushStudentCaseHistoryState(
    nextScreen: StudentCaseScreenState,
    caseId: string | null
  ): void {
    if (typeof window !== "undefined") {
      const currentState =
        window.history.state && typeof window.history.state === "object" ? window.history.state : {};
      window.history.pushState(
        {
          ...currentState,
          [STUDENT_LIBRARY_HISTORY_KEY]: nextScreen,
          [STUDENT_LIBRARY_CASE_KEY]: caseId
        },
        "",
        window.location.href
      );
    }
  }

  function handleSelectStudentCase(caseId: string): void {
    pushStudentCaseHistoryState("landing", caseId);
    setSelectedLibraryCaseId(caseId);
    setStudentCaseScreen("landing");
  }

  function handleEnterStudentCase(): void {
    const nextCaseId = selectedLibraryCaseId ?? "case-004";
    pushStudentCaseHistoryState("case", nextCaseId);
    setSelectedLibraryCaseId(nextCaseId);
    setStudentCaseScreen("case");
  }

  function handleReturnToStudentCaseEntry(): void {
    pushStudentCaseHistoryState("library", selectedLibraryCaseId);
    setStudentCaseScreen("library");
  }

  return (
    <main className={`app-shell ${mode === "student" ? "app-shell--student" : ""}`}>
      <header className="app-header">
        <h1>Sequel Detective</h1>
        <div className="app-header__controls">
          {mode === "student" &&
          studentSetupState.status !== "setup-required" &&
          studentCaseScreen !== "library" ? (
            <button
              type="button"
              className="app-header__utility-button"
              onClick={handleReturnToStudentCaseEntry}
            >
              Case Library
            </button>
          ) : null}
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
              Admin Mode
            </button>
          </div>
        </div>
      </header>
      {mode === "student" && studentSetupState.status === "setup-required" ? (
        <section
          className="panel panel--full guidance-panel"
          aria-labelledby="student-setup-required-title"
        >
          <div className="section-heading">
            <h2 id="student-setup-required-title">{studentSetupState.title}</h2>
            <p className="message-muted">{studentSetupState.message}</p>
          </div>
          <div className="student-setup-card" aria-label="Setup details">
            {studentSetupState.details.map((detail) => (
              <p key={detail}>{detail}</p>
            ))}
          </div>
          <div className="student-setup-actions">
            <button
              type="button"
              className="samuel-briefing__button"
              onClick={() => setMode("developer")}
            >
              Open Admin Mode
            </button>
            <p className="message-muted">
              Admin Mode shows classroom health details so a teacher or administrator can finish
              setup before students begin.
            </p>
          </div>
        </section>
      ) : null}
      {mode === "student" &&
      studentSetupState.status !== "setup-required" &&
      studentCaseScreen === "library" ? (
        <StudentCaseEntryFlow onSelectCase={handleSelectStudentCase} />
      ) : null}
      {mode === "student" &&
      studentSetupState.status !== "setup-required" &&
      studentCaseScreen === "landing" &&
      selectedLibraryCase ? (
        <StudentCaseLandingPage
          caseEntry={selectedLibraryCase}
          onBackToLibrary={handleReturnToStudentCaseEntry}
          onEnterCase={handleEnterStudentCase}
        />
      ) : null}
      {mode === "student" &&
      studentSetupState.status !== "setup-required" &&
      studentCaseScreen === "case" ? (
        <>
          <StudentMentorHeader
            activeView={studentView}
            caseMomentum={caseMomentum}
            caseStatus={caseStatus}
            headerRef={studentCaseHeaderRef}
            mentorMessage={mentorMessage}
            mentorTitle={mentorTitle}
            samuelAvatarSrc={samuelAvatarSrc}
            samuelTrustLabel={samuelTrustLabel}
            samuelVisualState={samuelVisualState}
            insightMarks={insightMarks}
            studentObjective={studentObjective}
            studentScene={studentScene}
          />
          <nav className="student-view-tabs" aria-label="Student Case Actions">
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
              confirmedTriggerReportId={pinnedReportId}
              confirmedTriggerSuspectName={confirmedTriggerSuspectName}
              confirmedTriggerSuspectPersonId={confirmedTriggerSuspectPersonId}
              highlightedNotebookEntryId={highlightedNotebookEntryId}
              hasPinnedMastermindIdentities={hasPinnedMastermindIdentities}
              isMastermindEventRegistrationActive={isMastermindEventRegistrationActive}
              isMastermindEventScheduleActive={isMastermindEventScheduleActive}
              mastermindEndgamePhase={mastermindEndgamePhase}
              mastermindEventIds={mastermindEventIds}
              mastermindProfileComplete={completedMilestones["mastermind-profile"]}
              mastermindSharedEventIds={mastermindSharedEventIds}
              notebookEntries={notebookEntries}
              onQueryExecutionComplete={handleQueryExecutionComplete}
              onStudentEvidenceLog={handleStudentEvidenceLog}
              onStudentSqlEdit={handleStudentSqlEdit}
              selectedStudentTable={selectedStudentTable}
              selectedTableDetails={selectedTableDetails}
              setSelectedStudentTable={setSelectedStudentTable}
              shouldShowGymLeadGuide={shouldShowGymLeadGuide}
              shouldShowSuspectCandidateGuide={shouldShowSuspectCandidateGuide}
              shouldShowSuspectInterviewGuide={shouldShowSuspectInterviewGuide}
              shouldShowMastermindHandoffGuide={shouldShowMastermindHandoffGuide}
              shouldShowWitnessIdentityGuide={shouldShowWitnessIdentityGuide}
              shouldShowWitnessTrailGuide={shouldShowWitnessTrailGuide}
              studentDraftQuery={studentDraftQuery}
              studentEvidenceFeedback={studentEvidenceFeedback}
              studentEvidenceFeedbackTone={studentEvidenceFeedbackTone}
              studentEvidenceFeedbackVersion={studentEvidenceFeedbackVersion}
              studentLogFeedbackContextKey={studentLogFeedbackContextKey}
              studentEvidencePrompt={studentEvidencePrompt}
              studentFailureGuidance={studentQueryFailureGuidance}
              studentInstruction={studentQueryRunnerInstruction}
              studentQueryRunnerResetKey={studentQueryRunnerResetKey}
              studentRestoredExecution={studentRestoredExecution}
              studentReinforcement={studentQueryReinforcement}
              studentSamuelReaction={studentSamuelReaction}
              studentSchema={studentSchema}
              studentSchemaError={studentSchemaError}
              studentSchemaLoading={studentSchemaLoading}
            />
          ) : null}
          {studentView === "case-board" ? (
              <StudentEvidenceBoardView
                activeCaseReviewStatus={activeCaseReviewStatus}
                activeLeads={activeLeads}
                caseReviewCheck={caseReviewCheck}
              completedCount={completedCount}
              completedMilestones={completedMilestones}
              confirmedTriggerSuspectName={confirmedTriggerSuspectName}
              collectedSuspectTheoryNames={collectedSuspectTheoryNames}
              handleCaseReviewChoice={handleCaseReviewChoice}
              handleManualNotebookAdd={handleManualNotebookAdd}
              highlightedNotebookEntryId={highlightedNotebookEntryId}
              insightMarks={insightMarks}
              leadBoardCards={leadBoardCards}
              manualNotebookDraft={manualNotebookDraft}
              mastermindCurrentStepDetail={mastermindCurrentStepDetail}
              mastermindCurrentStepTitle={mastermindCurrentStepTitle}
              mastermindEndgamePhase={mastermindEndgamePhase}
              isMastermindEmploymentReady={isMastermindEmploymentReady}
              mastermindNotebookSummary={mastermindNotebookSummary}
              mastermindSharedEventIds={mastermindSharedEventIds}
              notebookEntries={notebookEntries}
              pendingEvidenceStep={pendingEvidenceStep}
              onStudentSuspectTheorySubmit={handleStudentSuspectTheorySubmit}
              removeNotebookEntry={removeNotebookEntry}
              setNotebookEntryPage={setNotebookEntryPage}
              setManualNotebookDraft={setManualNotebookDraft}
              setStudentSuspectTheoryDraft={setStudentSuspectTheoryDraft}
              shouldShowCrimeReportHandoff={shouldShowCrimeReportHandoff}
              shouldShowTriggerCheckGuide={shouldShowTriggerCheckGuide}
              studentSuspectTheoryDraft={studentSuspectTheoryDraft}
              studentSuspectTheoryError={studentSuspectTheoryError}
              studentSuspectTheoryLoading={studentSuspectTheoryLoading}
              studentSuspectTheoryResult={studentSuspectTheoryResult}
              visibleMilestones={visibleMilestones}
              witnessChecklistItems={witnessChecklistItems}
            />
          ) : null}
        </>
      ) : mode === "developer" ? (
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
      ) : null}
      {mode === "developer" ? (
        <div className="app-grid">
          <HealthStatus onUpgradeApplied={refreshStudentSetupState} />
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

function getStudentSetupStateFromHealth(health: HealthFullResponse): StudentSetupState {
  if (health.data.database.status === "failed") {
    return {
      status: "setup-required",
      title: "Database Connection Required",
      message:
        "This case cannot start until the classroom database is online and the API can reach it.",
      details: [
        health.data.database.message,
        "Confirm SQL Server is running, then restart the app with npm run dev from the repository root."
      ]
    };
  }

  if (health.data.bootstrap.status === "degraded") {
    return {
      status: "setup-required",
      title: "Case Database Upgrade Required",
      message:
        "This case needs a one-time database upgrade before students can use the guided investigation safely.",
      details: [
        health.data.bootstrap.message,
        health.data.bootstrap.canApplyInApp
          ? "Open Admin Mode and use Apply Required Upgrade to finish setup from inside the application."
          : (health.data.bootstrap.applyActionMessage ??
            "Open Admin Mode for classroom database setup guidance before students enter Student Mode."),
        health.data.bootstrap.pendingMigrationKeys.length > 0
          ? `Pending updates: ${health.data.bootstrap.pendingMigrationKeys.length}.`
          : "Pending updates are still required.",
        health.data.bootstrap.expectedMigrationKey
          ? `Target version: ${health.data.bootstrap.expectedMigrationKey}.`
          : "Target version information is not available."
      ]
    };
  }

  return { status: "ready" };
}

