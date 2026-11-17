import { LOOK, ReportEntry } from "../reportTypes";
import { stageWord } from "./ReportParts";

/**
 * Download a report: as a PDF (the browser's print sheet, "Save as PDF";
 * on an iPad, Share → Save to Files) and as a spreadsheet (CSV, one row per
 * topic per test) for staff.
 */
export function Downloads({ childName, reports, fileName }: { childName: string; reports: ReportEntry[]; fileName: string }) {
  function pdf() {
    // Every topic's full grid in the PDF, and a useful file name.
    const closed = [...document.querySelectorAll<HTMLDetailsElement>("details:not([open])")];
    closed.forEach((d) => (d.open = true));
    const title = document.title;
    document.title = fileName;
    const restore = () => {
      closed.forEach((d) => (d.open = false));
      document.title = title;
      window.removeEventListener("afterprint", restore);
    };
    window.addEventListener("afterprint", restore);
    window.print();
  }

  function csv() {
    const head = ["Child", "Date", "Time", "Grade", "Topic", "Result", "Why", "With objects", "With pictures", "With numbers", "Main mistake", "Tip", "Questions right", "Questions asked"];
    const rows = reports.flatMap((r) => {
      const d = new Date(r.date);
      return r.topics.map((t) => [
        childName,
        d.toLocaleDateString("en-GB"),
        d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
        r.grade,
        t.name,
        LOOK[t.status].word,
        t.why,
        ...t.grid.map((row) => stageWord(row).word),
        t.mistakes[0]?.label ?? "",
        t.mistakes[0]?.childTip ?? "",
        String(r.right),
        String(r.questions),
      ]);
    });
    const cell = (v: string) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
    // A byte-order mark so Excel reads ₹ and other characters correctly.
    const text = "﻿" + [head, ...rows].map((r) => r.map(cell).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([text], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <div className="rp-downloads">
      <span>Download:</span>
      <button type="button" className="btn btn-secondary" onClick={pdf}>
        📄 PDF
      </button>
      <button type="button" className="btn btn-secondary" onClick={csv}>
        📊 Spreadsheet (CSV)
      </button>
    </div>
  );
}
