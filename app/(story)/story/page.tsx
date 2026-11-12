import { BarChart, LineChart, StackedArea } from "@/components/charts";
import { BigNumber, CallToAction, Hero, ScrollSteps, Section, StoryShell, defineSources } from "@/components/story";
import { loadCo2PerCapita, loadElectricityMix, loadMaunaLoa } from "@/lib/data";

// Brief. Audience: general readers who follow energy news. Action: look up their country's electricity
// mix and ask their utility or council one question. Frame: stewardship. Messenger: public data agencies.
// Story Spine: Once upon a time (opening); Every day (electricity); One day (wind and solar pass 10%);
// Because of that (the air); Because of that (emissions differ); Until finally (reader action).

const { Cite, SourceList, source } = defineSources({
  energy: { label: "Ember and Energy Institute, via Our World in Data", url: "https://raw.githubusercontent.com/owid/energy-data/master/owid-energy-data.csv", retrieved: "12 November 2026" },
  noaa: { label: "NOAA Global Monitoring Laboratory", url: "https://gml.noaa.gov/webdata/ccgg/trends/co2/co2_annmean_mlo.csv", retrieved: "12 November 2026" },
  carbon: { label: "Our World in Data, based on the Global Carbon Budget", url: "https://raw.githubusercontent.com/owid/co2-data/master/owid-co2-data.csv", retrieved: "12 November 2026" },
});

const pct = (n: number) => `${Math.round(n * 10) / 10}%`;

export default async function StoryPage() {
  const [electricity, co2, countries] = await Promise.all([loadElectricityMix(), loadMaunaLoa(), loadCo2PerCapita()]);
  const threshold = electricity.find((row) => row.wind + row.solar > 10);
  const first = co2[0];
  const last = co2[co2.length - 1];
  const world = countries.find((row) => row.country === "World");
  const sorted = [...countries].sort((a, b) => b.tonnes_per_person - a.tonnes_per_person);
  const mixKeys = ["coal", "gas", "other_fossil", "nuclear", "hydro", "wind", "solar", "other_renewables"];

  const mixSummary = threshold ? `Annual shares of world electricity generation by source. Wind plus solar first exceeded 10% in ${threshold.year}: ${pct(threshold.wind)} wind and ${pct(threshold.solar)} solar.` : "Annual shares of world electricity generation by source.";
  const mixChart = (focus: string[], mark: boolean) => (
    <StackedArea
      key={focus.join("-")}
      compact
      data={electricity}
      xKey="year"
      yKeys={mixKeys}
      title="World electricity generation by source"
      unit="%"
      summary={mixSummary}
      source={source("energy")}
      focus={focus}
      annotation={mark && threshold ? { x: threshold.year, label: `${threshold.year} · wind + solar pass 10%` } : undefined}
    />
  );

  return (
    <StoryShell>
      <Hero
        eyebrow="A data story"
        title="The grid is changing faster than"
        highlight="the air."
        intro="Electricity is changing. The atmosphere still holds the record of the carbon dioxide we have added."
        meta={["Data retrieved 12 November 2026", "3 charts", "3 sources"]}
      />

      {threshold && (
        <Section
          id="electricity"
          chapter="01"
          title="Electricity is starting to look different."
          layout="text-chart"
          visual={<BigNumber value={pct(threshold.wind + threshold.solar)} label={`of world electricity came from wind and solar in ${threshold.year}, the first year above one tenth.`} cite={<Cite id="energy" />} />}
        >
          <p>Wind and solar have grown in the world electricity mix.<Cite id="energy" /> Clean electricity also includes nuclear power.</p>
        </Section>
      )}

      <Section id="mix" chapter="02" title="Wind and solar moved past one tenth of generation." layout="full"
        visual={
          <ScrollSteps
            label="World electricity mix, step by step"
            visuals={[mixChart(["coal", "gas"], false), mixChart(["wind", "solar"], true), mixChart(["nuclear", "hydro"], false)]}
            steps={[
              <p key="1">Coal and gas still made most of the world&apos;s electricity.</p>,
              <p key="2">{threshold ? `In ${threshold.year}, wind and solar together passed 10% for the first time: ${pct(threshold.wind)} wind and ${pct(threshold.solar)} solar.` : "Wind and solar grew every year."}<Cite id="energy" /></p>,
              <p key="3">Nuclear and hydro add to the low-carbon share.<Cite id="energy" /></p>,
            ]}
          />
        }
      />

      <Section id="air" chapter="03" title="The air has not caught up." layout="full"
        visual={<LineChart data={co2} xKey="year" yKeys={["ppm"]} title="Annual mean CO₂ at Mauna Loa" unit=" ppm" summary={`Annual mean atmospheric CO₂ measured at Mauna Loa Observatory, ${first.year} to ${last.year}.`} source={source("noaa")} />}
      >
        <p>At Mauna Loa, the annual mean carbon dioxide measurement rose from {first.ppm} ppm in {first.year} to {last.ppm} ppm in {last.year}.<Cite id="noaa" /></p>
      </Section>

      <Section id="countries" chapter="04" title="Per-person emissions still differ widely." layout="chart-text"
        visual={<BarChart data={sorted} xKey="country" yKeys={["tonnes_per_person"]} highlight="World" title={`Territorial CO₂ emissions per person, ${sorted[0]?.year ?? ""}`} unit=" t" summary={`Tonnes of territorial CO₂ per person.${world ? ` World: ${world.tonnes_per_person}.` : ""} Latest-year figures may be preliminary.`} source={source("carbon")} />}
      >
        <p>These estimates show territorial CO₂ emissions per person.<Cite id="carbon" /> The latest year may be preliminary.</p>
      </Section>

      <CallToAction
        title="Find your electricity mix."
        body="Explore the data for your country, then bring one specific question to your utility or council."
        actions={[{ label: "Explore Ember electricity data", href: "https://ember-energy.org/data/yearly-electricity-data/" }, { label: "Browse the data", href: "/data" }]}
      />

      <SourceList>
        <details className="border-t border-border pt-3">
          <summary className="min-h-11 cursor-pointer py-2 font-semibold">Methods and caveats</summary>
          <p className="leading-7 text-muted-foreground">Clean electricity includes nuclear. Per-person figures are territorial and exclude land-use change. The latest Global Carbon Budget year is often preliminary.</p>
        </details>
      </SourceList>
    </StoryShell>
  );
}
