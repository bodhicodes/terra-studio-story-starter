// One fixed colour per series, so the same source keeps its colour on every chart.
// Fossil sources are greys; low-carbon sources each get their own hue.
export const seriesColors: Record<string, string> = {
  coal: "#3d3d3d",
  gas: "#7a7a7a",
  other_fossil: "#ababab",
  nuclear: "#7b5ea7",
  hydro: "#2e6db4",
  wind: "#2fa4c4",
  solar: "#e5a00d",
  other_renewables: "#4e9a62",
  ppm: "#087f68",
  anomaly_c: "#c2410c",
  tonnes_per_person: "#52636a",
};

export const seriesLabels: Record<string, string> = {
  coal: "Coal",
  gas: "Gas",
  other_fossil: "Oil and other fossil",
  nuclear: "Nuclear",
  hydro: "Hydro",
  wind: "Wind",
  solar: "Solar",
  other_renewables: "Bioenergy and other renewables",
  ppm: "CO₂ (ppm)",
  anomaly_c: "Temperature anomaly (°C)",
  tonnes_per_person: "Tonnes per person",
};

// Used for any key not listed above. Eight distinct colours, so up to eight series never repeat.
const fallback = ["#087f68", "#c87500", "#4267a8", "#9b568b", "#52636a", "#b4415a", "#6b8e23", "#8a6d3b"];

export function colorFor(key: string, index: number): string {
  return seriesColors[key] ?? fallback[index % fallback.length];
}

export function labelFor(key: string): string {
  return seriesLabels[key] ?? key.replace(/_/g, " ");
}

export const highlightColor = "#087f68";
export const mutedBarColor = "#a3a3a3";
