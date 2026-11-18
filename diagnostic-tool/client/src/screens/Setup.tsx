import { useEffect, useState } from "react";
import { staffSignedIn } from "../staff";
import { createSession, getSessionStatus } from "../api";
import { SessionStatus } from "../types";
import { forgetTest, rememberTest, savedTests } from "../saved";
import { ENGLISH8_TOPIC_CHOICES, GRADE7_TOPIC_CHOICES, LA7_TOPIC_CHOICES, W7_TOPIC_CHOICES, W4_TOPIC_CHOICES, GRADE3_TOPIC_CHOICES, LA4_TOPIC_CHOICES, W3_TOPIC_CHOICES, GRADE4_TOPIC_CHOICES, GRADE8_TOPIC_CHOICES, STRAND_CHOICES } from "../strands";

// The 12 Risers. Their report email addresses are kept only in the email
// script (diagnostic-tool/email), never on the site; it matches by name.
const RISERS = ["Benjamin", "Chris", "Elyon", "Eva", "Gabby", "Karis", "Michael", "Owen", "Pranavi", "Shalom", "Yokesh", "Zach"];
// Risers working from another grade's book; everyone else starts at Grade 5 (staff can still change it).
const RISER_GRADE: Record<string, string> = { Eva: "Grade 4", Elyon: "Grade 4", Gabby: "Grade 4", Karis: "Grade 7", Michael: "Grade 7", Shalom: "Grade 7", Benjamin: "Grade 8" };
// Grades tested chapter by chapter (their own book), and the chapters ready.
const CHAPTERS: Record<string, typeof GRADE4_TOPIC_CHOICES> = { "Grade 3": GRADE3_TOPIC_CHOICES, "Grade 4": GRADE4_TOPIC_CHOICES, "Grade 8": GRADE8_TOPIC_CHOICES, ...(GRADE7_TOPIC_CHOICES.length ? { "Grade 7": GRADE7_TOPIC_CHOICES } : {}) };
const gradeFor = (name: string) => RISER_GRADE[name] ?? "Grade 5";
// Language subjects, per grade: the name on the start page, the subject the
// server knows, and the topics offered. Grade 8 English is shown as two:
// Grammar (grammar, vocabulary, punctuation, spelling) and Literature.
type Choice = (typeof GRADE4_TOPIC_CHOICES)[number];
const isLit = (t: Choice) => t.id.startsWith("e8-lit-") || t.id === "e8-figures";
const LANGUAGE: Record<string, Record<string, { server: string; choices: Choice[]; note: string }>> = {
  "Grade 3": {
    Writing: { server: "Writing", choices: W3_TOPIC_CHOICES, note: "Spectrum Writing Grade 3: the parts of writing that have a right answer." },
  },
  "Grade 4": {
    "Language Arts": { server: "Language Arts", choices: LA4_TOPIC_CHOICES, note: "Spectrum Language Arts Grade 4." },
    Writing: { server: "Writing", choices: W4_TOPIC_CHOICES, note: "Spectrum Writing Grade 4: the parts of writing that have a right answer." },
  },
  "Grade 7": {
    "Language Arts": { server: "Language Arts", choices: LA7_TOPIC_CHOICES, note: "Spectrum Language Arts Grade 7." },
    ...(W7_TOPIC_CHOICES.length ? { Writing: { server: "Writing", choices: W7_TOPIC_CHOICES, note: "Spectrum Writing Grade 7: the parts of writing that have a right answer." } } : {}),
  },
  "Grade 8": {
    Grammar: { server: "English", choices: ENGLISH8_TOPIC_CHOICES.filter((t) => !isLit(t)), note: "Grammar, vocabulary, punctuation and spelling (English Rose Reader 8)." },
    Literature: { server: "English", choices: ENGLISH8_TOPIC_CHOICES.filter(isLit), note: "The reader's stories, poems and play (English Rose Reader 8)." },
  },
};
// Maths only where it is ready (Grade 5 by strand, other grades chapter by chapter).
const subjectsFor = (grade: string) => [...(grade === "Grade 5" || CHAPTERS[grade] ? ["Maths"] : []), ...Object.keys(LANGUAGE[grade] ?? {})];
const GRADES = ["Grade 3", "Grade 4", "Grade 5", "Grade 7", "Grade 8"];
// Each Riser's subjects and the grade for each (matches staff/riser-grades.js).
// A Riser on their own device sees only these, and only the ones built so far;
// staff see every grade and subject.
const G7 = { Maths: "Grade 7", "Language Arts": "Grade 7", Writing: "Grade 7" };
const G5 = { Maths: "Grade 5", "Language Arts": "Grade 6", Writing: "Grade 6" };
const G4 = { Maths: "Grade 4", "Language Arts": "Grade 4", Writing: "Grade 4" };
const RISER_SUBJECTS: Record<string, Record<string, string>> = {
  Benjamin: { Maths: "Grade 8", Grammar: "Grade 8", Literature: "Grade 8" },
  Karis: G7, Michael: G7, Shalom: G7,
  Chris: G5, Zach: G5, Yokesh: G5, Owen: G5, Pranavi: G5,
  Elyon: G4, Eva: G4,
  Gabby: { Maths: "Grade 3", "Language Arts": "Grade 4", Writing: "Grade 3" },
};
const readySubjects = (name: string) => Object.entries(RISER_SUBJECTS[name] ?? {}).filter(([s, g]) => subjectsFor(g).includes(s));

export function Setup({ onStart, signedIn }: { onStart: (status: SessionStatus) => void; signedIn?: string | null }) {
  // A Riser signed in on this device is chosen already.
  const me = RISERS.find((n) => n.toLowerCase() === (signedIn || "").toLowerCase()) ?? "";
  // ?for=<name> (from a child's reports page) chooses that Riser too.
  const forName = RISERS.find((n) => n.toLowerCase() === (new URLSearchParams(location.search).get("for") || "").toLowerCase()) ?? "";
  // A Riser on their own device: their name and grade are known, so they only choose what to check.
  const kidMode = !!me && !staffSignedIn();
  const kidReady = kidMode ? readySubjects(me) : [];
  const [subject, setSubject] = useState(kidMode ? kidReady[0]?.[0] ?? "Maths" : subjectsFor(gradeFor(me || forName))[0]);
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
  const [grade, setGrade] = useState(kidMode ? kidReady[0]?.[1] ?? gradeFor(me) : gradeFor(me || forName));
  // Grade 4 and 8: one chapter per sitting by default; tick more to test them together.
  const [g4Topics, setG4Topics] = useState<string[]>([(CHAPTERS[gradeFor(me || forName)] ?? GRADE4_TOPIC_CHOICES)[0].id]);
  const lang = LANGUAGE[grade]?.[subject];
  const english = !!lang;
  const chapters = lang ? lang.choices : CHAPTERS[grade];
  useEffect(() => {
    if (chapters) setG4Topics([chapters[0].id]);
  }, [grade, subject]);
  // A subject not offered at the new grade goes back to Maths.
  useEffect(() => {
    if (!subjectsFor(grade).includes(subject)) setSubject(subjectsFor(grade)[0]);
  }, [grade]);
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
        else if (s.phase !== "completed" && (!kidMode || s.childName === me)) open.push(s);
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
      const sessionId = await createSession(name, grade, chapters ? ["Number & Algebra"] : strands, chapters ? g4Topics : undefined, lang ? lang.server : "Maths");
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
      <h1>{kidMode ? `Skill Check, ${me}` : "Skill Check"}</h1>
      {kidMode ? (
        <p className="lede">
          Choose a subject and the topics to check. The questions get harder as you go, so finding some of them hard is
          normal: that's how we find what to learn next. A few short questions at the end ask how the subject feels.
        </p>
      ) : (
        <>
          <p className="lede">
            Questions that work through the book, topic by topic. It shows which topics are mastered, where there's a real
            skill gap, and where a method is memorised but not understood. A short, separate questionnaire at the end asks
            how the subject feels.
          </p>
          <p className="lede" style={{ marginTop: -8 }}>
            Choose what to check. One strand or topic per sitting keeps it short enough for a child to stay fresh; there are
            no breaks during a test.
          </p>
        </>
      )}

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
        {!kidMode && <div>
          <label htmlFor="childName">Who is taking the test?</label>
          <select id="childName" value={childName} onChange={(e) => setChildName(e.target.value)}>
            <option value="">Choose a Riser…</option>
            {RISERS.map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </div>}
        {!kidMode && <div>
          <label htmlFor="grade">Grade</label>
          <select id="grade" value={grade} onChange={(e) => setGrade(e.target.value)}>
            {GRADES.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
        </div>}
        <div>
          <label htmlFor="subject">Subject</label>
          <select
            id="subject"
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value);
              // A Riser's own grade for that subject.
              if (kidMode) setGrade(RISER_SUBJECTS[me][e.target.value]);
            }}
          >
            {(kidMode ? kidReady.map(([s]) => s) : subjectsFor(grade)).map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <small className="grade-note">{kidMode && !kidReady.length ? "Your Skill Checks are being made. Ask your teacher." : lang ? lang.note : "Language subjects are offered at Grades 7 and 8."}</small>

        </div>
        {chapters && (
          <fieldset className="strand-pick">
            <legend>Which topics? ({grade} {lang ? subject : "Maths"})</legend>
            {chapters.map((t) => (
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
            <small className="grade-note">More {grade} chapters are being added.</small>
          </fieldset>
        )}
        {grade === "Grade 5" && !english && <fieldset className="strand-pick">
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
        <button className="btn btn-primary" type="submit" disabled={loading || !childName.trim() || (kidMode && !kidReady.length) || (chapters ? !g4Topics.length : !strands.length)}>
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
