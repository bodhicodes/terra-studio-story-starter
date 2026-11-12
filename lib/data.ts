import { readFile } from "node:fs/promises";
import path from "node:path";

export type MaunaLoaRow = { year: number; ppm: number };
export type TemperatureRow = { year: number; anomaly_c: number };
export type CountryEmissionsRow = { country: string; year: number; tonnes_per_person: number };
export type ElectricityMixRow = {
  year: number;
  coal: number;
  gas: number;
  other_fossil: number;
  nuclear: number;
  hydro: number;
  wind: number;
  solar: number;
  other_renewables: number;
  clean_share: number;
};

async function rows(file: string): Promise<string[][]> {
  const text = await readFile(path.join(process.cwd(), "data", file), "utf8");
  return text.trim().split(/\r?\n/).slice(1).filter(Boolean).map((line) => line.split(","));
}

export async function loadMaunaLoa(): Promise<MaunaLoaRow[]> {
  return (await rows("co2-mauna-loa.csv")).map(([year, ppm]) => ({ year: Number(year), ppm: Number(ppm) }));
}
export async function loadGlobalTemperature(): Promise<TemperatureRow[]> {
  return (await rows("global-temperature.csv")).map(([year, anomaly_c]) => ({ year: Number(year), anomaly_c: Number(anomaly_c) }));
}
export async function loadCo2PerCapita(): Promise<CountryEmissionsRow[]> {
  return (await rows("co2-per-capita.csv")).map(([country, year, tonnes_per_person]) => ({ country, year: Number(year), tonnes_per_person: Number(tonnes_per_person) }));
}
export async function loadElectricityMix(): Promise<ElectricityMixRow[]> {
  return (await rows("electricity-mix.csv")).map(([year, coal, gas, other_fossil, nuclear, hydro, wind, solar, other_renewables, clean_share]) => ({ year: Number(year), coal: Number(coal), gas: Number(gas), other_fossil: Number(other_fossil), nuclear: Number(nuclear), hydro: Number(hydro), wind: Number(wind), solar: Number(solar), other_renewables: Number(other_renewables), clean_share: Number(clean_share) }));
}
