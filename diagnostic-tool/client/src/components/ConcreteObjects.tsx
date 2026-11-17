import { ConcreteSpec } from "../types";

export function ConcreteObjects({ spec }: { spec: ConcreteSpec }) {
  if (spec.segments?.length) {
    const segs = spec.segments;
    // A sequence of single shapes (a repeating pattern): show it left to
    // right, in order, each one numbered underneath.
    if (segs.every((s) => s.count === 1)) {
      return (
        <div className="concrete-wrap">
          <div className="picto-seq">
            {segs.map((seg, i) => (
              <div className="picto-seq-cell" key={i}>
                <span className="picto-seq-icon">{seg.icon}</span>
                <span className="picto-seq-label">{seg.label}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    // Otherwise a pictograph: one labelled row per category, so each
    // child, day or town has its own line and can be compared at a glance.
    // Icons come in groups of 5 so they are quick to count.
    return (
      <div className="concrete-wrap">
        <div className="picto">
          {segs.map((seg, i) => (
            <div className="picto-row" key={i}>
              <div className="picto-label">{seg.label}</div>
              <div className="picto-icons">
                {Array.from({ length: Math.ceil(seg.count / 5) }, (_, g) => (
                  <span className="picto-five" key={g}>
                    {seg.icon.repeat(Math.min(5, seg.count - g * 5))}
                  </span>
                ))}
              </div>
            </div>
          ))}
          {spec.key && <div className="picto-key">Key: {spec.key}</div>}
        </div>
      </div>
    );
  }

  const perGroup = Math.floor(spec.itemCount / spec.groups);
  const remainder = spec.itemCount % spec.groups;

  return (
    <div className="concrete-wrap">
      <div className="concrete-groups">
        {Array.from({ length: spec.groups }, (_, i) => (
          <div className="concrete-group" key={i}>
            {/* Every group gets the same whole-number share — a remainder is
                never assigned to one group over another, or it would visually
                contradict a prompt that says the items were shared equally. */}
            <div className="icons">{spec.icon.repeat(perGroup)}</div>
            <div className="glabel">
              {spec.groupLabel} {spec.groups > 1 ? i + 1 : ""}
            </div>
          </div>
        ))}
      </div>
      {remainder > 0 && (
        <div className="concrete-remainder">
          <div className="icons">{spec.icon.repeat(remainder)}</div>
          <div className="glabel">extra — doesn't divide evenly among them</div>
        </div>
      )}
    </div>
  );
}
