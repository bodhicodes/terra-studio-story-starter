import Link from "next/link";
import type { ReactNode } from "react";

// Everything in this file shows only in `npm run dev`. In a build it renders nothing,
// and Placeholder and ChartSlot print a warning so you can see what is still unfinished.
const isDev = process.env.NODE_ENV !== "production";

export type Brief = { audience: string; action: string; frame: string; messenger: string };

const briefFields: { key: keyof Brief; label: string; prompt: string }[] = [
  { key: "audience", label: "Audience", prompt: "Who is this for?" },
  { key: "action", label: "Action", prompt: "What should they do after reading?" },
  { key: "frame", label: "Frame", prompt: "Which value frame fits them?" },
  { key: "messenger", label: "Messenger", prompt: "Who should they hear it from?" },
];

export function briefCount(brief: Brief) {
  return briefFields.filter((f) => brief[f.key].trim()).length;
}

export function DraftBar() {
  if (!isDev) return null;
  return (
    <div role="region" aria-label="Draft tools" className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 bg-foreground px-6 py-2.5 text-background sm:px-10">
      <span className="flex flex-wrap items-center gap-2.5">
        <span className="bg-warm px-2 py-0.5 font-mono text-sm uppercase tracking-wider text-foreground">Draft</span>
        <span>Only visible in <code className="font-mono text-sm">npm run dev</code></span>
      </span>
      <nav aria-label="Kit" className="flex flex-wrap gap-5">
        <Link className="underline underline-offset-4" href="/">Kit home</Link>
        <Link className="underline underline-offset-4" href="/components">Components</Link>
        <Link className="underline underline-offset-4" href="/data">Data</Link>
      </nav>
    </div>
  );
}

export function BriefCard({ brief }: { brief: Brief }) {
  if (!isDev) return null;
  const filled = briefCount(brief);
  return (
    <section aria-labelledby="brief-title" className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <p className="font-mono text-sm uppercase tracking-widest text-primary">Step 1 · The brief · {filled} of 4</p>
        <h1 id="brief-title" className="font-display text-4xl font-semibold leading-tight tracking-tight">Decide who this is for before you write.</h1>
        <p className="max-w-2xl text-muted-foreground">Fill in the <code className="font-mono text-sm">brief</code> object at the top of this page. Claude Code reads it before drafting any section.</p>
      </div>
      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        {briefFields.map((f) => {
          const value = brief[f.key].trim();
          return (
            <div key={f.key} className={`flex flex-col gap-1.5 bg-card p-4 ${value ? "border border-border" : "border-2 border-dashed border-border-strong"}`}>
              <span className="font-semibold">{f.label}</span>
              <span className={value ? "text-foreground" : "text-muted-foreground"}>{value || f.prompt}</span>
            </div>
          );
        })}
      </div>
      {filled < 4 && (
        <p className="bg-surface px-4 py-3">Stuck? Ask Claude Code: &ldquo;Help me fill in the brief. Ask me one question at a time.&rdquo;</p>
      )}
    </section>
  );
}

export function Placeholder({ beat, step, hint, use, children, quiet }: { beat: string; step: number; hint: string; use: string; children?: ReactNode; quiet?: boolean }) {
  if (!isDev) {
    if (!quiet) console.warn(`Story Starter: placeholder still on the page (beat ${step}, ${beat}). Replace it with ${use}.`);
    return null;
  }
  return (
    <section className="flex flex-wrap gap-x-6 gap-y-4 border-t border-border pt-6">
      <div className="flex flex-[1_1_200px] flex-col gap-1">
        <span className="font-mono text-sm text-primary">{step}</span>
        <span className="font-semibold">{beat}</span>
        <span className="text-muted-foreground">{hint}</span>
        <code className="font-mono text-sm text-muted-foreground">{use}</code>
      </div>
      <div className="flex flex-[999_1_480px] flex-col gap-3 border-2 border-dashed border-border-strong bg-card p-6 sm:p-7">
        <span className="w-fit bg-warm-soft px-2 py-0.5 font-mono text-sm uppercase text-foreground">Placeholder</span>
        {children ?? (
          <>
            <span className="h-5 w-1/2 bg-muted" />
            <span className="h-3 w-full bg-surface" />
            <span className="h-3 w-4/5 bg-surface" />
          </>
        )}
      </div>
    </section>
  );
}

export function ChartSlot({ hint = "Pick a dataset, then swap this for <LineChart>, <BarChart> or <StackedArea>.", quiet }: { hint?: string; quiet?: boolean }) {
  if (!isDev) {
    if (!quiet) console.warn("Story Starter: an empty ChartSlot is still on the page.");
    return null;
  }
  return (
    <div className="flex min-h-56 flex-col items-center justify-center gap-2 border border-border bg-surface bg-[linear-gradient(var(--color-border)_1px,transparent_1px)] bg-[size:100%_40px] p-6 text-center">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 19V5M4 19h16M8 15l4-4 3 3 5-6" /></svg>
      <span className="font-semibold">No data yet</span>
      <span className="max-w-sm text-muted-foreground">{hint}</span>
      <Link className="font-semibold text-primary underline underline-offset-4" href="/data">Browse datasets</Link>
    </div>
  );
}

export function PublishChecklist({ brief, placeholders }: { brief: Brief; placeholders: number }) {
  if (!isDev) return null;
  const rows: [string, string][] = [
    ["The brief is filled in", `${briefCount(brief)} of 4`],
    ["No placeholders left", placeholders ? `${placeholders} left` : "Done"],
    ["Every number has a Cite or a source note", "Unknown keys stop the build"],
    ["Anything illustrative carries a SyntheticLabel", "Check by eye"],
    ["/aislop has been run on the copy", "Check by eye"],
    ["The live URL opens in a private window", "After deploy"],
  ];
  return (
    <section id="checklist" aria-labelledby="checklist-title" className="flex flex-col gap-3 border-2 border-foreground bg-card p-7">
      <p className="font-mono text-sm uppercase tracking-widest text-primary">Step 3 · Before you publish</p>
      <h2 id="checklist-title" className="font-display text-2xl font-semibold">Publish checklist</h2>
      <ul className="flex flex-col">
        {rows.map(([item, status]) => (
          <li key={item} className="flex flex-wrap justify-between gap-2 border-b border-border py-3 last:border-b-0">
            <span>{item}</span>
            <span className="text-muted-foreground">{status}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
