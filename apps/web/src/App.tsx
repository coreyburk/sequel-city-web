import { useStudentCaseState } from "./useStudentCaseState";
import { useEffect, useMemo, useRef, useState } from "react";
import { getFullHealth } from "./api/client";
import type { HealthFullResponse } from "./api/types";
import { DeveloperInvestigationThreadsPanel } from "./components/developer/DeveloperInvestigationThreadsPanel";
import { HealthStatus } from "./components/HealthStatus";
import { QueryHistoryPanel } from "./components/QueryHistoryPanel";
import { QueryRunner } from "./components/QueryRunner";
import { SchemaExplorer } from "./components/SchemaExplorer";
import { SuspectVerificationPanel } from "./components/SuspectVerificationPanel";
import { StudentCaseEntryFlow } from "./components/student/StudentCaseEntryFlow";
import {
  INVESTIGATION_THREADS_STORAGE_KEY,
  useInvestigationThreads
} from "./features/investigationThreads";
import {
  STUDENT_SETUP_REQUIRED_GUIDANCE,
  STUDENT_SETUP_REQUIRED_TITLE
} from "./guidance";
import sequelDetectiveLogo from "./assets/logos/sequel-detective-logo-5-header.png";
import { useCaseAttempt } from "./useCaseAttempt";
import { StudentQueryLab } from "./components/student/StudentQueryLab";

const STUDENT_LIBRARY_HISTORY_KEY = "student-case-screen";
const STUDENT_LIBRARY_CASE_KEY = "student-case-id";
const TEXT_SIZE_STORAGE_KEY = "sequel-city.text-size";
const TEXT_SIZE_OPTIONS = ["default", "large", "larger"] as const;
type StudentCaseScreenState = "library" | "landing" | "case";
type TextSizeOption = (typeof TEXT_SIZE_OPTIONS)[number];

type WorkspaceMode = "student" | "developer";
type StudentSetupState =
  | { status: "checking" | "ready" }
  | { status: "setup-required"; title: string; message: string; details: string[] };

type AppProps = {
  initialStudentCaseEntered?: boolean;
};

function isTextSizeOption(value: unknown): value is TextSizeOption {
  return typeof value === "string" && TEXT_SIZE_OPTIONS.includes(value as TextSizeOption);
}

function readStoredTextSize(): TextSizeOption {
  if (typeof window === "undefined" || !window.localStorage) {
    return "default";
  }

  try {
    const storedValue = window.localStorage.getItem(TEXT_SIZE_STORAGE_KEY);
    return isTextSizeOption(storedValue) ? storedValue : "default";
  } catch {
    return "default";
  }
}

export default function App({
  initialStudentCaseEntered = false
}: AppProps): JSX.Element {
  const [mode, setMode] = useState<WorkspaceMode>("student");
  const [textSize, setTextSize] = useState<TextSizeOption>(() => readStoredTextSize());
  const [studentCaseScreen, setStudentCaseScreen] = useState<StudentCaseScreenState>(
    initialStudentCaseEntered ? "case" : "library"
  );
  const [selectedLibraryCaseId, setSelectedLibraryCaseId] = useState<string | null>(
    initialStudentCaseEntered ? "case-004" : null
  );
  const [studentSetupState, setStudentSetupState] = useState<StudentSetupState>({
    status: "checking"
  });
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false);
  const headerMenuTriggerRef = useRef<HTMLButtonElement>(null);
  const headerMenuPanelRef = useRef<HTMLElement>(null);
  const durableCase = useCaseAttempt(mode === "student" && studentCaseScreen !== "library" ? selectedLibraryCaseId : null);

  function closeHeaderMenu(returnFocus = false): void {
    setIsHeaderMenuOpen(false);
    if (returnFocus) window.setTimeout(() => headerMenuTriggerRef.current?.focus(), 0);
  }

  useEffect(() => {
    if (!isHeaderMenuOpen) return;
    headerMenuPanelRef.current?.querySelector<HTMLButtonElement>("button:not(:disabled)")?.focus();

    function closeForOutsidePointer(event: PointerEvent): void {
      const target = event.target;
      if (
        target instanceof Node &&
        !headerMenuPanelRef.current?.contains(target) &&
        !headerMenuTriggerRef.current?.contains(target)
      ) closeHeaderMenu(true);
    }
    function closeForEscape(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        event.preventDefault();
        closeHeaderMenu(true);
      }
    }
    document.addEventListener("pointerdown", closeForOutsidePointer);
    document.addEventListener("keydown", closeForEscape);
    return () => {
      document.removeEventListener("pointerdown", closeForOutsidePointer);
      document.removeEventListener("keydown", closeForEscape);
    };
  }, [isHeaderMenuOpen]);


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
    if (typeof window === "undefined" || !window.localStorage) {
      return;
    }

    try {
      window.localStorage.setItem(TEXT_SIZE_STORAGE_KEY, textSize);
    } catch {
      // Text size is local UI state. Storage failure should not block the app.
    }
  }, [textSize]);

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
        setSelectedLibraryCaseId(nextCaseId);
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
    if (!durableCase.dossier || !selectedLibraryCaseId) return;
    pushStudentCaseHistoryState("case", selectedLibraryCaseId);
    setStudentCaseScreen("case");
  }
  function handleReturnToStudentCaseEntry(): void {
    pushStudentCaseHistoryState("library", selectedLibraryCaseId);
    setStudentCaseScreen("library");
  }

  function handleResetStudentCaseProgress(): void {
    if (window.confirm("Start a fresh attempt? Your saved attempt will remain available to resume.")) void durableCase.open(true).catch(() => undefined);
  }
  return (
    <main
      className={`app-shell ${mode === "student" ? "app-shell--student" : ""}`}
      data-text-size={textSize}
    >
      <header className="app-header">
        <h1 className="app-header__brand">
          <img
            className="app-header__brand-logo"
            src={sequelDetectiveLogo}
            alt="Sequel Detective"
          />
        </h1>
        <div className="app-header__controls">
          <button
            ref={headerMenuTriggerRef}
            type="button"
            className="app-header__menu-trigger"
            aria-controls="application-menu"
            aria-expanded={isHeaderMenuOpen}
            onClick={() => setIsHeaderMenuOpen((isOpen) => !isOpen)}
          >
            <span className="app-header__menu-icon" aria-hidden="true"><span /><span /><span /></span>
            Menu
          </button>
          {isHeaderMenuOpen ? (
            <nav ref={headerMenuPanelRef} id="application-menu" className="app-header__menu-panel" aria-label="Application menu">
              {mode === "student" && studentSetupState.status !== "setup-required" && studentCaseScreen !== "library" ? (
            <button
              type="button"
              className="app-header__utility-button"
              onClick={() => { handleReturnToStudentCaseEntry(); closeHeaderMenu(true); }}
            >
              Case Library
            </button>
          ) : null}
          {mode === "student" &&
          studentSetupState.status !== "setup-required" &&
          studentCaseScreen === "case" &&
          selectedLibraryCaseId ? (
            <button
              type="button"
              className="app-header__utility-button"
              onClick={() => { handleResetStudentCaseProgress(); closeHeaderMenu(true); }}
            >
              Reset Progress
            </button>
          ) : null}
          <div className="text-size-control" role="group" aria-label="Text Size">
            {TEXT_SIZE_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={textSize === option}
                onClick={() => { setTextSize(option); closeHeaderMenu(true); }}
              >
                {option === "default"
                  ? "Text: Default"
                  : option === "large"
                    ? "Text: Large"
                    : "Text: Larger"}
              </button>
            ))}
          </div>
          <div className="mode-toggle" role="group" aria-label="Workspace Mode">
            <button
              type="button"
              aria-pressed={mode === "student"}
              onClick={() => { setMode("student"); closeHeaderMenu(true); }}
            >
              Student Mode
            </button>
            <button
              type="button"
              aria-pressed={mode === "developer"}
              onClick={() => { setMode("developer"); closeHeaderMenu(true); }}
            >
              Admin Mode
            </button>
          </div>
            </nav>
          ) : null}
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
      selectedLibraryCaseId ? (
        <StudentQueryLab controller={durableCase} entered={false} onEnter={handleEnterStudentCase} />
      ) : null}
      {mode === "student" &&
      studentSetupState.status !== "setup-required" &&
      studentCaseScreen === "case" &&
      selectedLibraryCaseId ? (
        <StudentQueryLab controller={durableCase} entered onEnter={handleEnterStudentCase} />
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
          <AdminInvestigationDiagnostics />
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


function AdminInvestigationDiagnostics(): JSX.Element {
  // Legacy thread diagnostics stay an Admin tool, outside the student runtime.
  const { notebookEntries, completedMilestones } = useStudentCaseState("developer", null);
  const ids = useMemo(() => notebookEntries.map(entry => entry.id), [notebookEntries]);
  const threads = useInvestigationThreads(ids, true);
  return <DeveloperInvestigationThreadsPanel threads={threads.threads} completedMilestones={completedMilestones} notebookEntries={notebookEntries} />;
}