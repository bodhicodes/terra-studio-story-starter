import Link from "next/link";
import { CopyButton } from "@/components/kit/copy-button";

import { repositoryUrl as REPO } from "@/lib/project";
const steps = [
  { label: REPO ? "Create" : "Install", code: REPO ? `npx create-next-app@latest my-story -e ${REPO}` : "npm install" },
  { label: "Run", code: REPO ? "cd my-story && npm run dev" : "npm run dev" },
];

export default function Home() {
  return (
    <div className="flex max-w-5xl flex-col gap-16 px-6 py-12 sm:px-10 lg:px-12 lg:py-14">
      <header className="flex max-w-3xl flex-col gap-4">
        <p className="font-mono text-sm uppercase tracking-widest text-primary">Story Starter</p>
        <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight">Build a climate story site from sourced data.</h1>
        <p className="text-xl leading-8 text-muted-foreground">Sections, charts and public datasets that you put together into a scrolling story. The Claude Code setup asks about your audience before it writes, and drafts only from your data.</p>
      </header>

      <section aria-labelledby="start" className="flex flex-col gap-4">
        <h2 id="start" className="font-display text-2xl font-bold">Pick a starting point</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <Link href="/blank" className="group flex flex-col gap-3 border-2 border-foreground bg-card p-6 transition-colors hover:bg-primary-soft">
            <span className="w-fit bg-warm px-2 py-0.5 font-mono text-sm uppercase tracking-wider">Recommended</span>
            <span className="font-display text-2xl font-bold">Start from a blank canvas</span>
            <span>Six empty beats in Story Spine order, a brief to fill in first, and checks that flag anything unfinished.</span>
            <span className="mt-auto flex justify-between gap-2 pt-2"><code className="font-mono text-sm text-muted-foreground">/blank</code><span className="font-semibold text-primary group-hover:underline">Open the blank canvas →</span></span>
          </Link>
          <Link href="/story" className="group flex flex-col gap-3 border border-border-strong bg-card p-6 transition-colors hover:border-primary hover:bg-primary-soft">
            <span className="w-fit border border-border-strong px-2 py-0.5 font-mono text-sm uppercase tracking-wider">Example</span>
            <span className="font-display text-2xl font-bold">Adapt the example</span>
            <span>A finished story about electricity and the air, with four charts. Swap in your own data one section at a time.</span>
            <span className="mt-auto flex justify-between gap-2 pt-2"><code className="font-mono text-sm text-muted-foreground">/story</code><span className="font-semibold text-primary group-hover:underline">Read the example →</span></span>
          </Link>
        </div>
      </section>

      <section aria-labelledby="run" className="flex flex-col gap-4">
        <h2 id="run" className="font-display text-2xl font-bold">Running in three steps</h2>
        <ol className="flex flex-col gap-2">
          {steps.map((step, i) => (
            <li key={step.label} className="flex flex-wrap items-center gap-x-4 gap-y-3 border border-border bg-card px-4 py-3.5">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary font-semibold text-white">{i + 1}</span>
              <span className="w-24 font-semibold">{step.label}</span>
              <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap font-mono text-sm">{step.code}</code>
              <CopyButton text={step.code} />
            </li>
          ))}
          <li className="flex flex-wrap items-center gap-x-4 gap-y-3 border border-border bg-card px-4 py-3.5">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary font-semibold text-white">3</span>
            <span className="w-24 font-semibold">Publish</span>
            <span className="min-w-0 flex-1">Push to GitHub, then import the repository in Vercel.</span>
            {REPO && <a className="rounded-md bg-foreground px-3 py-1.5 text-background" href={`https://vercel.com/new/clone?repository-url=${REPO}`} target="_blank" rel="noopener noreferrer">Deploy ↗</a>}
          </li>
        </ol>
        <p className="text-muted-foreground">Needs Node 20 or later. Run these commands from your downloaded project folder.</p>
      </section>

      <section aria-labelledby="inside" className="flex flex-col gap-4">
        <h2 id="inside" className="font-display text-2xl font-bold">What&apos;s in the kit</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link href="/components" className="group flex flex-col gap-1.5 border border-border-strong bg-card p-5 hover:border-primary hover:bg-primary-soft">
            <span className="font-bold">Components</span>
            <span className="text-muted-foreground">Openings, evidence, charts, scroll steps and endings, grouped by the beat they serve.</span>
            <span className="mt-auto pt-1 font-semibold text-primary group-hover:underline">Browse →</span>
          </Link>
          <Link href="/data" className="group flex flex-col gap-1.5 border border-border-strong bg-card p-5 hover:border-primary hover:bg-primary-soft">
            <span className="font-bold">Data and sources</span>
            <span className="text-muted-foreground">Four public datasets with publisher, licence, range and caveats attached.</span>
            <span className="mt-auto pt-1 font-semibold text-primary group-hover:underline">Browse →</span>
          </Link>
          <div className="flex flex-col gap-1.5 border-t-2 border-foreground p-5">
            <span className="font-bold">CLAUDE.md</span>
            <span className="text-muted-foreground">Claude Code asks for audience, action, messenger and frame before drafting, and adds numbers only from <code className="font-mono text-sm">data/</code>.</span>
          </div>
          <div className="flex flex-col gap-1.5 border-t-2 border-foreground p-5">
            <span className="font-bold">/aislop</span>
            <span className="text-muted-foreground">Reviews copy for filler, hype, and machine-written phrasing. Included as a Claude Code skill.</span>
          </div>
        </div>
      </section>
    </div>
  );
}
