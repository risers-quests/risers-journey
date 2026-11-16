import { Insights, TopicInsight, TopicStatus } from "../engine/insights.js";

/**
 * The two report emails, as HTML built from Insights. Email apps ignore
 * page stylesheets, so everything is tables with inline styles.
 *   childEmail: for the child, encouraging and jargon-free; no anxiety result.
 *   staffEmail: for staff, detailed but visual — actions first, then a
 *               topic table, "sure but wrong" mistakes and the anxiety check.
 */

const C = {
  ink: "#1e2a33",
  soft: "#56687a",
  line: "#e3e9df",
  paper: "#f7f9f5",
  green: "#3f7718",
  brand: "#8fc63f",
};

export const STATUS: Record<TopicStatus, { icon: string; child: string; staff: string; fg: string; bg: string }> = {
  secure: { icon: "⭐", child: "Got it", staff: "Secure", fg: "#2f6b12", bg: "#eef7e2" },
  fragile: { icon: "🌱", child: "Nearly there", staff: "Fragile", fg: "#9a6a1c", bg: "#fdf3df" },
  gap: { icon: "🔧", child: "Next to learn", staff: "Needs teaching", fg: "#b2475e", bg: "#fcebee" },
  notReached: { icon: "⏸", child: "Coming later", staff: "Not reached", fg: "#4f6577", bg: "#eaf0f5" },
};

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

function shell(title: string, body: string): string {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title></head>
<body style="margin:0;padding:0;background:${C.paper};font-family:Inter,-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:${C.ink};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.paper};"><tr><td align="center" style="padding:20px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background:#ffffff;border:1px solid ${C.line};border-radius:14px;">
<tr><td style="height:6px;background:${C.brand};border-radius:14px 14px 0 0;font-size:0;line-height:0;">&nbsp;</td></tr>
${body}
<tr><td style="padding:14px 24px 20px;font-size:12px;color:${C.soft};border-top:1px solid ${C.line};">LifeHub Foundations · Maths Diagnostic</td></tr>
</table></td></tr></table></body></html>`;
}

const section = (inner: string, pad = "18px 24px") => `<tr><td style="padding:${pad};">${inner}</td></tr>`;
const h2 = (t: string) => `<div style="font-size:15px;font-weight:700;margin:0 0 10px;">${t}</div>`;
const chip = (t: string, s: TopicStatus) =>
  `<span style="display:inline-block;margin:0 6px 6px 0;padding:6px 12px;border-radius:999px;background:${STATUS[s].bg};color:${STATUS[s].fg};font-size:14px;font-weight:600;">${esc(t)}</span>`;

// ---------------------------------------------------------------- child

export function childEmail(ins: Insights): { subject: string; html: string } {
  const by = (s: TopicStatus) => ins.topics.filter((t) => t.status === s);
  const sure = ins.overall.sureRight + ins.overall.sureWrong;
  const total = sure + ins.overall.unsureRight + ins.overall.unsureWrong;
  let body = section(
    `<div style="font-size:24px;font-weight:700;margin-bottom:4px;">Hi ${esc(ins.childName)}! 🎉</div>
     <div style="font-size:15px;color:${C.soft};">Here's what your maths check on ${esc(ins.date)} showed.</div>`,
    "22px 24px 8px"
  );
  if (by("secure").length) body += section(h2("⭐ You've got these") + by("secure").map((t) => chip(t.name, "secure")).join(""));
  if (by("fragile").length) body += section(h2("🌱 Almost there: a bit more practice") + by("fragile").map((t) => chip(t.name, "fragile")).join(""));
  if (ins.nextForChild) {
    body += section(
      h2(`🚀 Next we'll learn: ${esc(ins.nextForChild.topic)}`) +
        `<div style="background:#fffaf0;border:1px solid #f0dfbf;border-radius:10px;padding:12px 14px;font-size:15px;line-height:1.5;">💡 ${esc(ins.nextForChild.tip)}</div>`
    );
  }
  if (sure > 0) {
    const pct = Math.round((ins.overall.sureRight / sure) * 100);
    body += section(
      h2("🎯 When you were sure…") +
        `<div style="font-size:15px;line-height:1.5;">you were right <b>${ins.overall.sureRight} out of ${sure}</b> times.${pct >= 80 ? " You know what you know!" : " Sometimes it's worth checking again, even when you feel sure."}</div>
         ${bar([[ins.overall.sureRight, "#8fc63f"], [ins.overall.sureWrong, "#f2a7b5"]], sure)}`
    );
  } else if (total > 0) {
    body += section(h2("🎯 Be brave!") + `<div style="font-size:15px;">You weren't sure about any answer, but you got <b>${ins.overall.unsureRight}</b> right. You know more than you think!</div>`);
  }
  body += section(`<div style="font-size:15px;">Keep going! 🌟<br><span style="color:${C.soft};">Your teachers at LifeHub</span></div>`, "8px 24px 22px");
  return { subject: `${ins.childName}, your maths check results ⭐`, html: shell("Your maths check", body) };
}

// ---------------------------------------------------------------- staff

function bar(parts: [number, string][], total: number, height = 12): string {
  const cells = parts
    .filter(([n]) => n > 0)
    .map(([n, colour]) => `<td style="width:${(n / total) * 100}%;background:${colour};height:${height}px;font-size:0;line-height:0;">&nbsp;</td>`)
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;border-radius:6px;overflow:hidden;"><tr>${cells || `<td style="background:${C.line};height:${height}px;">&nbsp;</td>`}</tr></table>`;
}

/** The CPA x Bloom grid as small squares: green cleared, rose struggled, grey not asked. */
function miniGrid(t: TopicInsight): string {
  const rows = ["C", "P", "A"]
    .map((label, ri) => {
      const cells = t.grid[ri]
        .map((v) => `<td style="width:11px;height:11px;background:${v === "cleared" ? "#8fc63f" : v === "struggled" ? "#e0798d" : "#e8ece6"};border:1px solid #fff;font-size:0;line-height:0;">&nbsp;</td>`)
        .join("");
      return `<tr><td style="font-size:9px;color:${C.soft};padding-right:3px;">${label}</td>${cells}</tr>`;
    })
    .join("");
  return `<table role="presentation" cellpadding="0" cellspacing="0">${rows}</table>`;
}

export function staffEmail(ins: Insights): { subject: string; html: string } {
  const count = (s: TopicStatus) => ins.topics.filter((t) => t.status === s).length;
  const o = ins.overall;
  const answered = o.sureRight + o.unsureRight + o.sureWrong + o.unsureWrong;

  let body = section(
    `<div style="font-size:22px;font-weight:700;">${esc(ins.childName)} · maths diagnostic</div>
     <div style="font-size:13px;color:${C.soft};margin-top:4px;">${esc(ins.date)} · ${esc(ins.strands.join(", "))} · ${ins.questionCount} questions · ${ins.durationMinutes} min</div>
     <div style="margin-top:14px;">${(["secure", "fragile", "gap", "notReached"] as TopicStatus[])
       .filter((s) => count(s))
       .map((s) => chip(`${STATUS[s].icon} ${count(s)} ${STATUS[s].staff.toLowerCase()}`, s))
       .join("")}</div>`,
    "22px 24px 6px"
  );

  // 1. Do next
  if (ins.actions.length) {
    body += section(
      h2("Do next") +
        ins.actions
          .map(
            (a, i) => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;"><tr>
              <td style="width:26px;vertical-align:top;"><div style="width:22px;height:22px;border-radius:11px;background:${C.green};color:#fff;font-size:12px;font-weight:700;text-align:center;line-height:22px;">${i + 1}</div></td>
              <td style="font-size:14px;line-height:1.45;"><b>${esc(a.topic)}</b>: ${esc(a.what)}<br><span style="color:${C.soft};">${esc(a.how)}</span></td></tr></table>`
          )
          .join("")
    );
  } else {
    body += section(h2("Do next") + `<div style="font-size:14px;">Nothing to reteach in what was tested. Move on, or test another strand.</div>`);
  }

  // 2. Topics
  const rows = ins.topics
    .map((t) => {
      const c = t.confidence;
      const right = c.sureRight + c.unsureRight;
      const m = t.mistakes[0];
      return `<tr>
        <td style="padding:8px 6px;border-top:1px solid ${C.line};font-size:13px;font-weight:600;vertical-align:top;">${esc(t.name)}<div style="font-weight:400;color:${C.soft};font-size:12px;margin-top:2px;">${esc(t.status === "notReached" && t.blockedBy.length ? `Waits for ${t.blockedBy.join(", ")}` : t.why)}</div></td>
        <td style="padding:8px 6px;border-top:1px solid ${C.line};vertical-align:top;white-space:nowrap;"><span style="font-size:12px;font-weight:700;color:${STATUS[t.status].fg};background:${STATUS[t.status].bg};padding:3px 8px;border-radius:999px;">${STATUS[t.status].icon} ${STATUS[t.status].staff}</span></td>
        <td style="padding:8px 6px;border-top:1px solid ${C.line};vertical-align:top;">${t.status === "notReached" ? "" : miniGrid(t)}</td>
        <td style="padding:8px 6px;border-top:1px solid ${C.line};font-size:12px;vertical-align:top;">${t.questions ? `${right}/${t.questions} right<br><span style="color:${C.soft};">${c.sureRight} of them sure</span>${c.sureWrong ? `<br><b style="color:#b2475e;">${c.sureWrong} sure but wrong</b>` : ""}` : ""}</td>
        <td style="padding:8px 6px;border-top:1px solid ${C.line};font-size:12px;vertical-align:top;">${m ? `${esc(m.label)} <b>${m.count}×</b>` : `<span style="color:${C.soft};">—</span>`}</td>
      </tr>`;
    })
    .join("");
  body += section(
    h2("Topics") +
      `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr style="font-size:11px;color:${C.soft};text-transform:uppercase;letter-spacing:.04em;"><td style="padding:0 6px 6px;">Topic</td><td style="padding:0 6px 6px;">Status</td><td style="padding:0 6px 6px;">Levels</td><td style="padding:0 6px 6px;">Answers</td><td style="padding:0 6px 6px;">Main mistake</td></tr>
        ${rows}</table>
       <div style="font-size:11px;color:${C.soft};margin-top:8px;">Levels: rows are Concrete (real objects), Pictorial (pictures), Abstract (numbers); columns go from Remember to Evaluate. <span style="color:#5c8f1c;">■</span> cleared <span style="color:#e0798d;">■</span> struggled <span style="color:#c8cec5;">■</span> not asked.</div>`
  );

  // 3. Sure but wrong: firm misconceptions
  const firm = ins.topics.flatMap((t) => t.mistakes.filter((m) => m.sureCount > 0).map((m) => ({ ...m, topic: t.name })));
  if (firm.length) {
    body += section(
      h2("⚠️ Sure but wrong") +
        `<div style="font-size:13px;color:${C.soft};margin-bottom:8px;">Mistakes made while the child said "Sure". These are firm beliefs, not slips; they won't fix themselves.</div>` +
        firm
          .map((m) => `<div style="font-size:13px;line-height:1.45;margin-bottom:6px;"><b>${esc(m.label)}</b> (${esc(m.topic)}, ${m.sureCount}× sure): ${esc(m.detail)}</div>`)
          .join("")
    );
  }

  // 4. Confidence overall
  if (answered) {
    body += section(
      h2("How sure, overall") +
        `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;">
          <tr><td></td><td style="padding:4px 8px;color:${C.soft};">Right</td><td style="padding:4px 8px;color:${C.soft};">Wrong</td></tr>
          <tr><td style="padding:4px 8px;color:${C.soft};">Sure</td><td style="padding:6px 8px;background:#eef7e2;font-weight:700;">${o.sureRight} <span style="font-weight:400;color:${C.soft};">secure</span></td><td style="padding:6px 8px;background:#fcebee;font-weight:700;">${o.sureWrong} <span style="font-weight:400;color:${C.soft};">misconceptions</span></td></tr>
          <tr><td style="padding:4px 8px;color:${C.soft};">Not sure</td><td style="padding:6px 8px;background:#fdf3df;font-weight:700;">${o.unsureRight} <span style="font-weight:400;color:${C.soft};">fragile / lucky</span></td><td style="padding:6px 8px;background:#f4f6f2;font-weight:700;">${o.unsureWrong} <span style="font-weight:400;color:${C.soft};">knows it's a gap</span></td></tr>
        </table>`
    );
  }

  // 5. Maths anxiety (separate questionnaire)
  const a = ins.anxiety;
  if (a.answered) {
    const lvl = { low: ["Low", "#2f6b12", "#eef7e2"], moderate: ["Moderate", "#9a6a1c", "#fdf3df"], elevated: ["Elevated", "#b2475e", "#fcebee"] }[a.level];
    const factor = (label: string, v: number) =>
      `<div style="font-size:12px;margin-top:8px;">${label} <span style="color:${C.soft};">${v}/${a.factorMax}</span></div>${bar([[v, "#e0a75e"], [a.factorMax - v, C.line]], a.factorMax, 8)}`;
    body += section(
      h2(`Maths anxiety: <span style="color:${lvl[1]};background:${lvl[2]};padding:2px 8px;border-radius:999px;font-size:13px;">${lvl[0]}</span>`) +
        factor("Worry about the maths itself", a.numericalScore) +
        factor("Worry about being tested or watched", a.situationalScore) +
        `<div style="font-size:11px;color:${C.soft};margin-top:10px;">From the 8-question self-report at the end (adapted from SEMA). The bands are our estimate, not clinical cut-offs. Read it alongside the results, not as their cause.</div>`
    );
  }

  return { subject: `Maths diagnostic: ${ins.childName}, ${ins.date}`, html: shell(`${ins.childName} · maths diagnostic`, body) };
}
