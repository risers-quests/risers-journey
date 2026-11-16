import { useEffect, useMemo, useState } from "react";
import { ShareActivity as Spec, ShareInteraction } from "../types";

const COLOUR = "#f4b860";

/** One whole cut into `slices` equal pieces; pieces already handed out are shown as empty outlines. */
function Whole({ slices, given, size = 56 }: { slices: number; given: number; size?: number }) {
  const r = size / 2 - 2;
  const c = size / 2;
  if (slices === 1) {
    return (
      <svg width={size} height={size} aria-hidden="true">
        <circle cx={c} cy={c} r={r} fill={given ? "#f4f6f2" : COLOUR} stroke="#8a6d3b" strokeWidth={2} strokeDasharray={given ? "4 3" : undefined} />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} aria-hidden="true">
      {Array.from({ length: slices }, (_, i) => {
        const a0 = (i / slices) * 2 * Math.PI - Math.PI / 2;
        const a1 = ((i + 1) / slices) * 2 * Math.PI - Math.PI / 2;
        const d = `M ${c} ${c} L ${c + r * Math.cos(a0)} ${c + r * Math.sin(a0)} A ${r} ${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${c + r * Math.cos(a1)} ${c + r * Math.sin(a1)} Z`;
        return <path key={i} d={d} fill={i < given ? "#f4f6f2" : COLOUR} stroke="#8a6d3b" strokeWidth={1.5} />;
      })}
    </svg>
  );
}

/** A plate holding n pieces, each 1/slices of a whole, drawn as small wedges. */
function Plate({ n, slices }: { n: number; slices: number }) {
  const size = 22;
  const r = size / 2 - 1;
  const c = size / 2;
  const wedge = slices === 1 ? null : `M ${c} ${c} L ${c} ${c - r} A ${r} ${r} 0 ${1 / slices > 0.5 ? 1 : 0} 1 ${c + r * Math.sin((2 * Math.PI) / slices)} ${c - r * Math.cos((2 * Math.PI) / slices)} Z`;
  return (
    <div className="sa-plate-pieces">
      {Array.from({ length: n }, (_, i) => (
        <svg key={i} width={size} height={size} aria-hidden="true">
          {wedge ? <path d={wedge} fill={COLOUR} stroke="#8a6d3b" strokeWidth={1} /> : <circle cx={c} cy={c} r={r} fill={COLOUR} stroke="#8a6d3b" strokeWidth={1} />}
        </svg>
      ))}
    </div>
  );
}

function Stepper({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <div className="sa-stepper">
      <span>{label}</span>
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label={`fewer ${label}`}>−</button>
      <b>{value}</b>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={`more ${label}`}>+</button>
    </div>
  );
}

/**
 * Cut and share, hands on. The child chooses how many equal pieces to cut
 * each one into, then taps a plate to give it the next piece (tap a
 * plate's "−" to take one back). In "build" mode they first choose how
 * many things and people to use. Reports what they did after every change.
 */
export function ShareActivity({ spec, onChange }: { spec: Spec; onChange: (it: ShareInteraction) => void }) {
  const build = spec.mode === "build";
  const [wholes, setWholes] = useState(build ? 1 : spec.wholes);
  const [people, setPeople] = useState(build ? 2 : spec.people);
  const [slices, setSlices] = useState(1);
  const [plates, setPlates] = useState<number[]>(() => Array(build ? 2 : spec.people).fill(0));

  const pieces = wholes * slices;
  const dealt = plates.reduce((s, n) => s + n, 0);
  const leftover = pieces - dealt;

  // Changing the setup or the cut starts the dealing again.
  function reset(w: number, p: number, s: number) {
    setWholes(w);
    setPeople(p);
    setSlices(s);
    setPlates(Array(p).fill(0));
  }
  useEffect(() => {
    onChange({ wholes, people, slices, plates, leftover });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wholes, people, slices, plates]);

  // Pieces handed out so far, whole by whole, for drawing.
  const givenPerWhole = useMemo(() => Array.from({ length: wholes }, (_, i) => Math.max(0, Math.min(slices, dealt - i * slices))), [wholes, slices, dealt]);

  return (
    <div className="share-activity">
      {build && (
        <div className="sa-controls">
          <Stepper label={spec.itemMany} value={wholes} min={1} max={12} onChange={(w) => reset(w, people, slices)} />
          <Stepper label={spec.peopleLabel} value={people} min={1} max={12} onChange={(p) => reset(wholes, p, slices)} />
        </div>
      )}
      <div className="sa-controls">
        <Stepper label={`cut each ${spec.itemOne} into`} value={slices} min={1} max={12} onChange={(s) => reset(wholes, people, s)} />
        <span className="sa-note">{slices === 1 ? "not cut" : `${slices} equal pieces`}</span>
      </div>
      <div className="sa-wholes">
        {givenPerWhole.map((g, i) => (
          <Whole key={i} slices={slices} given={g} size={wholes > 10 ? 44 : 56} />
        ))}
      </div>
      <div className="sa-left">
        {leftover > 0 ? `${leftover} piece${leftover > 1 ? "s" : ""} left to give out` : "All given out"}
        {leftover >= people && (
          <button type="button" className="sa-deal" onClick={() => setPlates((ps) => ps.map((v) => v + 1))}>
            One to each
          </button>
        )}
      </div>
      <div className="sa-plates">
        {plates.map((n, i) => (
          <div key={i} className="sa-plate">
            <button type="button" className="sa-plate-tap" disabled={leftover === 0} onClick={() => setPlates((ps) => ps.map((v, j) => (j === i ? v + 1 : v)))}>
              <span className="sa-plate-name">
                {spec.personOne} {i + 1}
              </span>
              <Plate n={n} slices={slices} />
              <span className="sa-plate-count">{n === 0 ? "empty" : `${n} piece${n > 1 ? "s" : ""}`}</span>
            </button>
            {n > 0 && (
              <button type="button" className="sa-undo" onClick={() => setPlates((ps) => ps.map((v, j) => (j === i ? v - 1 : v)))} aria-label="take one back">
                −
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
