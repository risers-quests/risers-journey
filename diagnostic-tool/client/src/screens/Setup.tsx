import { useEffect, useState } from "react";
import { createSession, getSessionStatus } from "../api";
import { SessionStatus } from "../types";
import { forgetTest, rememberTest, savedTests } from "../saved";

export function Setup({ onStart }: { onStart: (status: SessionStatus) => void }) {
  const [childName, setChildName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unfinished, setUnfinished] = useState<SessionStatus[]>([]);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState<string | null>(null);

  // Tests started on this device that aren't finished yet.
  useEffect(() => {
    const saved = savedTests();
    Promise.all(saved.map((t) => getSessionStatus(t.id).catch(() => null))).then((list) => {
      const open: SessionStatus[] = [];
      list.forEach((s, i) => {
        if (!s) forgetTest(saved[i].id);
        else if (s.phase !== "completed") open.push(s);
      });
      setUnfinished(open);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!childName.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const name = childName.trim();
      const sessionId = await createSession(name, "Grade 5");
      rememberTest({ id: sessionId, childName: name, startedAt: new Date().toISOString() });
      const status = await getSessionStatus(sessionId);
      if (!status) throw new Error("Couldn't start the test");
      onStart(status);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleCode(e: React.FormEvent) {
    e.preventDefault();
    const id = code.trim().toLowerCase();
    if (!id) return;
    setCodeError(null);
    const status = await getSessionStatus(id).catch(() => null);
    if (!status) {
      setCodeError("No test with that code. Check it and try again.");
      return;
    }
    rememberTest({ id, childName: status.childName, startedAt: status.startedAt });
    onStart(status);
  }

  return (
    <div className="setup-wrap">
      <h1>Maths Diagnostic</h1>
      <p className="lede">
        Grade 5 maths questions that work through the whole book, topic by topic. It shows which topics are
        mastered, where there's a real skill gap, and where a method is memorised but not understood. A short,
        separate questionnaire at the end asks how maths feels.
      </p>
      <p className="lede" style={{ marginTop: -8 }}>
        It can take an hour or more. Stop whenever you need a break: every answer is saved, and the test carries
        on from the same question.
      </p>

      {unfinished.length > 0 && (
        <div className="card setup-form" style={{ marginBottom: 16 }}>
          <label>Carry on with a test</label>
          {unfinished.map((s) => (
            <button key={s.sessionId} className="btn btn-secondary resume-btn" type="button" onClick={() => onStart(s)}>
              <span>
                <b>{s.childName}</b>
                {s.phase === "anxiety_questionnaire"
                  ? " · last few questions"
                  : s.topicNumber > 0
                    ? ` · topic ${s.topicNumber} of ${s.topicCount}`
                    : " · just started"}
              </span>
              <span>Continue →</span>
            </button>
          ))}
        </div>
      )}

      <form className="setup-form card" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="childName">Child's first name</label>
          <input
            id="childName"
            value={childName}
            onChange={(e) => setChildName(e.target.value)}
            placeholder="e.g. Aanya"
            autoFocus={unfinished.length === 0}
          />
        </div>
        <div>
          <label htmlFor="grade">Grade</label>
          <select id="grade" defaultValue="Grade 5" disabled>
            <option>Grade 5</option>
          </select>
        </div>
        {error && <div style={{ color: "var(--soft-clay)", fontSize: "0.85rem" }}>{error}</div>}
        <button className="btn btn-primary" type="submit" disabled={loading || !childName.trim()}>
          {loading ? "Starting…" : "Start a new test"}
        </button>
      </form>

      <form className="setup-form card" style={{ marginTop: 16 }} onSubmit={handleCode}>
        <div>
          <label htmlFor="code">Started on another device? Enter its code</label>
          <input id="code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. 3jwmtyaclv3m" autoCapitalize="none" autoCorrect="off" spellCheck={false} />
        </div>
        {codeError && <div style={{ color: "var(--soft-clay)", fontSize: "0.85rem" }}>{codeError}</div>}
        <button className="btn btn-secondary" type="submit" disabled={!code.trim()}>
          Continue that test
        </button>
      </form>
    </div>
  );
}
