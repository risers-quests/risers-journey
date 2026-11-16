import { useEffect, useState } from "react";
import { getSummary, resendEmail, Summary as SummaryData } from "../api";

const LOOK: Record<string, { icon: string; word: string; cls: string }> = {
  secure: { icon: "⭐", word: "Got it", cls: "sum-secure" },
  fragile: { icon: "🌱", word: "Nearly there", cls: "sum-fragile" },
  gap: { icon: "🔧", word: "Next to learn", cls: "sum-gap" },
  notReached: { icon: "⏸", word: "Coming later", cls: "sum-later" },
};

/** The on-site result: one line per topic, the next step, and whether the detailed reports were emailed. */
export function Summary({ sessionId }: { sessionId: string }) {
  const [data, setData] = useState<SummaryData | null>(null);
  const [sending, setSending] = useState(false);
  useEffect(() => {
    getSummary(sessionId).then(setData);
  }, [sessionId]);
  if (!data) return <div className="setup-wrap">Getting your results…</div>;

  async function resend() {
    setSending(true);
    const email = await resendEmail(sessionId).catch(() => null);
    setData((d) => (d && email ? { ...d, email } : d));
    setSending(false);
  }
  const e = data.email;
  return (
    <div className="summary">
      <h1>Well done, {data.childName}! 🎉</h1>
      <div className="sum-list">
        {data.topics.map((t) => (
          <div key={t.name} className={`sum-row ${LOOK[t.status].cls}`}>
            <span className="sum-icon">{LOOK[t.status].icon}</span>
            <span className="sum-topic">{t.name}</span>
            <span className="sum-word">{LOOK[t.status].word}</span>
          </div>
        ))}
      </div>
      {data.next && (
        <div className="sum-next">
          <b>🚀 Next: {data.next.topic}</b>
          <span>💡 {data.next.tip}</span>
        </div>
      )}
      {data.sureTotal > 0 && (
        <p className="sum-sure">
          🎯 When you were sure, you were right <b>{data.sureRight} of {data.sureTotal}</b> times.
        </p>
      )}
      <div className="sum-email">
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
      </div>
    </div>
  );
}
