import type { ReactNode } from "react";
import { SourceNote, type Source } from "./source-note";

export { SourceNote, type Source } from "./source-note";
export { defineSources } from "./sources";
export { ScrollSteps } from "./scroll-steps";
export { BriefCard, ChartSlot, DraftBar, Placeholder, PublishChecklist, briefCount, type Brief } from "./draft";

export function StoryShell({ children }: { children: ReactNode }) {
  return <div className="mx-auto flex w-full max-w-6xl flex-col gap-24 px-6 py-16 sm:px-10 lg:gap-28 lg:py-20">{children}</div>;
}

export function Hero({ eyebrow, title, highlight, intro, meta }: { eyebrow?: string; title: string; highlight?: string; intro: string; meta?: string[] }) {
  return (
    <header className="flex flex-col gap-6">
      {eyebrow && <p className="font-mono text-sm uppercase tracking-widest text-primary">{eyebrow}</p>}
      <h1 className="max-w-5xl font-display text-5xl font-bold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
        {title} {highlight && <span className="text-primary">{highlight}</span>}
      </h1>
      <p className="max-w-2xl text-xl leading-8 text-muted-foreground">{intro}</p>
      {meta && meta.length > 0 && (
        <p className="flex flex-wrap gap-x-5 gap-y-1 border-t border-border pt-4 text-sm text-muted-foreground">
          {meta.map((m) => <span key={m}>{m}</span>)}
        </p>
      )}
    </header>
  );
}

type Layout = "text" | "text-chart" | "chart-text" | "full";

/**
 * One idea per section.
 * text: a reading column. full: heading, then content across the page.
 * text-chart / chart-text: words in 5 columns, the `visual` in 7, in that order.
 */
export function Section({ id, title, chapter, children, visual, layout = "text" }: { id: string; title: string; chapter?: string; children?: ReactNode; visual?: ReactNode; layout?: Layout }) {
  const heading = (
    <div className="flex flex-col gap-3">
      {chapter && <span className="font-mono text-sm text-muted-foreground">{chapter}</span>}
      <h2 className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">{title}</h2>
    </div>
  );
  const body = <div className="flex min-w-0 flex-col gap-5 text-lg leading-8">{children}</div>;

  if (layout === "text-chart" || layout === "chart-text") {
    const words = <div className="flex flex-col gap-5 md:col-span-5">{heading}{body}</div>;
    const pic = <div className="min-w-0 md:col-span-7">{visual}</div>;
    return (
      <section id={id} aria-label={title} className="grid scroll-mt-8 items-center gap-10 md:grid-cols-12">
        {layout === "text-chart" ? <>{words}{pic}</> : <>{pic}{words}</>}
      </section>
    );
  }

  return (
    <section id={id} aria-label={title} className={`flex scroll-mt-8 flex-col gap-6 ${layout === "text" ? "max-w-3xl" : ""}`}>
      <div className="max-w-3xl">{heading}</div>
      {children && <div className="max-w-3xl">{body}</div>}
      {visual}
    </section>
  );
}

export function BigNumber({ value, label, source, cite }: { value: string; label: ReactNode; source?: Source; cite?: ReactNode }) {
  return (
    <figure className="flex flex-col gap-3 border-l-4 border-primary pl-6">
      <span className="font-display text-7xl font-bold leading-none tracking-tighter text-primary sm:text-8xl">{value}</span>
      <figcaption className="max-w-md text-lg leading-7">{label}{cite}</figcaption>
      {source && <SourceNote {...source} />}
    </figure>
  );
}

export function StatCallout({ value, label, source }: { value: string; label: string; source: Source }) {
  return (
    <div className="flex flex-col gap-3 border border-border bg-card p-6">
      <p className="font-display text-4xl font-bold text-primary">{value}</p>
      <p>{label}</p>
      <SourceNote {...source} />
    </div>
  );
}

export function PullQuote({ quote, who, role, sourceUrl }: { quote: string; who: string; role?: string; sourceUrl: string }) {
  return (
    <figure className="border-l-4 border-primary pl-6">
      <blockquote className="font-display text-2xl leading-snug sm:text-3xl">&ldquo;{quote}&rdquo;</blockquote>
      <figcaption className="mt-4 text-sm text-muted-foreground">
        {who}{role && `, ${role}`} · <a className="underline underline-offset-4" href={sourceUrl} target="_blank" rel="noopener noreferrer">Source</a>
      </figcaption>
    </figure>
  );
}

/** Until finally. The first action is the main one; any others are secondary. */
export function CallToAction({ title, body, actions }: { title: string; body: string; actions: { label: string; href: string }[] }) {
  return (
    <section aria-label={title} className="flex flex-col gap-5 border-2 border-foreground bg-card p-8 sm:p-12">
      <h2 className="font-display text-4xl font-bold leading-tight tracking-tight">{title}</h2>
      <p className="max-w-2xl text-lg leading-8">{body}</p>
      <div className="flex flex-wrap gap-3">
        {actions.map((action, i) => {
          const external = action.href.startsWith("http");
          return (
            <a
              key={action.href}
              href={action.href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className={i === 0
                ? "rounded-md bg-warm px-5 py-3 font-semibold text-foreground hover:brightness-95"
                : "rounded-md border border-border-strong bg-card px-5 py-3 font-medium hover:border-foreground"}
            >
              {action.label}{external && <span aria-hidden="true"> ↗</span>}
            </a>
          );
        })}
      </div>
    </section>
  );
}

export function Divider() {
  return <hr className="w-full border-border" />;
}

export function SyntheticLabel({ children = "Illustrative" }: { children?: string }) {
  return <span className="w-fit rounded-md bg-warm px-3 py-1 text-sm font-semibold text-foreground">{children}</span>;
}
