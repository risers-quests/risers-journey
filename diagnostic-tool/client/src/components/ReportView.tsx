import { ReportEntry, fmtDate } from "../reportTypes";
import { Lessons, StaffSection, TopicRing, WorkOn, sureWords } from "./ReportParts";
import { staffSignedIn } from "../staff";

/**
 * One test's report. For the child and parents: how many right, what to
 * work on (where it slips, the main mistake, one tip). Staff see a ready-made
 * lesson per topic instead (Lessons), and the detail folded away below.
 */
export function ReportView({ childName, report, title }: { childName: string; report: ReportEntry; title?: string }) {
  const observation = sureWords(report.sureRight, report.sureTotal, report.right);
  return (
    <div className="rp">
      <header className="rp-head">
        <p className="rp-eyebrow">{report.subject ?? "Maths"} Skill Check</p>
        <h1>{title ?? childName}</h1>
        <p>
          {report.grade} · {fmtDate(report.date)}
        </p>
      </header>

      <TopicRing topics={report.topics} extra={`${report.right} of ${report.questions} questions right. ${observation}`.trim()} />

      {staffSignedIn() ? <Lessons topics={report.topics} /> : <WorkOn topics={report.topics} empty="Nothing to work on from this check. Well done!" />}

      <StaffSection
        topics={report.topics}
        summary={
          <p className="rp-staff-stats">
            {report.right}/{report.questions} right · sure on {report.sureTotal}, right on {report.sureRight} of those
            {report.minutes ? ` · ${report.minutes} min` : ""}
          </p>
        }
      />
    </div>
  );
}
