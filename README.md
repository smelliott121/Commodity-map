# Commodity Map

A personal, full-screen world map that joins up live weather, delayed commodity prices, shipping, energy and market data, so you can see *why* a market might be moving, not just that it moved.

Live at **https://smelliott121.github.io/Commodity-map/** (works on phone, desktop, and as a home-screen app).

Personal use only. The free data sources it uses are licensed for personal, non-commercial use.

## What's on it

| Area | What it shows | Source |
|---|---|---|
| Commodities | 20 commodities pinned to their main growing or producing region, delayed price and day move | Yahoo Finance (delayed) |
| Weather | Rain, temperature, wind and animated wind streaks, 0–72 h forecast; per-region rain vs 15-year normal | Open-Meteo |
| Satellite | Previous day's true-colour imagery | NASA GIBS (VIIRS) |
| Shipping | Sea lanes, pipelines, ports, 12 chokepoints coloured by 7-day traffic vs normal | IMF PortWatch |
| Storms | Tropical storms with forecast cone and track | NHC, GDACS |
| Earthquakes | M4.5+ in the last week, plate boundaries, nearby mines/ports | USGS; Bird (2003) plate model |
| Markets board | 54 futures, rates, indices and FX with day/week/month moves | Yahoo Finance |
| Futures curves | Contract-month curves today vs 1 week and 1 month ago | Yahoo Finance |
| Seasonality | This year vs 5-year median path, typical next-3-month move | Yahoo Finance (11 years) |
| Positioning | Managed-money net position and 3-year percentile | CFTC Commitments of Traders |
| Refining | 3-2-1 crack spread, US utilisation, runs and stocks vs 5-year range, 17 major refineries | NYMEX via Yahoo; US EIA weekly |
| UK energy | Power price, generation mix, carbon; LNG send-out and EU gas storage | NESO, Elexon, GIE |
| ENSO | El Niño / La Niña status and typical regional effects | NOAA CPC |
| News | Headlines per market and chokepoint, breaking-news flags | Google News RSS |
| Calendar | Reports (WASDE, EIA, COT…), central banks, exchange holidays in UK time | Built in + `holidays` package |
| Brief | Daily ranked "what stands out" across all of the above | Computed on the page |

Keyboard: `/` search, `L` layers, `M` markets, `+`/`-` zoom, `Esc` close.

## How it's built

- **Static site on GitHub Pages.** `index.html` is a small shell. Code lives in `app/`:
  `app.js` (map, panels, most features), `cmd.js` (search), `brief.js` (briefing + weather risk),
  `sat.js` (satellite), `windgl.js` (GPU wind streaks), `pins.js` (pinned tiles), `health.js` (data freshness), `geo.js` (coastlines), `app.css`.
- **GitHub Actions jobs fetch the data** and publish each source to its **own branch**, so `main` only changes when code changes.
  The page reads those files from `raw.githubusercontent.com`.
- **Service worker** (`sw.js`) caches the app for instant repeat loads and offline use.
- **Alerts** go to Telegram (secrets `TELEGRAM_TOKEN`, optional `TELEGRAM_CHAT_ID`) or ntfy (`NTFY_TOPIC`).

### Data jobs

| Workflow | Branch / file | Schedule (UTC) |
|---|---|---|
| Update prices | `prices/prices.json` | every 15 min |
| Update news | `news/news.json` | every 20 min |
| Update UK energy | `uk/uk.json` | :10 and :40 hourly |
| Update storms | `storms/storms.json` | hourly |
| Update weather grid | `data/grid.json`, `data/pins.json` | every 6 h |
| Update chokepoints | `chokes/chokes.json` | 09:10, 21:10 |
| Update futures curves | `curves/curves.json` | 13:15, 21:45 weekdays |
| Update price history | `hist/history.json` | 22:35 weekdays |
| Update refining | `refining/refining.json` | Wed after the EIA release, Thu, Mon |
| Update COT positioning | `cot/cot.json` | Fri 21:00, Sat 12:00 |
| Update seasonal patterns | `seasonal/seasonal.json` | Sun, Wed 23:20 |
| Update ENSO | `enso/enso.json` | Tue, Fri 09:00 |
| Update climate normals | `climate/climate.json` | daily 04:30 |
| Update market holidays | `holidays/holidays.json` | Mon 06:15 |
| Commodity alerts | reads all of the above, saves `state/alerts_state.json` | after data jobs + :05/:35 |
| Site check | opens the site at phone and desktop size, fails on page errors | every code push |

Optional secret: `GIE_API_KEY` (free, agsi.gie.eu) for LNG and EU gas storage.

## Licence

Code: MIT (see `LICENSE`). Data belongs to its providers; see their terms.
Plate boundaries: Hugo Ahlenius / Nordpil and Peter Bird (2003), ODC-By.
