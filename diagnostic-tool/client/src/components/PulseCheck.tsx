// "How sure are you?" after every answer. Read together with right/wrong:
// sure + wrong is a firm misconception, right + guessing is fragile. It
// measures confidence, not anxiety (that's the separate questionnaire).
export const CONFIDENCE_OPTIONS: { value: string; emoji: string; label: string }[] = [
  { value: "sure", emoji: "\u{1F600}", label: "Sure" },
  { value: "think", emoji: "\u{1F642}", label: "I think so" },
  { value: "guess", emoji: "\u{1F914}", label: "Guessing" },
];

export function PulseCheck({ value, onChange }: { value: string | null; onChange: (v: string) => void }) {
  return (
    <div className="pulse-row">
      <span>How sure are you?</span>
      {CONFIDENCE_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={`pulse-btn ${value === opt.value ? "selected" : ""}`}
          onClick={() => onChange(opt.value)}
          aria-pressed={value === opt.value}
        >
          {opt.emoji} {opt.label}
        </button>
      ))}
    </div>
  );
}
