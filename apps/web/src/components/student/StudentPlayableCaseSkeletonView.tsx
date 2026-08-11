import type { SkeletonPlayableStudentCaseModule } from "../../studentCaseModule";

type StudentPlayableCaseSkeletonViewProps = {
  module: SkeletonPlayableStudentCaseModule;
};

export function StudentPlayableCaseSkeletonView({
  module
}: StudentPlayableCaseSkeletonViewProps): JSX.Element {
  return (
    <section
      className="panel panel--full guidance-panel"
      aria-labelledby="student-playable-skeleton-title"
    >
      <div className="section-heading">
        <p className="message-muted">{module.libraryEntry.landingEyebrow}</p>
        <h2 id="student-playable-skeleton-title">
          {`Case ${module.skeleton.caseNumber}: ${module.skeleton.caseName}`}
        </h2>
        <p className="message-muted">{module.libraryEntry.landingTagline}</p>
      </div>

      <div className="student-setup-card" aria-label="Case 001 skeleton status">
        <p>{module.skeleton.status}</p>
        <p>{module.skeleton.summary}</p>
        <p>
          This gated skeleton proves Case 001 can enter through the playable-case module
          boundary. Full gameplay, persistence, SQL progression, evidence logging, and suspect
          verification are not implemented in this build path.
        </p>
      </div>
    </section>
  );
}
