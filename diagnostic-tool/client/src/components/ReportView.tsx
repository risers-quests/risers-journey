import { ReportEntry, fmtDate } from "../reportTypes";
import { ScoreRing, StaffSection, TopicList, splitTopics, sureWords } from "./ReportParts";

/**
 * One test's report. For the child and parents: how many right, strengths
 * and areas to grow. For staff, folded away below: the detail.
 */
export function ReportView({ childName, report, title }: { childName: string; report: ReportEntry; title?: string }) {
  const { strong, grow } = splitTopics(report.topics);
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

      <section className="rp-card rp-top">
        <ScoreRing value={report.right} total={report.questions} label="questions right" />
        <div className="rp-top-text">
          {observation && <p className="rp-observe">{observation}</p>}
          <p className="rp-note">The questions got harder as you went.</p>
        </div>
      </section>

      <div className="rp-lists">
        <TopicList kind="strong" items={strong} empty="Keep going: your strengths will show here." />
        <TopicList kind="grow" items={grow} empty="Nothing to work on from this check." />
      </div>

      <StaffSection
        topics={report.topics}
        summary={
          <p className="rp-staff-stats">
            {report.right}/{report.questions} right · sure on {report.sureTotal}, right on {report.sureRight} of those
            {report.minutes ? ` · ${report.minutes} min` : ""}
          </p>
        }
      >
        {report.actions.length > 0 && (
          <div className="rp-staff-block">
            <h3>Do next</h3>
            <ol>
              {report.actions.map((a) => (
                <li key={a.topic}>
                  <b>{a.topic}:</b> {a.what} <span>{a.how}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
        {report.next && (
          <div className="rp-staff-block">
            <h3>Teach next: {report.next.topic}</h3>
            <p>{report.next.tip}</p>
          </div>
        )}
      </StaffSection>
    </div>
  );
}
