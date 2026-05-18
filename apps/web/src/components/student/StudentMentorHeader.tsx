import type { RefObject } from "react";
import type {
  CaseMomentumState,
  SamuelVisualState,
  StudentSceneDescriptor,
  StudentView
} from "../../studentCase";

type StudentMentorHeaderProps = {
  activeView: StudentView;
  caseMomentum: CaseMomentumState;
  caseStatus: string;
  headerRef: RefObject<HTMLElement>;
  mentorMessage: string;
  mentorTitle: string;
  samuelAvatarSrc: string;
  samuelTrustLabel: string;
  samuelVisualState: SamuelVisualState;
  insightMarks: number;
  studentObjective: string;
  studentScene: StudentSceneDescriptor;
};

const GUIDANCE_HEADING: Record<StudentView, string> = {
  briefing: "Meet Samuel Tupleton",
  workbench: "Samuel's Guidance",
  "case-board": "Samuel's Evidence Review"
};

const SUPPRESSED_BEAT_TITLES = new Set<string>([
  "Meet Samuel Tupleton",
  "Samuel's Guidance",
  "Samuel's Evidence Review",
  "Samuel's nudge",
  "Samuel's advice"
]);

const HEADER_VARIANT: Record<StudentView, string> = {
  briefing: "briefing-full",
  workbench: "workbench-mentor-hero",
  "case-board": "case-board-scene-hero"
};

export function StudentMentorHeader({
  activeView,
  caseMomentum,
  caseStatus,
  headerRef,
  mentorMessage,
  mentorTitle,
  samuelAvatarSrc,
  samuelTrustLabel,
  samuelVisualState,
  insightMarks,
  studentObjective,
  studentScene
}: StudentMentorHeaderProps): JSX.Element {
  const guidanceHeading = GUIDANCE_HEADING[activeView];
  const headerVariant = HEADER_VARIANT[activeView];
  const momentumModifier = caseMomentum.toLowerCase().replace(/\s+/g, "-");
  const caseBeatLabel = SUPPRESSED_BEAT_TITLES.has(mentorTitle) ? null : mentorTitle;

  return (
    <section
      ref={headerRef}
      className={`panel panel--full student-case-header student-case-header--view-${activeView} student-case-header--variant-${headerVariant} student-case-header--${momentumModifier}`}
      aria-labelledby="student-case-header-title"
      data-active-view={activeView}
      data-header-variant={headerVariant}
      data-stable-shell="student-case-header"
      data-shared-grid="student-header-grid"
      tabIndex={-1}
    >
      <div className="student-case-header__summary">
        <p className="student-case-header__kicker">Case Status</p>
        <h2 id="student-case-header-title">{caseStatus}</h2>
      </div>
      <div className="student-case-header__grid" data-stable-grid="student-header-grid">
        <div
          className="student-case-header__region student-case-header__region--visual"
          data-stable-region="visual"
        >
          <div className="samuel-avatar-frame">
            <div
              className={`samuel-avatar samuel-avatar--${samuelVisualState}`}
              aria-hidden="true"
            >
              <img src={samuelAvatarSrc} alt="" />
            </div>
          </div>
        </div>
        <section
          className="student-case-header__region student-case-header__region--guidance"
          data-stable-region="guidance"
          aria-label="Samuel Tupleton Mentor"
        >
          <h2
            className="student-case-header__heading"
            data-mentor-strip-role={activeView}
          >
            {guidanceHeading}
          </h2>
          {caseBeatLabel ? (
            <p
              className="student-case-header__beat"
              data-case-beat="case-progression"
            >
              {caseBeatLabel}
            </p>
          ) : null}
          <dl
            className="student-case-header__direction"
            data-direction-role="primary-instruction"
          >
            <dt className="student-case-header__direction-label">What to prove</dt>
            <dd className="student-case-header__direction-value">{studentObjective}</dd>
            <dt className="student-case-header__direction-label">What to do next</dt>
            <dd className="student-case-header__direction-value student-case-header__message">
              {mentorMessage}
            </dd>
          </dl>
          <ul
            className="student-case-header__rewards"
            aria-label="Samuel reward status"
          >
            <li>Samuel&apos;s Trust: {samuelTrustLabel}</li>
            <li>Insight Marks: {insightMarks}</li>
          </ul>
        </section>
        <div
          className="student-case-header__region student-case-header__region--scene"
          data-stable-region="scene"
        >
          <div className="student-case-header__visual" aria-label="Noir Scene Visual">
            <div className={`noir-scene-frame noir-scene-frame--${studentScene.visual}`}>
              <img
                className="noir-scene-frame__image"
                src={studentScene.imageSrc}
                alt={studentScene.alt}
              />
              <div className="noir-scene-frame__scrim" aria-hidden="true" />
              <div className="noir-scene-frame__grain" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
