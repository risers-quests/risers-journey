import { useState } from "react";
import { Setup } from "./screens/Setup";
import { Assessment } from "./screens/Assessment";
import { AnxietyCheck } from "./screens/AnxietyCheck";
import { Report } from "./screens/Report";
import { SessionStatus } from "./types";
import { forgetTest } from "./saved";

type Screen = "setup" | "assessment" | "anxietyCheck" | "report" | "break";

export function App() {
  const [screen, setScreen] = useState<Screen>("setup");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [childName, setChildName] = useState("");

  // Start or continue a test from wherever it is up to.
  function open(status: SessionStatus) {
    setSessionId(status.sessionId);
    setChildName(status.childName);
    setScreen(
      status.phase === "completed" ? "report" : status.phase === "anxiety_questionnaire" ? "anxietyCheck" : "assessment"
    );
  }

  return (
    <div className="app-shell">
      <header className="brand-row">
        <div className="brand-left">
          <img className="brand-logo" src="/assets/lifehub-logo.png" alt="LifeHub" />
          <div className="brand-name">
            Maths Diagnostic
            <span>LifeHub Foundations</span>
          </div>
        </div>
        <a className="brand-back" href="/staff/">← Staff home</a>
      </header>

      {screen === "setup" && <Setup onStart={open} />}
      {screen === "assessment" && sessionId && (
        <Assessment
          sessionId={sessionId}
          onSkillAssessmentDone={() => setScreen("anxietyCheck")}
          onBreak={() => setScreen("break")}
        />
      )}
      {screen === "break" && sessionId && (
        <div className="setup-wrap">
          <h1>Time for a break, {childName}</h1>
          <p className="lede">Everything so far is saved. Next time, open the Maths Diagnostic and tap Continue.</p>
          <div className="card setup-form">
            <label>On a different device? Use this code</label>
            <div className="break-code">{sessionId}</div>
            <button className="btn btn-primary" onClick={() => setScreen("assessment")}>
              Carry on now
            </button>
            <button className="btn btn-secondary" onClick={() => setScreen("setup")}>
              Back to the start page
            </button>
          </div>
        </div>
      )}
      {screen === "anxietyCheck" && sessionId && (
        <AnxietyCheck
          sessionId={sessionId}
          onComplete={() => {
            forgetTest(sessionId);
            setScreen("report");
          }}
        />
      )}
      {screen === "report" && sessionId && <Report sessionId={sessionId} />}
    </div>
  );
}
