import type { Source } from "./source-note";

/**
 * Register a story's sources once, at the top of the page, then cite them by key.
 *
 *   const { Cite, SourceList, source } = defineSources({ noaa: {...}, owid: {...} });
 *   <p>CO₂ reached 427.35 ppm in 2025.<Cite id="noaa" /></p>
 *   <SourceList />
 *
 * Numbers follow the order the sources are listed. A key that isn't registered is a
 * TypeScript error, so `npm run build` stops before a claim ships without its source.
 */
export function defineSources<T extends Record<string, Source>>(sources: T) {
  const keys = Object.keys(sources);

  function Cite({ id }: { id: keyof T & string }) {
    const n = keys.indexOf(id) + 1;
    if (n === 0) {
      return (
        <sup className="ml-0.5 border border-danger bg-danger-soft px-1 text-sm text-danger" title={`No source called "${id}"`}>?</sup>
      );
    }
    return (
      <sup className="ml-0.5 font-semibold">
        <a className="text-primary no-underline" href={`#source-${id}`} aria-label={`Source ${n}: ${sources[id].label}`}>{n}</a>
      </sup>
    );
  }

  function SourceList({ title = "Sources", children }: { title?: string; children?: React.ReactNode }) {
    return (
      <section id="sources" aria-labelledby="sources-title" className="mx-auto flex w-full max-w-3xl flex-col gap-4 scroll-mt-8">
        <h2 id="sources-title" className="font-display text-2xl font-semibold">{title}</h2>
        <ol className="flex list-decimal flex-col gap-2.5 pl-6">
          {keys.map((key) => {
            const s = sources[key];
            return (
              <li key={key} id={`source-${key}`} className="scroll-mt-8 leading-7">
                {s.label}. <a className="text-primary underline underline-offset-4" href={s.url} target="_blank" rel="noopener noreferrer">Data file</a>
                {s.retrieved && `. Retrieved ${s.retrieved}.`}
              </li>
            );
          })}
        </ol>
        {children}
      </section>
    );
  }

  return { Cite, SourceList, source: (id: keyof T & string) => sources[id] };
}
