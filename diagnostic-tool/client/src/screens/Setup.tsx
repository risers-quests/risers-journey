import { useEffect, useState } from "react";
import { createSession, getSessionStatus } from "../api";
import { SessionStatus } from "../types";
import { forgetTest, rememberTest, savedTests } from "../saved";
import { GRADE4_TOPIC_CHOICES, STRAND_CHOICES } from "../strands";

// The 12 Risers. Their report email addresses are kept only in the email
// script (diagnostic-tool/email), never on the site; it matches by name.
const RISERS = ["Benjamin", "Chris", "Elyon", "Eva", "Gabby", "Karis", "Michael", "Owen", "Pranavi", "Shalom", "Yokesh", "Zach"];
// Risers working from the Grade 4 book; everyone else starts at Grade 5 (staff can still change it).
const RISER_GRADE: Record<string, string> = { Eva: "Grade 4" };
const gradeFor = (name: string) => RISER_GRADE[name] ?? "Grade 5";

export function Setup({ onStart, signedIn }: { onStart: (status: SessionStatus) => void; signedIn?: string | null }) {
  // A Riser signed in on this device is chosen already.
  const me = RISERS.find((n) => n.toLowerCase() === (signedIn || "").toLowerCase()) ?? "";
  // ?for=<name> (from a child's reports page) chooses that Riser too.
  const forName = RISERS.find((n) => n.toLowerCase() === (new URLSearchParams(location.search).get("for") || "").toLowerCase()) ?? "";
  const [childName, setChildNameRaw] = useState(me || forName);
  function setChildName(name: string) {
    setChildNameRaw(name);
    if (name) setGrade(gradeFor(name));
  }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unfinished, setUnfinished] = useState<SessionStatus[]>([]);
  // One strand per sitting by default, so a test stays well under an hour.
  const [strands, setStrands] = useState<string[]>(["Number & Algebra"]);
  const [grade, setGrade] = useState(gradeFor(me || forName));
  // Grade 4: one topic per sitting by default; tick more to test them together.
  const [g4Topics, setG4Topics] = useState<string[]>([GRADE4_TOPIC_CHOICES[0].id]);
  function toggleTopic(id: string) {
    setG4Topics((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]));
  }
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
      const sessionId = await createSession(name, grade, grade === "Grade 4" ? ["Number & Algebra"] : strands, grade === "Grade 4" ? g4Topics : undefined);
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
        Maths questions that work through the book, topic by topic. It shows which topics are
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

        </div>
        {grade === "Grade 4" && (
          <fieldset className="strand-pick">
            <legend>Which topics? (from the Grade 4 book)</legend>
            {GRADE4_TOPIC_CHOICES.map((t) => (
              <label key={t.id} className={"strand-option" + (g4Topics.includes(t.id) ? " on" : "")}>
                <input type="checkbox" checked={g4Topics.includes(t.id)} onChange={() => toggleTopic(t.id)} />
                <span>
                  <b>
                    {t.name} <span className="topic-chapter">{t.chapter}</span>
                  </b>
                  <small>{t.about}</small>
                </span>
              </label>
            ))}
            <div className="strand-total">
              {g4Topics.length ? `${g4Topics.length} topic${g4Topics.length > 1 ? "s" : ""}` : "Choose at least one topic"}
            </div>
            <small className="grade-note">More Grade 4 chapters are being added.</small>
          </fieldset>
        )}
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
        <button className="btn btn-primary" type="submit" disabled={loading || !childName.trim() || (grade === "Grade 5" ? !strands.length : !g4Topics.length)}>
          {loading ? "Starting…" : "Start the test"}
        </button>
      </form>

      <div className="card setup-form" style={{ marginTop: 16 }}>
        <label>Past reports</label>
        <div className="report-links">
          {(me ? [me] : RISERS).map((n) => (
            <a key={n} href={`?child=${n.toLowerCase()}`}>
              {me ? `See all of ${n}'s reports →` : n}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
