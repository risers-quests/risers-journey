import { SharingSpec } from "../types";

// One colour per person. Chosen to stay distinct for up to 8 sharers.
const COLOURS = ["#f4a261", "#2a9d8f", "#e76f51", "#8ab17d", "#9b5de5", "#00b4d8", "#f15bb5", "#c9a227"];

/** One whole object (a roti, a pizza…) drawn as a circle cut into `slices` equal slices, slice i coloured for person i. */
function CutWhole({ slices, size }: { slices: number; size: number }) {
  const r = size / 2 - 2;
  const c = size / 2;
  const paths = Array.from({ length: slices }, (_, i) => {
    const a0 = (i / slices) * 2 * Math.PI - Math.PI / 2;
    const a1 = ((i + 1) / slices) * 2 * Math.PI - Math.PI / 2;
    const large = a1 - a0 > Math.PI ? 1 : 0;
    const d = `M ${c} ${c} L ${c + r * Math.cos(a0)} ${c + r * Math.sin(a0)} A ${r} ${r} 0 ${large} 1 ${c + r * Math.cos(a1)} ${c + r * Math.sin(a1)} Z`;
    return <path key={i} d={d} fill={COLOURS[i % COLOURS.length]} stroke="#fff" strokeWidth={2} />;
  });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      {slices === 1 ? <circle cx={c} cy={c} r={r} fill={COLOURS[0]} /> : paths}
      <circle cx={c} cy={c} r={r} fill="none" stroke="#8a6d3b" strokeWidth={2} />
    </svg>
  );
}

/**
 * Concrete sharing: every object is cut into as many equal slices as there
 * are people, and each person takes one slice of every object, so each
 * share is `wholes` slices of size 1/people: wholes ÷ people = wholes/people.
 * Nothing is "left over"; that is the idea being taught.
 */
export function Sharing({ spec }: { spec: SharingSpec }) {
  const size = spec.wholes > 10 ? 46 : 58;
  const person = spec.peopleLabel.replace(/s$/, "").replace(/^children$/, "child");
  const personName = spec.peopleLabel === "children" ? "child" : person;
  return (
    <div className="sharing-wrap">
      <div className="sharing-wholes">
        {Array.from({ length: spec.wholes }, (_, i) => (
          <div className="sharing-whole" key={i}>
            <CutWhole slices={spec.people} size={size} />
            <span>{i + 1}</span>
          </div>
        ))}
      </div>
      <div className="sharing-caption">
        {spec.wholes} {spec.itemName}, each cut into {spec.people} equal slices. Each colour is one {personName}'s slices.
      </div>
      <div className="sharing-legend">
        {Array.from({ length: spec.people }, (_, i) => (
          <span key={i} className="sharing-person">
            <span className="sharing-swatch" style={{ background: COLOURS[i % COLOURS.length] }} />
            {personName} {i + 1}
          </span>
        ))}
      </div>
    </div>
  );
}
