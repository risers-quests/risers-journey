import { useState } from "react";
import { Setup } from "./screens/Setup";
import { Assessment } from "./screens/Assessment";
import { AnxietyCheck } from "./screens/AnxietyCheck";
import { Report } from "./screens/Report";
import { SessionStatus } from "./types";
import { forgetTest } from "./saved";
import { Preview } from "./screens/Preview";

type Screen = "setup" | "assessment" | "anxietyCheck" | "report";

export function App() {
  const [screen, setScreen] = useState<Screen>("setup");
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Start or continue a test from wherever it is up to.
  function open(status: SessionStatus) {
    setSessionId(status.sessionId);
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

      {screen === "setup" && (new URLSearchParams(location.search).has("preview") ? <Preview /> : <Setup onStart={open} />)}
      {screen === "assessment" && sessionId && (
        <Assessment
          sessionId={sessionId}
          onSkillAssessmentDone={() => setScreen("anxietyCheck")}
        />
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
