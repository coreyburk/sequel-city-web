import { useRef, useState, type Dispatch, type SetStateAction } from "react";
import type { QueryExecutionResponse, QueryRow, SchemaResponse, SchemaTable } from "../../api/types";
import type { ReinforcementSignal } from "../../features/queryReinforcement";
import type { SamuelReaction } from "../../features/samuelReactions";
import { QueryRunner, type QueryAssistRequest } from "../QueryRunner";
import { KNOWN_CASE_FACTS } from "../../studentCase";
import type { EvidenceNotebookEntry, StudentEvidenceFeedbackTone } from "../../studentCase";
import { StudentSchemaTable } from "./StudentSchemaTable";

type QueryRunnerExecutionPayload = {
  sql: string;
  response: QueryExecutionResponse | null;
  error: string | null;
};

type StudentWorkbenchViewProps = {
  confirmedTriggerReportId: string;
  confirmedTriggerSuspectName: string | null;
  confirmedTriggerSuspectPersonId: string | null;
  highlightedNotebookEntryId: string | null;
  hasPinnedMastermindIdentities: boolean;
  isMastermindEventRegistrationActive: boolean;
  isMastermindEventScheduleActive: boolean;
  mastermindProfileComplete: boolean;
  mastermindSharedEventIds: string[];
  notebookEntries: EvidenceNotebookEntry[];
  onQueryExecutionComplete: (payload: QueryRunnerExecutionPayload) => void;
  onStudentEvidenceLog: (row: QueryRow) => void;
  onStudentSqlEdit: (sql: string) => void;
  selectedStudentTable: string | null;
  selectedTableDetails: SchemaTable | null;
  setSelectedStudentTable: Dispatch<SetStateAction<string | null>>;
  shouldShowGymLeadGuide: boolean;
  shouldShowMastermindHandoffGuide: boolean;
  shouldShowSuspectCandidateGuide: boolean;
  shouldShowSuspectInterviewGuide: boolean;
  shouldShowWitnessIdentityGuide: boolean;
  shouldShowWitnessTrailGuide: boolean;
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

type PinnedFactAssistToken = {
  label: string;
  text: string;
};

function getPinnedFactAssistTokens(entry: EvidenceNotebookEntry): PinnedFactAssistToken[] {
  const crimeIdMatch = entry.detail.match(/^CrimeID\s*=\s*(.+)$/i);
  if (crimeIdMatch) {
    return [{ label: "CrimeID", text: `CrimeID = ${crimeIdMatch[1]}` }];
  }

  const reportIdMatch = entry.detail.match(/^ReportID\s*=\s*(.+)$/i);
  if (reportIdMatch) {
    return [{ label: "ReportID", text: `ReportID = ${reportIdMatch[1]}` }];
  }

  const reportCityMatch = entry.detail.match(/^ReportCity\s*=\s*(.+)$/i);
  if (reportCityMatch) {
    const city = reportCityMatch[1].trim().replace(/^['"]|['"]$/g, "");
    return [{ label: "ReportCity", text: `ReportCity = '${city}'` }];
  }

  const reportDateMatch = entry.detail.match(/^ReportDate\s*=\s*(.+)$/i);
  if (reportDateMatch) {
    return [{ label: "ReportDate", text: `ReportDate = '${reportDateMatch[1].trim()}'` }];
  }

  const witnessPersonMatch = entry.detail.match(/^Witness PersonID\s*=\s*(.+)$/i);
  if (witnessPersonMatch) {
    return [{ label: "PersonID", text: `PersonID = ${witnessPersonMatch[1]}` }];
  }

  const witnessNameMatch = entry.detail.match(/^Witness Name\s+(.+?)\s*=\s*(.+)$/i);
  if (witnessNameMatch) {
    const personName = witnessNameMatch[2].trim().replace(/'/g, "''");
    return [{ label: "PersonName", text: `PersonName = '${personName}'` }];
  }

  const gymLeadPersonMatch = entry.detail.match(/^Gym Lead PersonID\s*=\s*(.+)$/i);
  if (gymLeadPersonMatch) {
    return [{ label: "PersonID", text: `PersonID = ${gymLeadPersonMatch[1]}` }];
  }

  const gymLeadNameMatch = entry.detail.match(/^Gym Lead Name\s+(.+?)\s*=\s*(.+)$/i);
  if (gymLeadNameMatch) {
    const personName = gymLeadNameMatch[2].trim().replace(/'/g, "''");
    return [{ label: "PersonName", text: `PersonName = '${personName}'` }];
  }

  const mastermindCandidateMatch = entry.detail.match(
    /^Mastermind Candidate:\s*LicenseID\s+(\d+),\s*(.+?)-haired\s+(\w+)\s+(\w+)\s+(\w+)\s+owner,\s+(\d+)\s+inches\s+tall,\s+plate\s+([a-z0-9]+)/i
  );
  if (mastermindCandidateMatch) {
    const [, licenseId, hairColor, gender, carMake, carModel, height, plateNumber] =
      mastermindCandidateMatch;
    return [
      { label: "LicenseID", text: `LicenseID = ${licenseId}` },
      { label: "HairColor", text: `HairColor = '${hairColor}'` },
      { label: "Gender", text: `Gender = '${gender}'` },
      { label: "CarMake", text: `CarMake = '${carMake}'` },
      { label: "CarModel", text: `CarModel = '${carModel}'` },
      { label: "Height", text: `Height = ${height}` },
      { label: "PlateNumber", text: `PlateNumber = '${plateNumber}'` }
    ];
  }

  const mastermindIdentityMatch = entry.detail.match(
    /^Mastermind Identity:\s*PersonID\s+(\d+),\s*PersonName\s+(.+?),\s*LicenseID\s+(\d+)/i
  );
  if (mastermindIdentityMatch) {
    const [, personId, personName, licenseId] = mastermindIdentityMatch;
    return [
      { label: "EventPersonID", text: `EventPersonID = ${personId}` },
      { label: "PersonID", text: `PersonID = ${personId}` },
      { label: "PersonName", text: `PersonName = '${personName.replace(/'/g, "''")}'` },
      { label: "LicenseID", text: `LicenseID = ${licenseId}` }
    ];
  }

  const normalizedDetail = entry.detail.trim().toLowerCase();
  if (normalizedDetail.startsWith("mastermind clue:")) {
    if (normalizedDetail.includes("three times last december")) {
      return [{ label: "EventDate", text: "EventDate LIKE '2023-12%'" }];
    }

    if (normalizedDetail.includes("next to symphony hall")) {
      return [{ label: "EventName", text: "EventName = 'Symphony Hall'" }];
    }

    if (normalizedDetail.includes("drives a bmw m8")) {
      return [
        { label: "CarMake", text: "CarMake = 'BMW'" },
        { label: "CarModel", text: "CarModel = 'M8'" }
      ];
    }

    if (
      normalizedDetail.includes("red hair") ||
      normalizedDetail.includes("redheaded")
    ) {
      return [{ label: "HairColor", text: "HairColor = 'red'" }];
    }

    if (normalizedDetail.includes("about 5'5\" to 5'8\" tall")) {
      return [{ label: "Height", text: "Height BETWEEN 65 AND 67" }];
    }

    if (normalizedDetail.includes("woman who hired him")) {
      return [{ label: "Gender", text: "Gender = 'female'" }];
    }
  }

  return [];
}

function shouldShowPinnedFactInRail(entry: EvidenceNotebookEntry): boolean {
  return getPinnedFactAssistTokens(entry).length > 0;
}

export function StudentWorkbenchView({
  confirmedTriggerReportId,
  confirmedTriggerSuspectName,
  confirmedTriggerSuspectPersonId,
  highlightedNotebookEntryId,
  hasPinnedMastermindIdentities,
  isMastermindEventRegistrationActive,
  isMastermindEventScheduleActive,
  mastermindProfileComplete,
  mastermindSharedEventIds,
  notebookEntries,
  onQueryExecutionComplete,
  onStudentEvidenceLog,
  onStudentSqlEdit,
  selectedStudentTable,
  selectedTableDetails,
  setSelectedStudentTable,
  shouldShowGymLeadGuide,
  shouldShowMastermindHandoffGuide,
  shouldShowSuspectCandidateGuide,
  shouldShowSuspectInterviewGuide,
  shouldShowWitnessIdentityGuide,
  shouldShowWitnessTrailGuide,
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
  const mastermindCandidateEntries = notebookEntries.filter((entry) =>
    entry.id.startsWith("mastermind-candidate-")
  );
  const mastermindIdentityEntries = notebookEntries.filter((entry) =>
    entry.id.startsWith("mastermind-identity-")
  );
  const mastermindIdentityPersonIds = mastermindIdentityEntries
    .map((entry) => {
      const match = entry.detail.match(/^Mastermind Identity:\s*PersonID\s+(\d+)/i);
      return match ? match[1].trim() : null;
    })
    .filter((personId): personId is string => Boolean(personId));
  const mastermindCandidateCount = mastermindCandidateEntries.length;
  const shouldShowMastermindCandidateCrossCheck =
    mastermindProfileComplete && mastermindCandidateCount >= 2;
  const confirmedTriggerLabel = confirmedTriggerSuspectName?.trim() || "the confirmed suspect";
  const confirmedTriggerPossessiveLabel = confirmedTriggerLabel.endsWith("s")
    ? `${confirmedTriggerLabel}'`
    : `${confirmedTriggerLabel}'s`;
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
                      Facts you already proved. Click one to insert it into the query editor when a direct query fragment is available.
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
                        <span>{entry.detail}</span>
                        <div className="evidence-snapshot-actions">
                          {getPinnedFactAssistTokens(entry).map((token) => (
                            <button
                              key={`${entry.id}-${token.label}-${token.text}`}
                              type="button"
                              className="evidence-snapshot-button"
                              aria-label={`Add ${token.label} from ${entry.detail} to query editor`}
                              onClick={() => queueQueryAssist(token.text, `${entry.detail} · ${token.label}`)}
                            >
                              <span>{token.label}</span>
                            </button>
                          ))}
                        </div>
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
                />
              </p>
            }
            footer="Build the filters yourself from those clues. Samuel should not have to write both clauses for you here."
          />
        ) : null}
        {shouldShowMastermindHandoffGuide ? (
          <InvestigationBrief
            ariaLabel={
              shouldShowMastermindCandidateCrossCheck
                ? "Mastermind Candidate Cross-Check"
                : mastermindProfileComplete
                ? "Mastermind Candidate Narrowing"
                : "Mastermind Transcript Trail"
            }
            title={
              shouldShowMastermindCandidateCrossCheck
                ? "Mastermind Candidate Cross-Check"
                : mastermindProfileComplete
                ? "Mastermind Candidate Narrowing"
                : "Mastermind Transcript Trail"
            }
            intro={
              isMastermindEventScheduleActive
                ? "Both candidate trails are in play now. Samuel's next step: stay with EventSchedule, use the EventIDs from the event-trail comparison, and narrow the calendar to the December Symphony Hall meeting that matters."
                : isMastermindEventRegistrationActive
                ? "Both shortlisted women are pinned now. Samuel's next step: compare their EventRegistration rows, identify the strongest EventIDs, and carry those IDs into EventSchedule."
                : hasPinnedMastermindIdentities
                ? "Both shortlisted women are pinned now. Samuel's next step: use their returned PersonIDs in EventRegistration before you move to EventSchedule."
                : shouldShowMastermindCandidateCrossCheck
                ? `${confirmedTriggerLabel} is confirmed, and your shortlist is pinned now. Samuel's next step: use those candidate LicenseIDs to identify both women, then compare their December Symphony Hall trail before you decide who still fits the mastermind role.`
                : mastermindProfileComplete
                ? `${confirmedTriggerLabel} is confirmed, and the full profile is pinned now. Samuel's next step: leave InterviewLog, switch to DriversLicense, and narrow the shortlist of women who could match the hidden mastermind.`
                : `${confirmedTriggerLabel} is confirmed. Samuel's next step: isolate ${confirmedTriggerPossessiveLabel} InterviewLog rows tied to the murder report, then use that transcript to expose the mastermind behind the hit.`
            }
            clueContent={
              isMastermindEventScheduleActive ? (
                <p>
                  Use the EventIDs from the candidate trail to narrow EventSchedule. First keep the
                  EventIDs in view, then add the December clue, then add Symphony Hall, and compare
                  what survives.
                </p>
              ) : isMastermindEventRegistrationActive ? (
                <p>
                  Both women are identified now. Compare their EventRegistration rows by returned
                  PersonID, look for overlapping or December-facing EventIDs, then take those IDs
                  into EventSchedule.
                </p>
              ) : hasPinnedMastermindIdentities ? (
                <p>
                  The two women are pinned. Step 1: query EventRegistration with both returned
                  PersonIDs. Step 2: compare the EventIDs tied to each woman. Step 3: move the
                  strongest EventIDs into EventSchedule and test December plus Symphony Hall there.
                </p>
              ) : shouldShowMastermindCandidateCrossCheck ? (
                <p>
                  The BMW and appearance clues narrowed the field. Identify both candidates,
                  then compare their December Symphony Hall trail, meeting pattern,
                  and any connected event activity before you decide who ordered the hit.
                </p>
              ) : mastermindProfileComplete ? (
                <p>
                  You already pulled the transcript profile together. Now test it
                  against DriversLicense and see which real people still fit the BMW
                  M8, red-hair, female, and height clues. The witness red BMW note is
                  a lead to compare, not a proven match yet.
                </p>
              ) : (
                <p>
                  The mastermind clue is not buried in every InterviewLog row{" "}
                  {confirmedTriggerLabel} ever gave. Stay with InterviewLog and narrow
                  it until {confirmedTriggerLabel} and the murder report point to the
                  same transcript trail.
                </p>
              )
            }
            tokenContent={
              isMastermindEventScheduleActive ? (
                <p>
                  <QueryAssistToken
                    label="EventSchedule"
                    insertion="EventSchedule"
                    onInsert={queueQueryAssist}
                  />{" "}
                  <QueryAssistToken
                    label="EventID"
                    insertion="EventID"
                    onInsert={queueQueryAssist}
                  />{" "}
                  {mastermindSharedEventIds.map((eventId) => (
                    <span key={`event-id-${eventId}`}>
                      <QueryAssistToken
                        label={eventId}
                        insertion={eventId}
                        onInsert={queueQueryAssist}
                      />{" "}
                    </span>
                  ))}
                  <QueryAssistToken
                    label="EventDate"
                    insertion="EventDate"
                    onInsert={queueQueryAssist}
                  />{" "}
                  <QueryAssistToken
                    label="EventName"
                    insertion="EventName"
                    onInsert={queueQueryAssist}
                  />{" "}
                  <QueryAssistToken
                    label="Symphony Hall"
                    insertion="'Symphony Hall'"
                    onInsert={queueQueryAssist}
                  />{" "}
                  <QueryAssistToken
                    label="2023-12"
                    insertion="'2023-12'"
                    onInsert={queueQueryAssist}
                  />
                </p>
              ) : isMastermindEventRegistrationActive || hasPinnedMastermindIdentities ? (
                <p>
                  <QueryAssistToken
                    label="EventRegistration"
                    insertion="EventRegistration"
                    onInsert={queueQueryAssist}
                  />{" "}
                  <QueryAssistToken
                    label="EventPersonID"
                    insertion="EventPersonID"
                    onInsert={queueQueryAssist}
                  />{" "}
                  {mastermindIdentityPersonIds.map((personId) => (
                    <span key={`event-person-${personId}`}>
                      <QueryAssistToken
                        label={personId}
                        insertion={personId}
                        onInsert={queueQueryAssist}
                      />{" "}
                    </span>
                  ))}
                  <QueryAssistToken
                    label="EventID"
                    insertion="EventID"
                    onInsert={queueQueryAssist}
                  />{" "}
                  <QueryAssistToken
                    label="EventSchedule"
                    insertion="EventSchedule"
                    onInsert={queueQueryAssist}
                  />{" "}
                  <QueryAssistToken
                    label="EventDate"
                    insertion="EventDate"
                    onInsert={queueQueryAssist}
                  />{" "}
                  <QueryAssistToken
                    label="EventName"
                    insertion="EventName"
                    onInsert={queueQueryAssist}
                  />{" "}
                  <QueryAssistToken
                    label="Symphony Hall"
                    insertion="'Symphony Hall'"
                    onInsert={queueQueryAssist}
                  />{" "}
                  <QueryAssistToken
                    label="2023-12"
                    insertion="'2023-12'"
                    onInsert={queueQueryAssist}
                  />
                </p>
              ) : shouldShowMastermindCandidateCrossCheck ? (
                <p>
                  <QueryAssistToken
                    label="PersonsOfInterest"
                    insertion="PersonsOfInterest"
                    onInsert={queueQueryAssist}
                  />{" "}
                  <QueryAssistToken
                    label="LicenseID"
                    insertion="LicenseID"
                    onInsert={queueQueryAssist}
                  />{" "}
                  <QueryAssistToken
                    label="PlateNumber"
                    insertion="PlateNumber"
                    onInsert={queueQueryAssist}
                  />{" "}
                  <QueryAssistToken
                    label="EventRegistration"
                    insertion="EventRegistration"
                    onInsert={queueQueryAssist}
                  />{" "}
                  <QueryAssistToken
                    label="EventSchedule"
                    insertion="EventSchedule"
                    onInsert={queueQueryAssist}
                  />{" "}
                  <QueryAssistToken
                    label="EventPersonID"
                    insertion="EventPersonID"
                    onInsert={queueQueryAssist}
                  />{" "}
                  <QueryAssistToken
                    label="EventID"
                    insertion="EventID"
                    onInsert={queueQueryAssist}
                  />{" "}
                  <QueryAssistToken
                    label="EventDate"
                    insertion="EventDate"
                    onInsert={queueQueryAssist}
                  />{" "}
                  <QueryAssistToken
                    label="EventName"
                    insertion="EventName"
                    onInsert={queueQueryAssist}
                  />{" "}
                  <QueryAssistToken
                    label="Symphony Hall"
                    insertion="'Symphony Hall'"
                    onInsert={queueQueryAssist}
                  />{" "}
                  <QueryAssistToken
                    label="2023-12"
                    insertion="'2023-12'"
                    onInsert={queueQueryAssist}
                  />
                </p>
              ) : mastermindProfileComplete ? (
                <p>
                  <QueryAssistToken
                    label="DriversLicense"
                    insertion="DriversLicense"
                    onInsert={queueQueryAssist}
                  />{" "}
                  <QueryAssistToken
                    label="CarMake"
                    insertion="CarMake"
                    onInsert={queueQueryAssist}
                  />{" "}
                  <QueryAssistToken
                    label="CarModel"
                    insertion="CarModel"
                    onInsert={queueQueryAssist}
                  />{" "}
                  <QueryAssistToken
                    label="Gender"
                    insertion="Gender"
                    onInsert={queueQueryAssist}
                  />{" "}
                  <QueryAssistToken
                    label="HairColor"
                    insertion="HairColor"
                    onInsert={queueQueryAssist}
                  />{" "}
                  <QueryAssistToken
                    label="Height"
                    insertion="Height"
                    onInsert={queueQueryAssist}
                  />{" "}
                  <QueryAssistToken
                    label="PlateNumber"
                    insertion="PlateNumber"
                    onInsert={queueQueryAssist}
                  />{" "}
                  <QueryAssistToken
                    label="BMW"
                    insertion="'BMW'"
                    onInsert={queueQueryAssist}
                  />{" "}
                  <QueryAssistToken
                    label="M8"
                    insertion="'M8'"
                    onInsert={queueQueryAssist}
                  />{" "}
                  <QueryAssistToken
                    label="female"
                    insertion="'female'"
                    onInsert={queueQueryAssist}
                  />{" "}
                  <QueryAssistToken
                    label="red"
                    insertion="'red'"
                    onInsert={queueQueryAssist}
                  />
                </p>
              ) : (
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
                    label="PersonID"
                    insertion="PersonID"
                    onInsert={queueQueryAssist}
                  />{" "}
                  {confirmedTriggerSuspectPersonId ? (
                    <>
                      <QueryAssistToken
                        label={confirmedTriggerSuspectPersonId}
                        insertion={confirmedTriggerSuspectPersonId}
                        onInsert={queueQueryAssist}
                      />{" "}
                    </>
                  ) : null}
                  <QueryAssistToken
                    label="LogTranscript"
                    insertion="LogTranscript"
                    onInsert={queueQueryAssist}
                  />
                </p>
              )
            }
            footer={
              isMastermindEventScheduleActive
                ? "Use the EventIDs you surfaced from EventRegistration. Once those IDs are in EventSchedule, narrow by December and Symphony Hall before you decide what the row actually proves."
                : isMastermindEventRegistrationActive
                ? "Keep both women in the same EventRegistration query so you can compare their EventIDs directly. Then take the strongest IDs into EventSchedule."
                : hasPinnedMastermindIdentities
                ? "Open Case File > Pinned Facts and use the returned EventPersonID values from the two identity rows before you build the EventRegistration comparison."
                : shouldShowMastermindCandidateCrossCheck
                ? "Use the candidate LicenseIDs you already pinned on Page 2. If the BMW clue stalls out, compare those candidates through PersonsOfInterest and follow the December Symphony Hall trail through EventRegistration and EventSchedule."
                : mastermindProfileComplete
                ? "Use the clue profile you already earned. Start with the vehicle and appearance filters, then compare the remaining records against your witness BMW note, Symphony Hall clue, and money/jewelry notes."
                : `Open Case File > Pinned Facts for ${confirmedTriggerPossessiveLabel} PersonID and ReportID ${confirmedTriggerReportId}. Start broad if you need context, then use both values to isolate the mastermind transcript.`
            }
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
        {shouldShowSuspectInterviewGuide ? (
          <InvestigationBrief
            ariaLabel="Suspect Interview Clues"
            title="Suspect Interview Clues"
            intro="Samuel's next step: review the gym-linked suspect's InterviewLog rows and pin the one row that best shows what his own words add to the case."
            clueContent={
              <p>
                Stay with InterviewLog and read the suspect's own words first. When one row clearly strengthens or weakens the case, use Log Clue on that row and carry it to your notebook.
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
                  label="PersonID"
                  insertion="PersonID"
                  onInsert={queueQueryAssist}
                />{" "}
                {confirmedTriggerSuspectPersonId ? (
                  <>
                    <QueryAssistToken
                      label={confirmedTriggerSuspectPersonId}
                      insertion={confirmedTriggerSuspectPersonId}
                      onInsert={queueQueryAssist}
                    />{" "}
                  </>
                ) : null}
                <QueryAssistToken
                  label="LogTranscript"
                  insertion="LogTranscript"
                  onInsert={queueQueryAssist}
                />
              </p>
            }
            footer="Use the pinned gym lead PersonID from Case File > Pinned Facts for the exact value before you decide which interview row belongs in your notes."
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
          studentTranscriptChapter={
            shouldShowWitnessTrailGuide
              ? "witness"
              : shouldShowSuspectInterviewGuide
                ? "suspect"
                : shouldShowMastermindHandoffGuide && !mastermindProfileComplete
                  ? "mastermind"
                  : null
          }
          studentTranscriptPersonId={confirmedTriggerSuspectPersonId}
          studentTranscriptReportId={confirmedTriggerReportId}
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
