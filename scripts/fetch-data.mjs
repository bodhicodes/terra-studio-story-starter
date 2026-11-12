// Downloads each public dataset, trims it to the columns the kit uses, and writes data/*.csv.
// Run: npm run data:fetch  (needs network access). Then update the "Date retrieved" lines in data/SOURCES.md.
import { writeFile } from "node:fs/promises";

// Minimal CSV parser that handles quoted fields (some OWID country names contain commas).
function parseCsv(text) {
  const rows = [];
  let row = [], field = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field.replace(/\r$/, "")); rows.push(row); row = []; field = ""; }
    else field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows;
}

const COUNTRIES = ["World", "United States", "Canada", "China", "India", "Germany", "United Kingdom", "Japan", "Australia", "Brazil", "South Africa", "France", "Indonesia"];

const sources = [
  {
    file: "co2-mauna-loa.csv",
    url: "https://gml.noaa.gov/webdata/ccgg/trends/co2/co2_annmean_mlo.csv",
    // NOAA file: comment lines start with "#", then "year,mean,unc".
    transform: (text) => {
      const rows = text.split(/\r?\n/).filter((l) => /^\d{4},/.test(l.trim())).map((l) => l.trim().split(","));
      return ["year,ppm", ...rows.map(([year, mean]) => `${year},${mean}`)].join("\n");
    },
  },
  {
    file: "global-temperature.csv",
    url: "https://data.giss.nasa.gov/gistemp/tabledata_v4/GLB.Ts+dSST.csv",
    // GISTEMP values are already in °C (anomaly vs 1951-1980). Use the published annual mean (J-D); skip years still marked ***.
    transform: (text) => {
      const rows = parseCsv(text);
      const h = rows.findIndex((r) => r[0] === "Year");
      const jd = rows[h].indexOf("J-D");
      const out = rows.slice(h + 1).filter((r) => /^\d{4}$/.test(r[0]) && r[jd] && r[jd] !== "***").map((r) => `${r[0]},${Number(r[jd]).toFixed(2)}`);
      return ["year,anomaly_c", ...out].join("\n");
    },
  },
  {
    file: "co2-per-capita.csv",
    url: "https://raw.githubusercontent.com/owid/co2-data/master/owid-co2-data.csv",
    // Latest year with a value for each selected country (territorial emissions).
    transform: (text) => {
      const [header, ...rows] = parseCsv(text);
      const ci = header.indexOf("country"), yi = header.indexOf("year"), vi = header.indexOf("co2_per_capita");
      const latest = new Map();
      for (const r of rows) {
        if (!COUNTRIES.includes(r[ci]) || r[vi] === "" || r[vi] === undefined) continue;
        const y = Number(r[yi]);
        if (!latest.has(r[ci]) || y > latest.get(r[ci]).year) latest.set(r[ci], { year: y, value: r[vi] });
      }
      return ["country,year,tonnes_per_person", ...COUNTRIES.filter((c) => latest.has(c)).map((c) => `${c},${latest.get(c).year},${latest.get(c).value}`)].join("\n");
    },
  },
  {
    file: "electricity-mix.csv",
    url: "https://raw.githubusercontent.com/owid/energy-data/master/owid-energy-data.csv",
    // World electricity shares (%), from OWID's republication of Ember and Energy Institute data.
    transform: (text) => {
      const [header, ...rows] = parseCsv(text);
      const col = (n) => header.indexOf(n);
      const map = { coal: "coal_share_elec", gas: "gas_share_elec", other_fossil: "oil_share_elec", nuclear: "nuclear_share_elec", hydro: "hydro_share_elec", wind: "wind_share_elec", solar: "solar_share_elec", other_renewables: "other_renewables_share_elec", clean_share: "low_carbon_share_elec" };
      const keys = Object.keys(map);
      const out = rows
        .filter((r) => r[col("country")] === "World" && Number(r[col("year")]) >= 2000 && r[col("coal_share_elec")] !== "")
        .map((r) => [r[col("year")], ...keys.map((k) => r[col(map[k])])].join(","));
      return ["year," + keys.join(","), ...out].join("\n");
    },
  },
];

// Some servers (NASA GISS) close connections from clients without a User-Agent; retry once.
async function get(url) {
  const opts = { headers: { "User-Agent": "terra-story-starter/1.0 (+https://studio.terra.do)" } };
  try { return await fetch(url, opts); } catch { await new Promise((r) => setTimeout(r, 2000)); return fetch(url, opts); }
}

for (const s of sources) {
  const res = await get(s.url);
  if (!res.ok) throw new Error(`${s.file}: HTTP ${res.status}`);
  const csv = s.transform(await res.text());
  await writeFile(new URL(`../data/${s.file}`, import.meta.url), csv + "\n");
  console.log(`${s.file}: ${csv.split("\n").length - 1} rows`);
}
console.log(`Retrieved ${new Date().toISOString().slice(0, 10)}. Update the "Date retrieved" lines in data/SOURCES.md.`);
