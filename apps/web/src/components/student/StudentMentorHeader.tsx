import type { RefObject } from "react";
import type { CaseMomentumState, SamuelVisualState, StudentSceneDescriptor } from "../../studentCase";

type StudentMentorHeaderProps = {
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
  return (
    <section
      ref={headerRef}
      className={`panel panel--full student-case-header student-case-header--${caseMomentum.toLowerCase().replace(/\s+/g, "-")}`}
      aria-labelledby="student-case-header-title"
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
          <div className="samuel-avatar-frame">
            <div
              className={`samuel-avatar samuel-avatar--${samuelVisualState}`}
              aria-hidden="true"
            >
              <img src={samuelAvatarSrc} alt="" />
            </div>
            <p className="samuel-avatar-name">Samuel Tupleton</p>
          </div>
          <div className="student-mentor-strip__copy">
            <h2>{mentorTitle}</h2>
            <p>{mentorMessage}</p>
            <ul className="samuel-reward-strip" aria-label="Samuel reward status">
              <li>Samuel&apos;s Trust: {samuelTrustLabel}</li>
              <li>Insight Marks: {insightMarks}</li>
            </ul>
          </div>
        </section>
      </div>
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
    </section>
  );
}
