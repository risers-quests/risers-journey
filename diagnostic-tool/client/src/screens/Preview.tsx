import { useEffect, useState } from "react";
import { abstractClass } from "../promptStyle";
import { BarModel } from "../components/BarModel";
import { ConcreteObjects } from "../components/ConcreteObjects";
import { Sharing } from "../components/Sharing";
import { NumberLine } from "../components/NumberLine";
import { Grid } from "../components/Grid";
import { Shape } from "../components/Shape";
import { Activity, Representation } from "../types";
import { ShareActivity } from "../components/ShareActivity";
import { PlaceValueActivity, PlaceValueChart } from "../components/PlaceValue";
import { Bars } from "../components/Bars";
import { GroupActivity } from "../components/GroupActivity";
import { ShadeActivity } from "../components/ShadeActivity";
import { Figure } from "../components/Figure";

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
    // ?preview=<topic id>, e.g. ?preview=more-large-numbers (default: fractions-division)
    const topic = new URLSearchParams(location.search).get("preview") || "fractions-division";
    const gr = new URLSearchParams(location.search).get("grade");
    const g = gr === "4" || gr === "8" ? `?grade=${gr}` : "";
    fetch(`${BASE}/preview/${topic}${g}`).then((r) => r.json()).then(setData);
  }, []);
  if (!data) return <div>Loading…</div>;
  return (
    <div className="preview">
      <h1>Question preview: {data.topic}</h1>
      <p className="lede">
        Grade 5: <a href="?preview=more-large-numbers">Large Numbers</a> · <a href="?preview=operations-large-numbers">Operations</a> · <a href="?preview=fractions-division">Fractions and Division</a>
        <br />
        Grade 4: <a href="?preview=more-large-numbers&grade=4">Large Numbers</a> · <a href="?preview=operations-large-numbers&grade=4">Operations</a> · <a href="?preview=factors-multiples&grade=4">Factors and Multiples</a>
        <br />
        Grade 8: <a href="?preview=g8-rational-numbers&grade=8">Rational Numbers</a> · <a href="?preview=g8-exponents&grade=8">Exponents</a> · <a href="?preview=g8-squares&grade=8">Squares</a> · <a href="?preview=g8-cubes&grade=8">Cubes</a> · <a href="?preview=g8-playing-numbers&grade=8">Playing with Numbers</a> · <a href="?preview=g8-sets&grade=8">Sets</a> · <a href="?preview=g8-percent&grade=8">Percent</a> · <a href="?preview=g8-profit-loss&grade=8">Profit and Loss</a> · <a href="?preview=g8-interest&grade=8">Interest</a> · <a href="?preview=g8-variation&grade=8">Variation</a> · <a href="?preview=g8-expressions&grade=8">Expressions</a> · <a href="?preview=g8-identities&grade=8">Identities</a> · <a href="?preview=g8-factorisation&grade=8">Factorisation</a> · <a href="?preview=g8-linear-equations&grade=8">Equations</a> · <a href="?preview=g8-inequations&grade=8">Inequations</a> · <a href="?preview=g8-shapes&grade=8">Shapes</a> · <a href="?preview=g8-quadrilaterals&grade=8">Quadrilaterals</a> · <a href="?preview=g8-constructions&grade=8">Constructions</a> · <a href="?preview=g8-solids&grade=8">3-D in 2-D</a> · <a href="?preview=g8-symmetry&grade=8">Symmetry</a> · <a href="?preview=g8-circles&grade=8">Circles</a> · <a href="?preview=g8-area&grade=8">Area</a> · <a href="?preview=g8-volume&grade=8">Volume</a> · <a href="?preview=g8-data&grade=8">Data</a> · <a href="?preview=g8-probability&grade=8">Probability</a>
      </p>
      <p className="lede">One fresh question per level. Reload the page for new numbers and contexts. ✓ marks the right answer; each wrong option shows the mistake it stands for.</p>
      {data.items.map((it) => (
        <div className="card preview-item" key={it.id}>
          <div className="preview-cell">{it.cpa} · {it.bloom}</div>
          {it.cpa === "abstract" && !it.representation ? <div className={abstractClass(it.prompt)}>{it.prompt}</div> : <div className="prompt-text">{it.prompt}</div>}
          {it.representation?.kind === "bar-model" && <BarModel spec={it.representation} />}
          {it.representation?.kind === "concrete" && <ConcreteObjects spec={it.representation} />}
          {it.representation?.kind === "sharing" && <Sharing spec={it.representation} />}
          {it.representation?.kind === "number-line" && <NumberLine spec={it.representation} />}
          {it.representation?.kind === "grid" && <Grid spec={it.representation} />}
          {it.representation?.kind === "shape" && <Shape spec={it.representation} />}
          {it.representation?.kind === "figure" && <Figure spec={it.representation} />}
          {it.activity?.kind === "share" && <ShareActivity spec={it.activity} onChange={() => undefined} />}
          {it.activity?.kind === "place-value" && <PlaceValueActivity spec={it.activity} onChange={() => undefined} />}
          {it.activity?.kind === "group" && <GroupActivity spec={it.activity} onChange={() => undefined} />}
          {it.activity?.kind === "shade" && <ShadeActivity spec={it.activity} onChange={() => undefined} />}
          {it.representation?.kind === "place-value-chart" && <PlaceValueChart spec={it.representation} />}
          {it.representation?.kind === "bars" && <Bars spec={it.representation} />}
          {it.answerBy === "activity" && <p className="preview-note">Answered by doing the activity: marked from what the child actually does, not by choosing an option.</p>}
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
