import { useRef, useState, type Dispatch, type SetStateAction } from "react";
import type { QueryExecutionResponse, QueryRow, SchemaResponse, SchemaTable } from "../../api/types";
import type { ReinforcementSignal } from "../../features/queryReinforcement";
import type { SamuelReaction } from "../../features/samuelReactions";
import type { CaseVerificationSuccessResponse } from "../../api/types";
import { QueryRunner, type QueryAssistRequest } from "../QueryRunner";
import { KNOWN_CASE_FACTS } from "../../studentCase";
import type { EvidenceNotebookEntry, StudentEvidenceFeedbackTone } from "../../studentCase";
import { StudentSchemaTable } from "./StudentSchemaTable";
import { StudentSuspectTheoryPanel } from "./StudentSuspectTheoryPanel";

type QueryRunnerExecutionPayload = {
  sql: string;
  response: QueryExecutionResponse | null;
  error: string | null;
};

type StudentWorkbenchViewProps = {
  highlightedNotebookEntryId: string | null;
  notebookEntries: EvidenceNotebookEntry[];
  onQueryExecutionComplete: (payload: QueryRunnerExecutionPayload) => void;
  onStudentEvidenceLog: (row: QueryRow) => void;
  onStudentSqlEdit: () => void;
  selectedStudentTable: string | null;
  selectedTableDetails: SchemaTable | null;
  setSelectedStudentTable: Dispatch<SetStateAction<string | null>>;
  shouldShowGymLeadGuide: boolean;
  shouldShowSuspectCandidateGuide: boolean;
  shouldShowTriggerCheckGuide: boolean;
  shouldShowWitnessIdentityGuide: boolean;
  shouldShowWitnessTrailGuide: boolean;
  studentSuspectTheoryDraft: string;
  studentSuspectTheoryError: string | null;
  studentSuspectTheoryLoading: boolean;
  studentSuspectTheoryResult: CaseVerificationSuccessResponse | null;
  onStudentSuspectTheoryDraftChange: (value: string) => void;
  onStudentSuspectTheorySubmit: () => Promise<void>;
  studentDraftQuery: string | null;
  studentEvidenceFeedback: string | null;
  studentEvidenceFeedbackTone: StudentEvidenceFeedbackTone;
  studentEvidencePrompt: string | null;
  studentFailureGuidance: string | null;
  studentInstruction: string | null;
  studentQueryRunnerResetKey: number;
  studentRestoredExecution: QueryRunnerExecutionPayload | null;
  studentReinforcement: ReinforcementSignal | null;
  studentSamuelReaction: SamuelReaction | null;
  studentSchema: SchemaResponse | null;
  studentSchemaError: string | null;
  studentSchemaLoading: boolean;
};

type QueryAssistTokenProps = {
  label: string;
  insertion: string;
  onInsert: (text: string, label: string) => void;
};

function QueryAssistToken({
  label,
  insertion,
  onInsert
}: QueryAssistTokenProps): JSX.Element {
  return (
    <button
      type="button"
      className="investigation-brief__token investigation-brief__token--interactive"
      aria-label={`Add ${label} to query editor`}
      onClick={() => onInsert(insertion, label)}
    >
      {label}
    </button>
  );
}

function getPinnedFactAssistText(entry: EvidenceNotebookEntry): string | null {
  const crimeIdMatch = entry.detail.match(/^CrimeID\s*=\s*(.+)$/i);
  if (crimeIdMatch) {
    return `CrimeID = ${crimeIdMatch[1]}`;
  }

  const reportIdMatch = entry.detail.match(/^ReportID\s*=\s*(.+)$/i);
  if (reportIdMatch) {
    return `ReportID = ${reportIdMatch[1]}`;
  }

  const reportCityMatch = entry.detail.match(/^ReportCity\s*=\s*(.+)$/i);
  if (reportCityMatch) {
    const city = reportCityMatch[1].trim().replace(/^['"]|['"]$/g, "");
    return `ReportCity = '${city}'`;
  }

  const reportDateMatch = entry.detail.match(/^ReportDate\s*=\s*(.+)$/i);
  if (reportDateMatch) {
    return `ReportDate = '${reportDateMatch[1].trim()}'`;
  }

  const witnessPersonMatch = entry.detail.match(/^Witness PersonID\s*=\s*(.+)$/i);
  if (witnessPersonMatch) {
    return `PersonID = ${witnessPersonMatch[1]}`;
  }

  const witnessNameMatch = entry.detail.match(/^Witness Name\s+(.+?)\s*=\s*(.+)$/i);
  if (witnessNameMatch) {
    const personName = witnessNameMatch[2].trim().replace(/'/g, "''");
    return `PersonName = '${personName}'`;
  }

  const gymLeadPersonMatch = entry.detail.match(/^Gym Lead PersonID\s*=\s*(.+)$/i);
  if (gymLeadPersonMatch) {
    return `PersonID = ${gymLeadPersonMatch[1]}`;
  }

  const gymLeadNameMatch = entry.detail.match(/^Gym Lead Name\s+(.+?)\s*=\s*(.+)$/i);
  if (gymLeadNameMatch) {
    const personName = gymLeadNameMatch[2].trim().replace(/'/g, "''");
    return `PersonName = '${personName}'`;
  }

  return null;
}

function shouldShowPinnedFactInRail(entry: EvidenceNotebookEntry): boolean {
  return getPinnedFactAssistText(entry) !== null;
}

export function StudentWorkbenchView({
  highlightedNotebookEntryId,
  notebookEntries,
  onQueryExecutionComplete,
  onStudentEvidenceLog,
  onStudentSqlEdit,
  selectedStudentTable,
  selectedTableDetails,
  setSelectedStudentTable,
  shouldShowGymLeadGuide,
  shouldShowSuspectCandidateGuide,
  shouldShowTriggerCheckGuide,
  shouldShowWitnessIdentityGuide,
  shouldShowWitnessTrailGuide,
  studentSuspectTheoryDraft,
  studentSuspectTheoryError,
  studentSuspectTheoryLoading,
  studentSuspectTheoryResult,
  onStudentSuspectTheoryDraftChange,
  onStudentSuspectTheorySubmit,
  studentDraftQuery,
  studentEvidenceFeedback,
  studentEvidenceFeedbackTone,
  studentEvidencePrompt,
  studentFailureGuidance,
  studentInstruction,
  studentQueryRunnerResetKey,
  studentRestoredExecution,
  studentReinforcement,
  studentSamuelReaction,
  studentSchema,
  studentSchemaError,
  studentSchemaLoading
}: StudentWorkbenchViewProps): JSX.Element {
  const [isReferenceOpen, setIsReferenceOpen] = useState(false);
  const [referenceView, setReferenceView] = useState<"tables" | "facts" | "pinned">("pinned");
  const [queryAssistRequest, setQueryAssistRequest] = useState<QueryAssistRequest | null>(null);
  const queryAssistCounterRef = useRef(0);

  function queueQueryAssist(text: string, label: string): void {
    queryAssistCounterRef.current += 1;
    setQueryAssistRequest({
      id: `query-assist-${queryAssistCounterRef.current}`,
      text,
      sourceLabel: label
    });
  }

  function toggleReferenceDrawer(): void {
    setIsReferenceOpen((current) => {
      if (current) {
        return false;
      }

      setReferenceView("pinned");
      return true;
    });
  }

  const witnessPersonIds = notebookEntries
    .map((entry) => {
      const witnessPersonMatch = entry.detail.match(/^Witness PersonID\s*=\s*(.+)$/i);
      return witnessPersonMatch ? witnessPersonMatch[1].trim() : null;
    })
    .filter((personId): personId is string => Boolean(personId));
  const gymLeadPersonIds = notebookEntries
    .map((entry) => {
      const gymLeadPersonMatch = entry.detail.match(/^Gym Lead PersonID\s*=\s*(.+)$/i);
      return gymLeadPersonMatch ? gymLeadPersonMatch[1].trim() : null;
    })
    .filter((personId): personId is string => Boolean(personId));
  const pinnedFactEntries = notebookEntries.filter(shouldShowPinnedFactInRail);

  return (
    <section
      className={`student-workspace student-workspace--focused ${
        isReferenceOpen ? "student-workspace--reference-open" : ""
      }`}
      aria-label="Student Workbench"
    >
      <aside
        className={`student-reference-drawer ${isReferenceOpen ? "student-reference-drawer--open" : ""}`}
        aria-label="Query Lab Reference Drawer"
      >
        <button
          type="button"
          className="student-reference-drawer__toggle"
          aria-expanded={isReferenceOpen}
          onClick={toggleReferenceDrawer}
        >
          Case File
        </button>
        {isReferenceOpen ? (
          <div className="student-reference-drawer__panel">
            <div className="student-reference-drawer__header">
              <div className="student-reference-drawer__heading-row">
                <p className="samuel-briefing__prompt-title">Query Lab Reference</p>
                <button
                  type="button"
                  className="student-reference-drawer__close"
                  aria-label="Close Case File"
                  onClick={() => setIsReferenceOpen(false)}
                >
                  Close
                </button>
              </div>
              <div className="student-reference-drawer__tabs" role="tablist" aria-label="Reference Views">
                <button
                  type="button"
                  role="tab"
                  aria-selected={referenceView === "tables"}
                  className={referenceView === "tables" ? "is-active" : undefined}
                  onClick={() => setReferenceView("tables")}
                >
                  Quick Table Clues
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={referenceView === "pinned"}
                  className={referenceView === "pinned" ? "is-active" : undefined}
                  onClick={() => setReferenceView("pinned")}
                >
                  Pinned Facts
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={referenceView === "facts"}
                  className={referenceView === "facts" ? "is-active" : undefined}
                  onClick={() => setReferenceView("facts")}
                >
                  Case Facts
                </button>
              </div>
            </div>
            {referenceView === "tables" ? (
              <section className="student-reference-drawer__content schema-snapshot" aria-label="Quick Table Clues">
                <p className="message-muted">
                  Open a table when you need a quick reminder about columns or keys.
                </p>
                {studentSchemaLoading ? <p className="message-muted">Loading schema snapshot...</p> : null}
                {studentSchemaError ? <p className="message-error">{studentSchemaError}</p> : null}
                {studentSchema ? (
                  <div className="schema-snapshot__layout">
                    <ul className="schema-pill-list">
                      {studentSchema.data.tables.map((table) => (
                        <li key={table.fullName}>
                          <button
                            type="button"
                            className="schema-link"
                            aria-pressed={selectedStudentTable === table.fullName}
                            onClick={() => setSelectedStudentTable(table.fullName)}
                          >
                            {table.fullName}
                          </button>
                        </li>
                      ))}
                    </ul>
                    {selectedTableDetails ? <StudentSchemaTable table={selectedTableDetails} /> : null}
                  </div>
                ) : null}
              </section>
            ) : referenceView === "pinned" ? (
              <section
                className="student-reference-drawer__content student-reference-drawer__content--pinned"
                aria-label="Pinned Facts"
              >
                <div className="section-heading section-heading--compact">
                  <h2>Pinned Facts</h2>
                  <p className="message-muted">
                    Facts you already proved. Click one to insert it into the query editor.
                  </p>
                </div>
                {pinnedFactEntries.length > 0 ? (
                  <ul className="evidence-snapshot-list">
                    {pinnedFactEntries.map((entry) => (
                      <li
                        key={entry.id}
                        className={
                          entry.id === highlightedNotebookEntryId
                            ? "notebook-entry--highlighted"
                            : undefined
                        }
                      >
                        {getPinnedFactAssistText(entry) ? (
                          <button
                            type="button"
                            className="evidence-snapshot-button"
                            aria-label={`Add ${entry.detail} to query editor`}
                            onClick={() =>
                              queueQueryAssist(
                                getPinnedFactAssistText(entry) ?? entry.detail,
                                entry.detail
                              )
                            }
                          >
                            <span>{entry.detail}</span>
                          </button>
                        ) : (
                          <span>{entry.detail}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="message-muted">No facts pinned yet.</p>
                )}
              </section>
            ) : (
              <section className="student-reference-drawer__content" aria-label="Case Facts">
                <ul className="known-case-facts-list story-recap__text">
                  {KNOWN_CASE_FACTS.map((fact) => (
                    <li key={fact}>{fact}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        ) : null}
      </aside>
      <div
        className="student-workspace__main"
        onClick={() => {
          if (isReferenceOpen) {
            setIsReferenceOpen(false);
          }
        }}
        onFocusCapture={() => {
          if (isReferenceOpen) {
            setIsReferenceOpen(false);
          }
        }}
      >
        {shouldShowWitnessTrailGuide ? (
          <InvestigationBrief
            ariaLabel="Witness Clue Shortcuts"
            title="Witness Clue Shortcuts"
            intro="Samuel's next step: use the pinned report row to pull the witness records tied to that report, then look for repeated PersonIDs."
            clueContent={
              <p>
                Two witness leads from the report - one at the last house on{" "}
                <QueryAssistToken
                  label="Northwestern Dr"
                  insertion="'Northwestern Dr'"
                  onInsert={queueQueryAssist}
                />, and{" "}
                <QueryAssistToken
                  label="Annabel"
                  insertion="'Annabel'"
                  onInsert={queueQueryAssist}
                />, somewhere on{" "}
                <QueryAssistToken
                  label="Franklin Ave"
                  insertion="'Franklin Ave'"
                  onInsert={queueQueryAssist}
                />.
              </p>
            }
            tokenContent={
              <p>
                <QueryAssistToken
                  label="InterviewLog"
                  insertion="InterviewLog"
                  onInsert={queueQueryAssist}
                />{" "}
                <QueryAssistToken
                  label="ReportID"
                  insertion="ReportID"
                  onInsert={queueQueryAssist}
                />{" "}
                <QueryAssistToken
                  label="10975"
                  insertion="10975"
                  onInsert={queueQueryAssist}
                />{" "}
                <QueryAssistToken
                  label="PersonID"
                  insertion="PersonID"
                  onInsert={queueQueryAssist}
                />
              </p>
            }
          />
        ) : null}
        {shouldShowGymLeadGuide ? (
          <InvestigationBrief
            ariaLabel="Gym Membership Clues"
            title="Gym Membership Clues"
            intro="Samuel's next step: start with FitNFlabClub, then narrow the memberships using the 48Z clue and gold-status clue."
            clueContent={
              <p>
                One witness saw a gym bag with membership starting 48Z. That same witness said
                only gold members carry those bags. Use those two facts before you jump to other
                tables.
              </p>
            }
            tokenContent={
              <p>
                <QueryAssistToken
                  label="FitNFlabClub"
                  insertion="FitNFlabClub"
                  onInsert={queueQueryAssist}
                />{" "}
                <QueryAssistToken
                  label="FitMemberID"
                  insertion="FitMemberID"
                  onInsert={queueQueryAssist}
                />{" "}
                <QueryAssistToken
                  label="FitMembershipStatus"
                  insertion="FitMembershipStatus"
                  onInsert={queueQueryAssist}
                />{" "}
                <QueryAssistToken
                  label="48Z"
                  insertion="'48Z'"
                  onInsert={queueQueryAssist}
                />{" "}
                <QueryAssistToken
                  label="gold"
                  insertion="'gold'"
                  onInsert={queueQueryAssist}
                />{" "}
                <QueryAssistToken
                  label="LIKE"
                  insertion="LIKE"
                  onInsert={queueQueryAssist}
                />
              </p>
            }
            footer="Build the filters yourself from those clues. Samuel should not have to write both clauses for you here."
          />
        ) : null}
        {shouldShowTriggerCheckGuide ? (
          <InvestigationBrief
            ariaLabel="Suspect Theory Clues"
            title="Suspect Theory Clues"
            intro="Samuel's next step: use the pinned gym-linked person's name in the theory check below to test your first suspect theory."
            clueContent={
              <p>
                The gym-linked person is pinned now. Use that confirmed name when you move into the controlled suspect theory step.
              </p>
            }
            tokenContent={
              <p>
                <QueryAssistToken
                  label="PersonName"
                  insertion="PersonName"
                  onInsert={queueQueryAssist}
                />
              </p>
            }
            footer="Open Case File > Pinned Facts and use the pinned gym-linked name in the theory check below before you decide whether to keep searching."
          />
        ) : null}
        {shouldShowTriggerCheckGuide ? (
          <StudentSuspectTheoryPanel
            suspectName={studentSuspectTheoryDraft}
            onSuspectNameChange={onStudentSuspectTheoryDraftChange}
            onSubmit={onStudentSuspectTheorySubmit}
            loading={studentSuspectTheoryLoading}
            error={studentSuspectTheoryError}
            result={studentSuspectTheoryResult}
          />
        ) : null}
        {shouldShowSuspectCandidateGuide ? (
          <InvestigationBrief
            ariaLabel="Gym Suspect Lookup"
            title="Gym Suspect Lookup"
            intro="Samuel's next step: use the pinned gym lead PersonID from Case File > Pinned Facts to identify the gym-linked person in PersonsOfInterest."
            clueContent={
              <p>
                The gym clue gave you one linked PersonID. Turn that ID into a real name before you test any suspect theory.
              </p>
            }
            tokenContent={
              <p>
                <QueryAssistToken
                  label="PersonsOfInterest"
                  insertion="PersonsOfInterest"
                  onInsert={queueQueryAssist}
                />{" "}
                <QueryAssistToken
                  label="PersonID"
                  insertion="PersonID"
                  onInsert={queueQueryAssist}
                />{" "}
                <QueryAssistToken
                  label="PersonName"
                  insertion="PersonName"
                  onInsert={queueQueryAssist}
                />
              </p>
            }
            footer={
              gymLeadPersonIds.length > 0
                ? "Open Case File > Pinned Facts and use the pinned gym lead PersonID for the exact value before you log the matching person row."
                : "Open Case File > Pinned Facts and use the pinned gym lead PersonID for the exact value before you log the matching person row."
            }
          />
        ) : null}
        {shouldShowWitnessIdentityGuide ? (
          <InvestigationBrief
            ariaLabel="Witness Identity Shortcuts"
            title="Witness Identity Shortcuts"
            intro="Samuel's next step: identify the two witness names first. Start with PersonsOfInterest, then use the pinned witness PersonIDs to narrow the lookup before you log any matching rows."
            clueContent={
              <p>
                You already proved two witness PersonIDs. Turn those IDs into names before you
                chase any new trail.
              </p>
            }
            tokenContent={
              <p>
                <QueryAssistToken
                  label="PersonsOfInterest"
                  insertion="PersonsOfInterest"
                  onInsert={queueQueryAssist}
                />{" "}
                <QueryAssistToken
                  label="PersonID"
                  insertion="PersonID"
                  onInsert={queueQueryAssist}
                />
              </p>
            }
            footer={
              witnessPersonIds.length > 0
                ? "Open Case File > Pinned Facts and use the witness PersonIDs for the exact values before you try to log any names."
                : undefined
            }
          />
        ) : null}
        <QueryRunner
          audience="student"
          onExecutionComplete={onQueryExecutionComplete}
          onStudentSqlEdit={onStudentSqlEdit}
          draftQuery={studentDraftQuery}
          queryAssistRequest={queryAssistRequest}
          resetKey={studentQueryRunnerResetKey}
          restoredExecution={studentRestoredExecution}
          studentInstruction={studentInstruction}
          studentFailureGuidance={studentFailureGuidance}
          studentEvidencePrompt={studentEvidencePrompt}
          studentReinforcement={studentReinforcement}
          studentSamuelReaction={studentSamuelReaction}
          studentEvidenceFeedback={studentEvidenceFeedback}
          studentEvidenceFeedbackTone={studentEvidenceFeedbackTone}
          onStudentLogRow={onStudentEvidenceLog}
        />
      </div>
    </section>
  );
}

type InvestigationBriefProps = {
  ariaLabel: string;
  title: string;
  intro?: string;
  clueLabel?: string;
  clueContent: JSX.Element;
  tokenContent: JSX.Element;
  footer?: string;
};

function InvestigationBrief({
  ariaLabel,
  title,
  intro,
  clueLabel = "Case Clues",
  clueContent,
  tokenContent,
  footer
}: InvestigationBriefProps): JSX.Element {
  return (
    <section className="panel student-investigation-brief" aria-label={ariaLabel}>
      <p className="samuel-briefing__prompt-title">{title}</p>
      {intro ? <p className="message-muted">{intro}</p> : null}
      <p className="message-muted">
        Use the tokens below as query-building hints. When you need exact proved values, open Case File &gt; Pinned Facts and insert them from there.
      </p>
      <div className="investigation-brief-compact">
        <p className="investigation-brief__label">{clueLabel}</p>
        {clueContent}
        <p className="investigation-brief__label">Query Tokens</p>
        {tokenContent}
        {footer ? <p className="message-muted">{footer}</p> : null}
      </div>
    </section>
  );
}
