import { useEffect, useState } from "react";
import { createSession, getSessionStatus } from "../api";
import { SessionStatus } from "../types";
import { forgetTest, rememberTest, savedTests } from "../saved";
import { STRAND_CHOICES } from "../strands";

// The 12 Risers. Their report email addresses are kept only in the email
// script (diagnostic-tool/email), never on the site; it matches by name.
const RISERS = ["Benjamin", "Chris", "Elyon", "Eva", "Gabby", "Karis", "Michael", "Owen", "Pranavi", "Shalom", "Yokesh", "Zach"];

export function Setup({ onStart }: { onStart: (status: SessionStatus) => void }) {
  const [childName, setChildName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unfinished, setUnfinished] = useState<SessionStatus[]>([]);
  // One strand per sitting by default, so a test stays well under an hour.
  const [strands, setStrands] = useState<string[]>(["Number & Algebra"]);
  const [grade, setGrade] = useState("Grade 5");
  const topicCount = STRAND_CHOICES.filter((c) => strands.includes(c.name)).reduce((n, c) => n + c.topics.length, 0);
  function toggleStrand(name: string) {
    setStrands((list) => (list.includes(name) ? list.filter((x) => x !== name) : [...list, name]));
  }

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
      const sessionId = await createSession(name, grade, grade === "Grade 4" ? ["Number & Algebra"] : strands);
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

  return (
    <div className="setup-wrap">
      <h1>Maths Diagnostic</h1>
      <p className="lede">
        Grade 5 maths questions that work through the whole book, topic by topic. It shows which topics are
        mastered, where there's a real skill gap, and where a method is memorised but not understood. A short,
        separate questionnaire at the end asks how maths feels.
      </p>
      <p className="lede" style={{ marginTop: -8 }}>
        Choose which part of the book to test. One strand per sitting keeps it short enough for a child to stay
        fresh; there are no breaks during a test.
      </p>

      {unfinished.length > 0 && (
        <div className="card setup-form" style={{ marginBottom: 16 }}>
          <label>Interrupted? (the page closed, the battery ran out) Carry on from the same question</label>
          {unfinished.map((s) => (
            <button key={s.sessionId} className="btn btn-secondary resume-btn" type="button" onClick={() => onStart(s)}>
              <span>
                <b>{s.childName}</b>
                {s.strands && s.strands.length < 4 ? ` (${s.strands.join(", ")})` : ""}
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
          <label htmlFor="childName">Who is taking the test?</label>
          <select id="childName" value={childName} onChange={(e) => setChildName(e.target.value)}>
            <option value="">Choose a Riser…</option>
            {RISERS.map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="grade">Grade</label>
          <select id="grade" value={grade} onChange={(e) => setGrade(e.target.value)}>
            <option>Grade 5</option>
            <option>Grade 4</option>
          </select>
          {grade === "Grade 4" && (
            <small className="grade-note">Grade 4 so far: Large Numbers and Operations on Large Numbers. More topics are being added.</small>
          )}
        </div>
        {grade === "Grade 5" && <fieldset className="strand-pick">
          <legend>What to test</legend>
          {STRAND_CHOICES.map((c) => (
            <label key={c.name} className={"strand-option" + (strands.includes(c.name) ? " on" : "")}>
              <input type="checkbox" checked={strands.includes(c.name)} onChange={() => toggleStrand(c.name)} />
              <span>
                <b>{c.name}</b>
                <small>
                  {c.topics.join(", ")}
                </small>
              </span>
            </label>
          ))}
          <div className="strand-total">
            {topicCount ? `${topicCount} topic${topicCount > 1 ? "s" : ""}` : "Choose at least one strand"}
          </div>
        </fieldset>}
        {error && <div style={{ color: "var(--soft-clay)", fontSize: "0.85rem" }}>{error}</div>}
        <button className="btn btn-primary" type="submit" disabled={loading || !childName.trim() || (grade === "Grade 5" && !strands.length)}>
          {loading ? "Starting…" : "Start the test"}
        </button>
      </form>

    </div>
  );
}
