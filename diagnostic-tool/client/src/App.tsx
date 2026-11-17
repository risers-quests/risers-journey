import { useState } from "react";
import { Setup } from "./screens/Setup";
import { Assessment } from "./screens/Assessment";
import { AnxietyCheck } from "./screens/AnxietyCheck";
import { Summary } from "./screens/Summary";
import { SessionStatus } from "./types";
import { forgetTest } from "./saved";
import { Preview } from "./screens/Preview";
import { History } from "./screens/History";

type Screen = "setup" | "assessment" | "anxietyCheck" | "report";

const params = new URLSearchParams(location.search);
// Opened from a child's report history: ?child=<name> (all their reports) or ?report=<test code> (one report).
const CHILD = params.get("child");
const REPORT = params.get("report");
// A Riser signed in on this device (the site's one sign-in), e.g. "eva".
let SIGNED_IN: string | null = null;
try {
  SIGNED_IN = localStorage.getItem("imm-l3-kid");
} catch {
  /* storage blocked */
}

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
        {CHILD || REPORT || SIGNED_IN ? (
          <a className="brand-back" href="/">← Home</a>
        ) : (
          <a className="brand-back" href="/staff/">← Staff home</a>
        )}
      </header>

      {CHILD ? (
        <History kid={CHILD} />
      ) : REPORT ? (
        <Summary sessionId={REPORT} fromHistory />
      ) : (
        screen === "setup" && (params.has("preview") ? <Preview /> : <Setup onStart={open} signedIn={SIGNED_IN} />)
      )}
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
      {screen === "report" && sessionId && <Summary sessionId={sessionId} />}
    </div>
  );
}
