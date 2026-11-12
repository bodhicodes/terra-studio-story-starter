import { CopyButton } from "@/components/kit/copy-button";
import { loadCo2PerCapita, loadElectricityMix, loadGlobalTemperature, loadMaunaLoa } from "@/lib/data";

type Dataset = {
  id: string;
  title: string;
  publisher: string;
  url: string;
  loader: string;
  facts: [string, string][];
  licence: string;
  caveat: string;
  spark: number[];
  color: string;
};

// Each loader runs in its own try/catch, so a missing CSV removes one card instead of breaking the page.
async function safe<T>(fn: () => Promise<T>): Promise<T | null> {
  try { return await fn(); } catch { return null; }
}

function Sparkline({ values, color }: { values: number[]; color: string }) {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const points = values.map((v, i) => `${(i / (values.length - 1)) * 300},${56 - ((v - min) / (max - min || 1)) * 52 - 2}`).join(" ");
  return (
    <svg viewBox="0 0 300 56" preserveAspectRatio="none" aria-hidden="true" className="h-14 w-full">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export default async function DataPage() {
  const [co2, temperature, countries, electricity] = await Promise.all([safe(loadMaunaLoa), safe(loadGlobalTemperature), safe(loadCo2PerCapita), safe(loadElectricityMix)]);
  const datasets: Dataset[] = [];

  if (co2?.length) datasets.push({
    id: "co2", title: "Atmospheric CO₂", publisher: "NOAA Global Monitoring Laboratory", url: "https://gml.noaa.gov/webdata/ccgg/trends/co2/co2_annmean_mlo.csv",
    loader: "const co2 = await loadMaunaLoa();",
    facts: [["Range", `${co2[0].year} to ${co2[co2.length - 1].year}`], ["Latest", `${co2[co2.length - 1].ppm} ppm`]],
    licence: "Public domain", caveat: "The most recent year may be revised slightly as NOAA finalises its records.",
    spark: co2.map((r) => r.ppm), color: "#087f68",
  });
  if (temperature?.length) datasets.push({
    id: "temperature", title: "Global temperature anomaly", publisher: "NASA GISS, GISTEMP v4", url: "https://data.giss.nasa.gov/gistemp/tabledata_v4/GLB.Ts+dSST.csv",
    loader: "const temperature = await loadGlobalTemperature();",
    facts: [["Range", `${temperature[0].year} to ${temperature[temperature.length - 1].year}`], ["Baseline", "1951 to 1980"]],
    licence: "Public domain", caveat: "The baseline isn't pre-industrial. Don't compare these values with 1.5°C figures.",
    spark: temperature.map((r) => r.anomaly_c), color: "#c2410c",
  });
  if (countries?.length) datasets.push({
    id: "countries", title: "CO₂ emissions per person", publisher: "Our World in Data, based on the Global Carbon Budget", url: "https://raw.githubusercontent.com/owid/co2-data/master/owid-co2-data.csv",
    loader: "const countries = await loadCo2PerCapita();",
    facts: [["Rows", `${countries.length}`], ["Year", `${countries[0].year}`]],
    licence: "CC BY 4.0", caveat: "Territorial emissions, excluding land use. The latest year is often preliminary.",
    spark: [...countries].sort((a, b) => b.tonnes_per_person - a.tonnes_per_person).map((r) => r.tonnes_per_person), color: "#52636a",
  });
  if (electricity?.length) datasets.push({
    id: "electricity", title: "World electricity mix", publisher: "Ember and Energy Institute, via Our World in Data", url: "https://raw.githubusercontent.com/owid/energy-data/master/owid-energy-data.csv",
    loader: "const electricity = await loadElectricityMix();",
    facts: [["Range", `${electricity[0].year} to ${electricity[electricity.length - 1].year}`], ["Clean share", `${electricity[electricity.length - 1].clean_share}%`]],
    licence: "CC BY 4.0", caveat: "The clean share includes nuclear. The latest year may be revised.",
    spark: electricity.map((r) => r.wind + r.solar), color: "#2fa4c4",
  });

  return (
    <div className="flex max-w-5xl flex-col gap-10 px-6 py-12 sm:px-10 lg:px-12 lg:py-14">
      <header className="flex flex-col gap-4">
        <p className="font-mono text-sm uppercase tracking-widest text-primary">Library</p>
        <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight">Data and sources</h1>
        <p className="max-w-2xl text-xl leading-8 text-muted-foreground">Every number in the example comes from these files. Read the caveat before you reuse a figure. Publishers, licences and processing notes are in <code className="font-mono text-base">data/SOURCES.md</code>.</p>
        <p className="flex flex-wrap gap-x-5 gap-y-1 text-muted-foreground"><span>{datasets.length} datasets</span><span>Refresh with <code className="font-mono text-sm">npm run data:fetch</code></span></p>
      </header>

      {datasets.length === 0 ? (
        <section className="flex flex-col items-start gap-3 border-2 border-dashed border-border-strong bg-card p-8">
          <h2 className="font-display text-2xl font-bold">No datasets yet</h2>
          <p className="max-w-xl">Add a CSV to <code className="font-mono text-sm">data/</code> and record where it came from in <code className="font-mono text-sm">SOURCES.md</code>. Charts can only use data listed there.</p>
          <div className="flex flex-wrap items-center gap-3 bg-surface px-3 py-2"><code className="font-mono text-sm">npm run data:fetch</code><CopyButton text="npm run data:fetch" /></div>
          <p className="text-muted-foreground">Restores the four example datasets.</p>
        </section>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {datasets.map((d) => (
            <article key={d.id} id={d.id} className="flex scroll-mt-8 flex-col gap-3 border border-border bg-card p-6">
              <div className="flex flex-col gap-0.5">
                <h2 className="text-xl font-bold">{d.title}</h2>
                <p className="text-muted-foreground">{d.publisher}</p>
              </div>
              <Sparkline values={d.spark} color={d.color} />
              <dl className="grid grid-cols-3 gap-2 text-[15px]">
                {d.facts.map(([k, v]) => <div key={k}><dt className="text-muted-foreground">{k}</dt><dd className="font-semibold">{v}</dd></div>)}
                <div><dt className="text-muted-foreground">Licence</dt><dd className="font-semibold">{d.licence}</dd></div>
              </dl>
              <p className="bg-warm-soft px-3 py-2.5 text-[15px]"><b>Caveat:</b> {d.caveat}</p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap font-mono text-sm text-muted-foreground">{d.loader}</code>
                <CopyButton text={d.loader} label="Copy loader" />
                <a className="min-h-10 rounded-md border border-border-strong px-3 py-1.5 hover:border-foreground" href={d.url} target="_blank" rel="noopener noreferrer">Source ↗</a>
              </div>
            </article>
          ))}
        </div>
      )}

      <section aria-labelledby="add" className="flex flex-col gap-3 border-2 border-dashed border-border-strong bg-card p-6">
        <h2 id="add" className="text-xl font-bold">Add your own dataset</h2>
        <ol className="flex list-decimal flex-col gap-1.5 pl-6">
          <li>Save the CSV in <code className="font-mono text-sm">data/</code>.</li>
          <li>Add publisher, licence, date retrieved and caveats to <code className="font-mono text-sm">data/SOURCES.md</code>.</li>
          <li>Add a typed loader in <code className="font-mono text-sm">lib/data.ts</code>, then a card on this page.</li>
        </ol>
        <div className="flex flex-wrap items-center justify-between gap-3 bg-surface px-4 py-3">
          <span>Or ask Claude Code: &ldquo;Add data/my-file.csv to the kit. Follow the Adding data steps in CLAUDE.md.&rdquo;</span>
          <CopyButton text="Add data/my-file.csv to the kit. Follow the Adding data steps in CLAUDE.md." label="Copy prompt" />
        </div>
      </section>
    </div>
  );
}
