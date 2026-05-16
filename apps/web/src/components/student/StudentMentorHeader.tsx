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
  studentScene: StudentSceneDescriptor;
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
  studentScene
}: StudentMentorHeaderProps): JSX.Element {
  const showSamuelAvatar = activeView === "briefing" || activeView === "workbench";
  const showSceneVisual = activeView === "briefing" || activeView === "case-board";
  const isBriefing = activeView === "briefing";
  const isWorkbench = activeView === "workbench";
  const isCaseBoard = activeView === "case-board";
  const isRedundantMentorTitle =
    mentorTitle === "Samuel's advice" || mentorTitle === "Samuel's nudge";
  const showAvatarName = isBriefing;
  const showMentorTitle = isBriefing || (isCaseBoard && !isRedundantMentorTitle);
  const showRewardStrip = !isWorkbench;
  const headerViewClass = `student-case-header--view-${activeView}`;
  const headerVariant =
    activeView === "briefing"
      ? "briefing-full"
      : activeView === "workbench"
        ? "workbench-mentor-hero"
        : "case-board-scene-hero";
  const headerVariantClass = `student-case-header--variant-${headerVariant}`;

  return (
    <section
      ref={headerRef}
      className={`panel panel--full student-case-header ${headerViewClass} ${headerVariantClass} student-case-header--${caseMomentum.toLowerCase().replace(/\s+/g, "-")}`}
      aria-labelledby="student-case-header-title"
      data-active-view={activeView}
      data-header-variant={headerVariant}
      data-stable-shell="student-case-header"
      tabIndex={-1}
    >
      <div className="student-case-header__content">
        <div className="student-case-header__summary">
          <p className="student-case-header__kicker">Case Status</p>
          <h2 id="student-case-header-title">{caseStatus}</h2>
        </div>
        <section
          className="student-mentor-strip student-mentor-strip--embedded"
          aria-label="Samuel Tupleton Mentor"
        >
          {showSamuelAvatar ? (
            <div className="samuel-avatar-frame">
              <div
                className={`samuel-avatar samuel-avatar--${samuelVisualState}`}
                aria-hidden="true"
              >
                <img src={samuelAvatarSrc} alt="" />
              </div>
              {showAvatarName ? (
                <p className="samuel-avatar-name">Samuel Tupleton</p>
              ) : null}
            </div>
          ) : null}
          <div className="student-mentor-strip__copy">
            {activeView === "workbench" ? (
              <h2
                className="student-mentor-strip__role-kicker"
                data-mentor-strip-role="workbench"
              >
                Samuel&apos;s Guidance
              </h2>
            ) : null}
            {activeView === "case-board" ? (
              <h2
                className="student-mentor-strip__role-kicker"
                data-mentor-strip-role="case-board"
              >
                Samuel&apos;s Evidence Review
              </h2>
            ) : null}
            {showMentorTitle ? (
              <h2 className="student-mentor-strip__title">{mentorTitle}</h2>
            ) : null}
            <p className="student-mentor-strip__message">{mentorMessage}</p>
            {showRewardStrip ? (
              <ul className="samuel-reward-strip" aria-label="Samuel reward status">
                <li>Samuel&apos;s Trust: {samuelTrustLabel}</li>
                <li>Insight Marks: {insightMarks}</li>
              </ul>
            ) : null}
          </div>
        </section>
      </div>
      {showSceneVisual ? (
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
      ) : null}
    </section>
  );
}
