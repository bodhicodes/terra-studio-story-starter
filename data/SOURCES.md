# Data sources

The Ground Truth for every number in this kit. Each file in `data/` was downloaded from the source below with `npm run data:fetch` (`scripts/fetch-data.mjs`) on **12 November 2026**. Re-run the script to refresh, then update the dates here.

## co2-mauna-loa.csv
- **What:** annual mean atmospheric CO₂ at Mauna Loa Observatory, Hawaii.
- **Publisher:** NOAA Global Monitoring Laboratory (Scripps Institution of Oceanography for data before 1974).
- **File:** https://gml.noaa.gov/webdata/ccgg/trends/co2/co2_annmean_mlo.csv
- **Licence:** US government work, public domain. Cite: Lan, X., Tans, P. and K.W. Thoning, NOAA Global Monitoring Laboratory.
- **Date retrieved:** 12 Nov 2026. **Range:** 1959 to 2025. **Units:** parts per million (ppm).
- **Processing:** kept `year` and `mean` (renamed `ppm`); dropped the uncertainty column. No rounding.
- **Caveats:** the most recent year may be revised slightly as NOAA finalises its records.

## global-temperature.csv
- **What:** global mean surface temperature anomaly, land and ocean, annual.
- **Publisher:** NASA Goddard Institute for Space Studies, GISTEMP v4.
- **File:** https://data.giss.nasa.gov/gistemp/tabledata_v4/GLB.Ts+dSST.csv
- **Licence:** public domain. Cite: GISTEMP Team, GISS Surface Temperature Analysis (GISTEMP), version 4, NASA GISS.
- **Date retrieved:** 12 Nov 2026. **Range:** 1880 to 2025. **Units:** °C relative to the **1951 to 1980** average.
- **Processing:** used the published annual mean (the `J-D` column), rounded to 2 decimals; years without a complete annual mean are excluded.
- **Caveats:** anomalies are relative to 1951 to 1980, not pre-industrial; don't compare them directly with "1.5°C above pre-industrial" figures.

## co2-per-capita.csv
- **What:** CO₂ emissions per person, latest available year, for 12 countries and the World.
- **Publisher:** Our World in Data, based on the Global Carbon Budget (Global Carbon Project).
- **File:** https://raw.githubusercontent.com/owid/co2-data/master/owid-co2-data.csv
- **Licence:** CC BY 4.0. Attribute: "Our World in Data, based on the Global Carbon Budget."
- **Date retrieved:** 12 Nov 2026. **Year:** 2025 for all rows. **Units:** tonnes of CO₂ per person.
- **Processing:** kept `country`, `year`, `co2_per_capita` for the selected countries; latest year per country. No rounding.
- **Caveats:** territorial (production-based) emissions; excludes land-use change. The latest year in the Global Carbon Budget is often a preliminary estimate; check OWID before quoting it as final.

## electricity-mix.csv
- **What:** share of world electricity generation by source, 2000 to 2025.
- **Publisher:** Our World in Data, which republishes Ember (Yearly Electricity Data) and the Energy Institute Statistical Review of World Energy.
- **File:** https://raw.githubusercontent.com/owid/energy-data/master/owid-energy-data.csv (original: https://ember-energy.org/data/yearly-electricity-data/)
- **Licence:** CC BY 4.0. Attribute: "Ember and Energy Institute, via Our World in Data."
- **Date retrieved:** 12 Nov 2026. **Range:** 2000 to 2025. **Units:** % of total electricity generation.
- **Processing:** World rows only. Columns mapped from OWID: `coal_share_elec`→coal, `gas_share_elec`→gas, `oil_share_elec`→other_fossil, `nuclear_share_elec`→nuclear, `hydro_share_elec`→hydro, `wind_share_elec`→wind, `solar_share_elec`→solar, `other_renewables_share_elec` (bioenergy and other renewables)→other_renewables, `low_carbon_share_elec`→clean_share (renewables plus nuclear). No rounding. The eight source shares sum to about 100% per year.
- **Caveats:** "clean_share" includes nuclear. The latest year may be revised.
