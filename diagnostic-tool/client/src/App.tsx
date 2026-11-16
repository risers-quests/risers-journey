import { useState } from "react";
import { Setup } from "./screens/Setup";
import { Assessment } from "./screens/Assessment";
import { AnxietyCheck } from "./screens/AnxietyCheck";
import { Report } from "./screens/Report";

type Screen = "setup" | "assessment" | "anxietyCheck" | "report";

export function App() {
  const [screen, setScreen] = useState<Screen>("setup");
  const [sessionId, setSessionId] = useState<string | null>(null);

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

      {screen === "setup" && (
        <Setup
          onStart={(id) => {
            setSessionId(id);
            setScreen("assessment");
          }}
        />
      )}
      {screen === "assessment" && sessionId && (
        <Assessment sessionId={sessionId} onSkillAssessmentDone={() => setScreen("anxietyCheck")} />
      )}
      {screen === "anxietyCheck" && sessionId && (
        <AnxietyCheck sessionId={sessionId} onComplete={() => setScreen("report")} />
      )}
      {screen === "report" && sessionId && <Report sessionId={sessionId} />}
    </div>
  );
}
