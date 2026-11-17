import { useEffect, useState } from "react";
import { getFullReport, resendEmail } from "../api";
import { FullReport } from "../reportTypes";
import { ReportView } from "../components/ReportView";
import { Downloads } from "../components/Downloads";
import { fmtDate } from "../reportTypes";

/**
 * A finished test's report: shown at the end of the test, and opened from
 * the child's report history (?report=<code>). Also says whether the
 * detailed reports were emailed.
 */
export function Summary({ sessionId, fromHistory = false }: { sessionId: string; fromHistory?: boolean }) {
  const [data, setData] = useState<FullReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  useEffect(() => {
    getFullReport(sessionId).then(setData, (e) => setError(String(e.message || e)));
  }, [sessionId]);
  if (error) return <div className="setup-wrap">Couldn't open this report: {error}</div>;
  if (!data) return <div className="setup-wrap">Getting the report…</div>;

  async function resend() {
    setSending(true);
    const email = await resendEmail(sessionId).catch(() => null);
    setData((d) => (d && email ? { ...d, email } : d));
    setSending(false);
  }
  const e = data.email;
  return (
    <>
      {!fromHistory && <h1 className="rp-welldone">Well done, {data.childName}! 🎉</h1>}
      <ReportView childName={data.childName} report={data.report} />
      <div className="rp-foot">
        <Downloads childName={data.childName} reports={[data.report]} fileName={`${data.childName} - Skill Check report - ${fmtDate(data.report.date)}`} />
        <a className="btn btn-secondary" href={`?child=${encodeURIComponent(data.kid)}`}>
          All of {data.childName}'s reports →
        </a>
        {!fromHistory && (
          <p className="sum-email">
            {e && e.child && e.staff ? (
              <>📧 The full reports have been emailed to {data.childName} and to LifeHub staff.</>
            ) : e && e.staff ? (
              <>📧 The staff report was emailed. {data.childName}'s report couldn't be sent{e.note ? ` (${e.note})` : ""}.</>
            ) : (
              <>
                📧 The reports weren't emailed{e?.note ? `: ${e.note}` : ""}.{" "}
                <button className="btn btn-secondary" onClick={resend} disabled={sending}>
                  {sending ? "Sending…" : "Send them again"}
                </button>
              </>
            )}
          </p>
        )}
      </div>
    </>
  );
}
