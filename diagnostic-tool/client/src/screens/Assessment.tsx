import { useEffect, useRef, useState } from "react";
import { abstractClass } from "../promptStyle";
import { getNextQuestion, submitAnswer } from "../api";
import { NextQuestionResponse } from "../types";
import { BarModel } from "../components/BarModel";
import { ConcreteObjects } from "../components/ConcreteObjects";
import { NumberLine } from "../components/NumberLine";
import { Grid } from "../components/Grid";
import { Shape } from "../components/Shape";
import { CPABloomGrid } from "../components/CPABloomGrid";
import { SessionMap } from "../components/SessionMap";
import { EngineTrace } from "../components/EngineTrace";
import { PulseCheck } from "../components/PulseCheck";
import { Sharing } from "../components/Sharing";
import { ShareActivity } from "../components/ShareActivity";
import { PlaceValueActivity, PlaceValueChart } from "../components/PlaceValue";
import { Bars } from "../components/Bars";

export function Assessment({
  sessionId,
  onSkillAssessmentDone,
}: {
  sessionId: string;
  onSkillAssessmentDone: () => void;
}) {
  const [question, setQuestion] = useState<NextQuestionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  // Hidden by default — per the design doc, the CPA×Bloom grid / session map /
  // engine trace are for reviewer/QA use, not something a child should see
  // during their own session. The toggle is left in for demoing/debugging.
  const [showPanel, setShowPanel] = useState(false);

  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [answerChanges, setAnswerChanges] = useState(0);
  const [pulse, setPulse] = useState<string | null>(null);
  // What the child did in a hands-on activity, and whether they've done anything yet.
  const [interaction, setInteraction] = useState<unknown>(null);
  const [acted, setActed] = useState(false);
  const questionShownAt = useRef<number>(0);
  const firstInteractionAt = useRef<number | null>(null);

  async function loadNext() {
    setLoading(true);
    const nq = await getNextQuestion(sessionId);
    if (nq.done) {
      // The skill assessment (its own instrument) is over — the caller takes
      // it from here to the separate anxiety questionnaire.
      onSkillAssessmentDone();
      return;
    }
    setQuestion(nq);
    setSelectedChoiceId(null);
    setAnswerChanges(0);
    setPulse(null);
    setInteraction(null);
    setActed(false);
    firstInteractionAt.current = null;
    questionShownAt.current = performance.now();
    setLoading(false);
  }

  useEffect(() => {
    loadNext();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleChoiceClick(choiceId: string) {
    if (firstInteractionAt.current === null) {
      firstInteractionAt.current = performance.now();
    } else if (choiceId !== selectedChoiceId) {
      setAnswerChanges((n) => n + 1);
    }
    setSelectedChoiceId(choiceId);
  }

  async function handleContinue() {
    if (!selectedChoiceId && !byActivity) return;
    const now = performance.now();
    const hesitationBeforeStartMs = (firstInteractionAt.current ?? now) - questionShownAt.current;
    const solvingDurationMs = now - (firstInteractionAt.current ?? now);
    setLoading(true);
    await submitAnswer(sessionId, {
      choiceId: selectedChoiceId ?? "activity",
      interaction: (interaction ?? undefined) as never,
      hesitationBeforeStartMs: Math.max(0, hesitationBeforeStartMs),
      solvingDurationMs: Math.max(0, solvingDurationMs),
      answerChanges,
      pulse,
    });
    await loadNext();
  }

  if (loading && !question) {
    return <div className="app-shell">Loading…</div>;
  }
  if (!question || !question.item) return null;

  const item = question.item;
  const byActivity = item.answerBy === "activity";
  const onActivity = (it: unknown, did: boolean) => {
    if (did && firstInteractionAt.current === null) firstInteractionAt.current = performance.now();
    setInteraction(it);
    setActed(did);
  };

  return (
    <div className="assess-grid">
      <div className="card">
        <div className="top-bar">
          <span className="question-counter">
            {question.topicNumber
              ? `Topic ${question.topicNumber} of ${question.topicCount} · question ${question.questionNumber}`
              : `Warm-up · question ${question.questionNumber}`}
          </span>
          <span className="top-actions">
            {/* Staff only: add ?debug to the address to see how the engine is reasoning. */}
            {new URLSearchParams(location.search).has("debug") && (
              <button className="btn btn-ghost" onClick={() => setShowPanel((v) => !v)}>
                {showPanel ? "Hide" : "Show"} engine internals
              </button>
            )}
          </span>
        </div>

        {showPanel ? (
          <>
            <div className="breadcrumb">{question.breadcrumb}</div>
            <div className="tag-row">
              <span className="tag tag-cpa">{item.cpa}</span>
              <span className="tag tag-bloom">{item.bloom}</span>
              {question.isProceduralCheck && <span className="tag tag-badge-procedural">Side-probe</span>}
            </div>
          </>
        ) : (
          question.topicNumber ? <div className="breadcrumb">{question.topicName}</div> : null
        )}

        {item.cpa === "abstract" && !item.representation ? (
          <div className={abstractClass(item.prompt)}>{item.prompt}</div>
        ) : (
          <div className="prompt-text">{item.prompt}</div>
        )}

        {item.representation?.kind === "bar-model" && <BarModel spec={item.representation} />}
        {item.representation?.kind === "concrete" && <ConcreteObjects spec={item.representation} />}
        {item.representation?.kind === "sharing" && <Sharing spec={item.representation} />}
        {item.representation?.kind === "place-value-chart" && <PlaceValueChart spec={item.representation} />}
        {item.representation?.kind === "bars" && <Bars spec={item.representation} />}
        {item.representation?.kind === "number-line" && <NumberLine spec={item.representation} />}
        {item.representation?.kind === "grid" && <Grid spec={item.representation} />}
        {item.representation?.kind === "shape" && <Shape spec={item.representation} />}

        {item.activity?.kind === "share" && <ShareActivity key={item.id} spec={item.activity} onChange={onActivity} />}
        {item.activity?.kind === "place-value" && <PlaceValueActivity key={item.id} spec={item.activity} onChange={onActivity} />}

        {!byActivity && (
          <div className={`choices ${item.activity && !acted ? "choices-locked" : ""}`}>
            {item.activity && !acted && <div className="choices-hint">{item.activity.kind === "share" ? "Share them out first, then choose." : "Try it on the chart first, then choose."}</div>}
            {item.choices.map((choice) => (
              <button
                key={choice.id}
                className={`choice-btn ${selectedChoiceId === choice.id ? "selected" : ""}`}
                onClick={() => handleChoiceClick(choice.id)}
                disabled={!!item.activity && !acted}
              >
                {choice.text}
              </button>
            ))}
          </div>
        )}

        <div className="footer-row">
          <PulseCheck value={pulse} onChange={setPulse} />
          <button className="btn btn-primary" disabled={(byActivity ? !acted : !selectedChoiceId) || !pulse || loading} onClick={handleContinue}>
            Continue &rarr;
          </button>
        </div>
      </div>

      {showPanel && (
        <div className="card">
          <CPABloomGrid cells={question.grid ?? []} topicLabel={question.topicName ?? item.topicId} />
          <SessionMap entries={question.sessionMap ?? []} />
          <EngineTrace lines={question.engineTrace ?? []} />
        </div>
      )}
    </div>
  );
}
