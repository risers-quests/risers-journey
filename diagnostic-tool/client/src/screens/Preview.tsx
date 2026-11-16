import { useEffect, useState } from "react";
import { BarModel } from "../components/BarModel";
import { ConcreteObjects } from "../components/ConcreteObjects";
import { Sharing } from "../components/Sharing";
import { NumberLine } from "../components/NumberLine";
import { Grid } from "../components/Grid";
import { Shape } from "../components/Shape";
import { Activity, Representation } from "../types";
import { ShareActivity } from "../components/ShareActivity";

interface PreviewItem {
  id: string;
  cpa: string;
  bloom: string;
  prompt: string;
  representation: Representation;
  choices: { id: string; text: string }[];
  correctChoiceId: string;
  activity?: Activity;
  answerBy?: string;
  mistakeLabels: Record<string, string | null>;
}

const BASE = import.meta.env.VITE_API_BASE_URL ?? "/api/diagnostic";

/** Staff check of generated questions: /diagnostic/?preview (Fractions and Division). Reload for new numbers. */
export function Preview() {
  const [data, setData] = useState<{ topic: string; items: PreviewItem[] } | null>(null);
  useEffect(() => {
    fetch(`${BASE}/preview/fractions-division`).then((r) => r.json()).then(setData);
  }, []);
  if (!data) return <div>Loading…</div>;
  return (
    <div className="preview">
      <h1>Question preview: {data.topic}</h1>
      <p className="lede">One fresh question per level. Reload the page for new numbers and contexts. ✓ marks the right answer; each wrong option shows the mistake it stands for.</p>
      {data.items.map((it) => (
        <div className="card preview-item" key={it.id}>
          <div className="preview-cell">{it.cpa} · {it.bloom}</div>
          {it.cpa === "abstract" && !it.representation ? <div className="prompt-abstract">{it.prompt}</div> : <div className="prompt-text">{it.prompt}</div>}
          {it.representation?.kind === "bar-model" && <BarModel spec={it.representation} />}
          {it.representation?.kind === "concrete" && <ConcreteObjects spec={it.representation} />}
          {it.representation?.kind === "sharing" && <Sharing spec={it.representation} />}
          {it.representation?.kind === "number-line" && <NumberLine spec={it.representation} />}
          {it.representation?.kind === "grid" && <Grid spec={it.representation} />}
          {it.representation?.kind === "shape" && <Shape spec={it.representation} />}
          {it.activity?.kind === "share" && <ShareActivity spec={it.activity} onChange={() => undefined} />}
          {it.answerBy === "activity" && <p className="preview-note">Answered by doing the activity: marked from what the child does (cut the leftovers? equal plates? the right fraction?).</p>}
          <ul className="preview-choices">
            {it.choices.map((c) => (
              <li key={c.id} className={c.id === it.correctChoiceId ? "right" : ""}>
                {c.id === it.correctChoiceId ? "✓ " : "✗ "}
                {c.text}
                {it.mistakeLabels[c.id] && <small> — {it.mistakeLabels[c.id]}</small>}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
