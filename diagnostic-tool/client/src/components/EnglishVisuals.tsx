import { Fragment, useEffect, useState } from "react";
import { OrderActivity as OrderSpec, OrderInteraction, TextSpec, WordsActivity as WordsSpec, WordsInteraction } from "../types";

/*
 * English (Grade 8): the picture is the language itself.
 *  - TextCard: sentences or a passage, with [[highlighted]] parts and ___ blanks.
 *  - WordsActivity: tap words in a sentence to mark them.
 *  - OrderActivity: tap word tiles in order to build a sentence; tap a
 *    built tile to send it back. Spare tiles are allowed to stay unused.
 */

/** One line with [[highlights]] and ___ blanks. */
function Marked({ line }: { line: string }) {
  const parts = line.split(/(\[\[.*?\]\]|_{3,})/g).filter((p) => p !== "");
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("[[") ? (
          <mark key={i} className="en-hl">{p.slice(2, -2)}</mark>
        ) : /^_{3,}$/.test(p) ? (
          <span key={i} className="en-blank" aria-label="blank">&nbsp;</span>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        )
      )}
    </>
  );
}

export function TextCard({ spec }: { spec: TextSpec }) {
  return (
    <div className="en-card">
      {spec.caption && <div className="en-caption">{spec.caption}</div>}
      {spec.lines.map((l, i) => (
        <p key={i} className="en-line">
          <Marked line={l} />
        </p>
      ))}
    </div>
  );
}

export function WordsActivity({ spec, onChange }: { spec: WordsSpec; onChange: (it: WordsInteraction, acted: boolean) => void }) {
  const [picked, setPicked] = useState<number[]>([]);
  useEffect(() => {
    onChange({ picked }, picked.length > 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [picked]);
  return (
    <div className="en-activity">
      <div className="en-words">
        {spec.tokens.map((t, i) => {
          const on = picked.includes(i);
          return (
            <button
              type="button"
              key={i}
              className={`en-word${on ? " on" : ""}`}
              aria-pressed={on}
              onClick={() => setPicked((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]))}
            >
              {t}
            </button>
          );
        })}
      </div>
      <p className="ga-hint">Tap a word to mark it; tap it again to unmark it.</p>
    </div>
  );
}

export function OrderActivity({ spec, onChange }: { spec: OrderSpec; onChange: (it: OrderInteraction, acted: boolean) => void }) {
  const [order, setOrder] = useState<number[]>([]);
  useEffect(() => {
    onChange({ order }, order.length > 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]);
  return (
    <div className="en-activity">
      <div className={`en-built${spec.glue ? " glue" : ""}`} aria-label={spec.glue ? "Your word" : "Your sentence"}>
        {order.length === 0 && <span className="en-built-empty">Tap the tiles below to build the {spec.glue ? "word" : "sentence"} here.</span>}
        {order.map((i) => (
          <button type="button" key={i} className="en-tile built" onClick={() => setOrder((o) => o.filter((x) => x !== i))}>
            {spec.tiles[i]}
          </button>
        ))}
      </div>
      <div className="en-tiles">
        {spec.tiles.map((t, i) =>
          order.includes(i) ? null : (
            <button type="button" key={i} className="en-tile" onClick={() => setOrder((o) => [...o, i])}>
              {t}
            </button>
          )
        )}
      </div>
      <p className="ga-hint">Tap a tile to add it; tap a tile in your sentence to take it back.</p>
    </div>
  );
}
