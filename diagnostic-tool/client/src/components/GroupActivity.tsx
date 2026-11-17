import { useEffect, useRef, useState } from "react";
import { GroupActivity as Spec, GroupInteraction } from "../types";

/**
 * Apples into baskets, hands on (Grade 4 Factors and Multiples).
 * Drag an apple from the pile into a basket (or between baskets, or back
 * to the pile). On a tablet, tapping works too: tap a basket to drop one
 * apple in from the pile; tap an apple in a basket to put it back.
 * No numbers are shown: the child sees the groups and judges them.
 */
export function GroupActivity({ spec, onChange }: { spec: Spec; onChange: (it: GroupInteraction, acted: boolean) => void }) {
  const fixed = spec.mode === "equal" ? spec.baskets ?? 2 : spec.mode === "size" ? spec.maxBaskets ?? 6 : null;
  const [count, setCount] = useState<number>(fixed ?? 2);
  const [baskets, setBaskets] = useState<number[]>(() => Array(fixed ?? 2).fill(0));
  const many = spec.basketMany ?? `${spec.basketOne}s`;
  const placed = baskets.reduce((s, n) => s + n, 0);
  const pile = spec.items - placed;

  useEffect(() => {
    onChange({ baskets }, baskets.some((n) => n > 0));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baskets]);

  function setBasketCount(k: number) {
    setCount(k);
    setBaskets(Array(k).fill(0));
  }
  /** Move one apple: from the pile (-1) or a basket, to the pile (-1) or a basket. */
  function move(from: number, to: number) {
    if (from === to) return;
    setBaskets((bs) => {
      const next = [...bs];
      if (from >= 0) {
        if (next[from] <= 0) return bs;
        next[from] -= 1;
      } else if (spec.items - bs.reduce((s, n) => s + n, 0) <= 0) return bs;
      if (to >= 0) next[to] += 1;
      return next;
    });
  }

  // ---- dragging (mouse, pen and touch alike) ----
  // Tracked on the window, so a drop always ends the drag even if the
  // apple being dragged leaves the pile while the finger is down.
  const [drag, setDrag] = useState<{ from: number; x: number; y: number } | null>(null);
  const start = useRef<{ x: number; y: number } | null>(null);
  function onPointerDown(e: React.PointerEvent, from: number) {
    e.preventDefault();
    start.current = { x: e.clientX, y: e.clientY };
    setDrag({ from, x: e.clientX, y: e.clientY });
  }
  const dragFrom = drag?.from;
  useEffect(() => {
    if (dragFrom === undefined) return;
    const moveTo = (e: PointerEvent) => setDrag((d) => (d ? { ...d, x: e.clientX, y: e.clientY } : d));
    const drop = (e: PointerEvent) => {
      const moved = start.current ? Math.hypot(e.clientX - start.current.x, e.clientY - start.current.y) : 0;
      if (moved < 8) {
        // A tap: an apple in a basket goes back to the pile.
        if (dragFrom >= 0) move(dragFrom, -1);
      } else {
        const target = document.elementsFromPoint(e.clientX, e.clientY).find((el) => (el as HTMLElement).dataset?.drop !== undefined) as HTMLElement | undefined;
        if (target) move(dragFrom, Number(target.dataset.drop));
      }
      setDrag(null);
    };
    const cancel = () => setDrag(null);
    window.addEventListener("pointermove", moveTo);
    window.addEventListener("pointerup", drop);
    window.addEventListener("pointercancel", cancel);
    return () => {
      window.removeEventListener("pointermove", moveTo);
      window.removeEventListener("pointerup", drop);
      window.removeEventListener("pointercancel", cancel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragFrom]);

  const appleProps = (from: number) => ({
    className: "ga-apple",
    role: "button" as const,
    "aria-label": from < 0 ? `${spec.itemMany} in the pile` : `${spec.itemMany} in ${spec.basketOne} ${from + 1}: tap to put back`,
    onPointerDown: (e: React.PointerEvent) => onPointerDown(e, from),
  });

  return (
    <div className="group-activity">
      {spec.mode === "find" && (
        <div className="sa-controls">
          <div className="sa-stepper">
            <span>{many}</span>
            <button type="button" onClick={() => setBasketCount(Math.max(1, count - 1))} disabled={count <= 1} aria-label={`fewer ${many}`}>
              −
            </button>
            <b>{count}</b>
            <button type="button" onClick={() => setBasketCount(Math.min(spec.maxBaskets ?? 12, count + 1))} disabled={count >= (spec.maxBaskets ?? 12)} aria-label={`more ${many}`}>
              +
            </button>
          </div>
          <span className="sa-note">Changing the {many} puts the {spec.itemMany} back in the pile.</span>
        </div>
      )}

      <div className="ga-pile" data-drop="-1">
        <div className="ga-label">Pile</div>
        <div className="ga-items" data-drop="-1">
          {Array.from({ length: pile }, (_, i) => (
            <span key={i} {...appleProps(-1)}>
              {spec.icon}
            </span>
          ))}
          {pile === 0 && <span className="ga-empty">All {spec.itemMany} are in {many}</span>}
        </div>
      </div>

      <p className="ga-hint">Drag {spec.itemMany} into the {many}, or tap a {spec.basketOne} to drop one in. Tap {/^[aeiou]/i.test(spec.itemMany) ? "an" : "a"} {spec.itemMany.replace(/s$/, "")} in a {spec.basketOne} to put it back.</p>

      <div className="ga-baskets">
        {baskets.map((n, i) => (
          <div
            key={i}
            className={`ga-basket${drag && drag.from !== i ? " ga-target" : ""}`}
            data-drop={i}
            onClick={(e) => {
              // Tap on the basket itself (not on an apple inside it): drop one in from the pile.
              if ((e.target as HTMLElement).classList.contains("ga-apple")) return;
              move(-1, i);
            }}
          >
            <div className="ga-items" data-drop={i}>
              {Array.from({ length: n }, (_, j) => (
                <span key={j} {...appleProps(i)}>
                  {spec.icon}
                </span>
              ))}
            </div>
            <div className="ga-basket-art" data-drop={i} aria-hidden="true">
              {spec.basketIcon ?? "🧺"}
            </div>
          </div>
        ))}
      </div>

      {drag && (
        <span className="ga-ghost" style={{ left: drag.x, top: drag.y }} aria-hidden="true">
          {spec.icon}
        </span>
      )}
    </div>
  );
}
