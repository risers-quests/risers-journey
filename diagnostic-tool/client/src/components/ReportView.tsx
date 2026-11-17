import { ReportEntry, fmtDate } from "../reportTypes";
import { CpaTable, Ring, StatusGroup, nearlyWhy, startWords } from "./ReportParts";

/** One test's report: what the child has got, what's nearly there, what to learn next, and how each topic was learned. */
export function ReportView({ childName, report }: { childName: string; report: ReportEntry }) {
  const tested = report.topics.filter((t) => t.status !== "notReached");
  const by = (s: string) => report.topics.filter((t) => t.status === s);
  return (
    <div className="rp">
      <header className="rp-head">
        <div>
          <p className="rp-eyebrow">Skill Check report · Maths</p>
          <h1>{childName}</h1>
          <p>
            {report.grade} · {fmtDate(report.date)}
            {report.minutes ? ` · ${report.minutes} min` : ""}
          </p>
        </div>
      </header>

      <section className="rp-card rp-top">
        <Ring got={by("secure").length} nearly={by("fragile").length} total={tested.length} />
        <div className="rp-top-text">
          <p>
            <b>{report.right}</b> of {report.questions} questions right.
          </p>
          {report.sureTotal > 0 && (
            <p>
              🎯 When {childName} was sure, they were right <b>{report.sureRight} of {report.sureTotal}</b> times.
            </p>
          )}
          <p className="rp-note">The questions got harder after each right answer, so this is about finding the edge, not getting everything right.</p>
        </div>
      </section>

      <div className="rp-groups">
        <StatusGroup status="secure" title="Strengths" topics={by("secure").map((t) => ({ name: t.name }))} />
        <StatusGroup
          status="fragile"
          title="Nearly there"
          topics={by("fragile").map((t) => ({ name: t.name, note: nearlyWhy(t.why) }))}
        />
        <StatusGroup
          status="gap"
          title="Next to learn"
          topics={by("gap").map((t) => ({
            name: t.name,
            note: [t.mistakes[0] ? `Main mistake: ${t.mistakes[0].label.toLowerCase()}.` : "", startWords(t.startAt) ? `Best to ${startWords(t.startAt)}.` : ""].filter(Boolean).join(" "),
          }))}
        />
        <StatusGroup
          status="notReached"
          title="Coming later"
          topics={by("notReached").map((t) => ({ name: t.name, note: t.blockedBy.length ? `After ${t.blockedBy.join(" and ")}.` : undefined }))}
        />
      </div>

      <CpaTable topics={report.topics} />

      {report.next && (
        <section className="rp-card rp-next">
          <h2>🚀 What's next: {report.next.topic}</h2>
          <p>💡 {report.next.tip}</p>
          <p>🏠 At home: {report.next.atHome}</p>
        </section>
      )}

      {report.actions.length > 0 && (
        <details className="rp-card rp-adults">
          <summary>For teachers and parents</summary>
          <ol>
            {report.actions.map((a) => (
              <li key={a.topic}>
                <b>{a.topic}:</b> {a.what} <span>{a.how}</span>
              </li>
            ))}
          </ol>
        </details>
      )}
    </div>
  );
}
