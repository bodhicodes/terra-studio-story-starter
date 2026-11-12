import type { ReactNode } from "react";
import { BarChart, LineChart, StackedArea } from "@/components/charts";
import { CopyButton } from "@/components/kit/copy-button";
import { BigNumber, CallToAction, ChartSlot, Hero, Placeholder, PullQuote, Section, SourceNote, StatCallout, SyntheticLabel, defineSources } from "@/components/story";
import { loadCo2PerCapita, loadElectricityMix, loadMaunaLoa } from "@/lib/data";

const { Cite, source } = defineSources({
  noaa: { label: "NOAA Global Monitoring Laboratory", url: "https://gml.noaa.gov/webdata/ccgg/trends/co2/co2_annmean_mlo.csv" },
  energy: { label: "Ember and Energy Institute, via Our World in Data", url: "https://raw.githubusercontent.com/owid/energy-data/master/owid-energy-data.csv" },
  carbon: { label: "Our World in Data, based on the Global Carbon Budget", url: "https://raw.githubusercontent.com/owid/co2-data/master/owid-co2-data.csv" },
});

const groups = [
  { id: "open", label: "Open" },
  { id: "evidence", label: "Evidence" },
  { id: "close", label: "Close" },
  { id: "integrity", label: "Integrity" },
  { id: "drafting", label: "Drafting" },
];

function Example({ name, job, beats, code, props, children }: { name: string; job: string; beats?: string[]; code: string; props?: string; children: ReactNode }) {
  return (
    <article id={name.toLowerCase()} className="flex scroll-mt-8 flex-col border border-border bg-card">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-5 py-4 sm:px-6">
        <div className="flex flex-col gap-1">
          <h3 className="font-mono text-lg font-semibold">{name}</h3>
          <p>{job}</p>
        </div>
        {beats && <div className="flex flex-wrap gap-1.5">{beats.map((b) => <span key={b} className="bg-primary-soft px-2 py-0.5 text-sm text-primary">{b}</span>)}</div>}
      </div>
      <div className="min-w-0 bg-background bg-[radial-gradient(var(--color-border)_1px,transparent_1px)] bg-[size:16px_16px] p-6 sm:p-8">{children}</div>
      <div className="flex flex-col gap-2 border-t border-border bg-surface px-5 py-4 sm:px-6">
        <div className="flex items-start gap-3">
          <pre className="min-w-0 flex-1 overflow-x-auto font-mono text-sm leading-6"><code>{code}</code></pre>
          <CopyButton text={code} label="Copy usage" />
        </div>
        {props && <p className="text-sm text-muted-foreground">Props: {props}</p>}
      </div>
    </article>
  );
}

function Group({ id, title, note, children }: { id: string; title: string; note?: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="flex scroll-mt-8 flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 id={`${id}-title`} className="font-display text-3xl font-bold tracking-tight">{title}</h2>
        {note && <p className="text-muted-foreground">{note}</p>}
      </div>
      {children}
    </section>
  );
}

export default async function ComponentsPage() {
  const [co2, electricity, countries] = await Promise.all([loadMaunaLoa(), loadElectricityMix(), loadCo2PerCapita()]);
  const sorted = [...countries].sort((a, b) => b.tonnes_per_person - a.tonnes_per_person);
  const last = electricity[electricity.length - 1];

  return (
    <div className="flex max-w-5xl flex-col gap-14 px-6 py-12 sm:px-10 lg:px-12 lg:py-14">
      <header className="flex flex-col gap-4">
        <p className="font-mono text-sm uppercase tracking-widest text-primary">Library</p>
        <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight">Components</h1>
        <p className="max-w-2xl text-xl leading-8 text-muted-foreground">Pick a component by the beat you&apos;re writing, then copy its usage into your page.</p>
        <nav aria-label="Groups" className="flex flex-wrap gap-2 pt-2">
          {groups.map((g) => <a key={g.id} href={`#${g.id}`} className="rounded-full border border-border-strong bg-card px-4 py-2 hover:border-foreground">{g.label}</a>)}
        </nav>
      </header>

      <Group id="open" title="Open">
        <Example name="Hero" job="Once upon a time. The headline and one line of context." beats={["Once upon a time"]} props="eyebrow?, title, highlight?, intro, meta?" code={'<Hero eyebrow="A data story" title="The grid is changing faster than"\n  highlight="the air." intro="Your opening line." meta={["3 sources"]} />'}>
          <Hero eyebrow="A data story" title="The grid is changing faster than" highlight="the air." intro="Your opening sets the scene for this audience." meta={["Data retrieved 12 November 2026", "3 sources"]} />
        </Example>
      </Group>

      <Group id="evidence" title="Evidence">
        <Example name="Section" job="One idea, with its evidence beside it. Four layouts: text, text-chart, chart-text, full." beats={["Every day", "Because of that"]} props={'id, title, chapter?, layout?: "text" | "text-chart" | "chart-text" | "full", visual?, children'} code={'<Section id="air" chapter="03" title="The air has not caught up."\n  layout="text-chart" visual={<LineChart ... />}>\n  <p>Your evidence.<Cite id="noaa" /></p>\n</Section>'}>
          <Section id="sample-section" chapter="03" title="The air has not caught up." layout="text-chart" visual={<LineChart data={co2} xKey="year" yKeys={["ppm"]} title="Annual mean CO₂ at Mauna Loa" unit=" ppm" summary="Annual atmospheric CO₂ measured at Mauna Loa." source={source("noaa")} />}>
            <p>Annual mean CO₂ at Mauna Loa rose from {co2[0].ppm} ppm in {co2[0].year} to {co2[co2.length - 1].ppm} ppm in {co2[co2.length - 1].year}.<Cite id="noaa" /></p>
          </Section>
        </Example>
        <Example name="BigNumber" job="Your hero metric, large, with its label and source." beats={["One day"]} props="value, label, source? or cite?" code={'<BigNumber value="42.6%" label="of world electricity was low-carbon in 2025."\n  cite={<Cite id="energy" />} />'}>
          <BigNumber value={`${last.clean_share}%`} label={`of world electricity was low-carbon in ${last.year}, including nuclear.`} cite={<Cite id="energy" />} />
        </Example>
        <Example name="ScrollSteps" job="A chart held in view while steps scroll past. Pass visuals to change the chart per step." beats={["Because of that"]} props="visual or visuals[], steps[], label?" code={'<ScrollSteps visual={<StackedArea ... />} steps={[\n  <p key="1">First point.</p>,\n  <p key="2">Second point.</p>,\n]} />'}>
          <div className="grid gap-4 sm:grid-cols-12">
            <div className="flex min-h-40 items-end bg-primary-soft p-3 text-sm text-muted-foreground sm:col-span-7">Chart stays in view</div>
            <ol className="flex flex-col gap-2 sm:col-span-5">
              <li className="border border-border bg-card p-3 text-muted-foreground">Step 1</li>
              <li className="border-2 border-foreground bg-card p-3">Step 2 is on screen</li>
              <li className="border border-border bg-card p-3 text-muted-foreground">Step 3</li>
            </ol>
          </div>
        </Example>
        <Example name="StatCallout" job="A sourced figure in a card, for use beside text." code={'<StatCallout value="42.61%" label="World low-carbon electricity share, 2025." source={energy} />'}>
          <StatCallout value={`${last.clean_share}%`} label={`World low-carbon electricity share, ${last.year}. Includes nuclear.`} source={source("energy")} />
        </Example>
        <Example name="LineChart" job="A change over time." code={'<LineChart data={co2} xKey="year" yKeys={["ppm"]}\n  title="Annual mean CO₂ at Mauna Loa" unit=" ppm" summary="..." source={noaa} />'} props="data, xKey, yKeys, title, unit, summary, source, annotation?">
          <LineChart data={co2} xKey="year" yKeys={["ppm"]} title="Annual mean CO₂ at Mauna Loa" unit=" ppm" summary="Annual atmospheric CO₂ concentration measured at Mauna Loa." source={source("noaa")} />
        </Example>
        <Example name="BarChart" job="Places or categories on one measure. highlight picks one bar." code={'<BarChart data={countries} xKey="country" yKeys={["tonnes_per_person"]}\n  highlight="World" title="..." unit=" t" summary="..." source={carbon} />'} props="same as LineChart, plus highlight?">
          <BarChart data={sorted} xKey="country" yKeys={["tonnes_per_person"]} highlight="World" title="CO₂ emissions per person" unit=" t" summary="Territorial CO₂ per person. Latest-year figures may be preliminary." source={source("carbon")} />
        </Example>
        <Example name="StackedArea" job="Parts of a whole over time. Each energy source keeps one colour on every chart." code={'<StackedArea data={electricity} xKey="year"\n  yKeys={["coal", "gas", "other_fossil", "nuclear", "hydro", "wind", "solar", "other_renewables"]}\n  title="World electricity mix" unit="%" summary="..." source={energy} />'}>
          <StackedArea data={electricity} xKey="year" yKeys={["coal", "gas", "other_fossil", "nuclear", "hydro", "wind", "solar", "other_renewables"]} title="World electricity mix" unit="%" summary="Shares of world electricity generation by source." source={source("energy")} />
        </Example>
        <Example name="PullQuote" job="A real, sourced quote. Never write words for a real person." code={'<PullQuote quote={verifiedQuote} who={speaker} role={role} sourceUrl={originalSource} />'}>
          <div className="flex flex-col gap-5"><SyntheticLabel>Placeholder</SyntheticLabel><PullQuote quote="A quote from a real, named person goes here." who="Named person" role="Role" sourceUrl="https://example.org" /></div>
        </Example>
      </Group>

      <Group id="close" title="Close">
        <Example name="CallToAction" job="Until finally. One action, matching the brief. The first action is the main one." beats={["Until finally"]} code={'<CallToAction title="Find your electricity mix."\n  body="Explore the data for your country."\n  actions={[{ label: "Explore the data", href: "/data" }]} />'}>
          <CallToAction title="Find your electricity mix." body="Compare the sources of electricity in your country." actions={[{ label: "Explore the data", href: "/data" }]} />
        </Example>
      </Group>

      <Group id="integrity" title="Integrity" note="They warn in dev when a source or label is missing.">
        <Example name="Cite" job="A numbered source marker. defineSources builds the Sources list from the same keys; an unknown key is a type error." code={'const { Cite, SourceList, source } = defineSources({ noaa: {...} });\n<p>CO₂ reached 427.35 ppm.<Cite id="noaa" /></p>\n<SourceList />'}>
          <p className="text-lg">CO₂ at Mauna Loa reached {co2[co2.length - 1].ppm} ppm in {co2[co2.length - 1].year}.<Cite id="noaa" /></p>
        </Example>
        <Example name="SyntheticLabel" job="Marks anything illustrative or generated." code={'<SyntheticLabel>Illustrative</SyntheticLabel>'}>
          <SyntheticLabel />
        </Example>
        <Example name="SourceNote" job="A one-line source under a chart or figure. Charts add it for you." code={'<SourceNote label="NOAA" url={sourceUrl} retrieved="12 November 2026" />'}>
          <SourceNote {...source("noaa")} retrieved="12 November 2026" />
        </Example>
      </Group>

      <Group id="drafting" title="Drafting" note="Visible only in npm run dev. In a build they render nothing and print a warning.">
        <Example name="Placeholder" job="Holds a beat's place on the blank canvas." code={'<Placeholder step={3} beat="One day" hint="The new finding." use="<BigNumber>" />'}>
          <Placeholder quiet step={3} beat="One day" hint="The new finding. Use your hero metric." use="<BigNumber>" />
        </Example>
        <Example name="ChartSlot" job="An empty chart frame that points to the data library." code={'<ChartSlot />'}>
          <ChartSlot quiet />
        </Example>
      </Group>
    </div>
  );
}
