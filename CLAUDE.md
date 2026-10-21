# Notes for Claude

Personal project for Sam (UK, Jersey). Commodity weather map on GitHub Pages. See README.md for features and the data-job table.

## Ground rules
- Personal use only; never add work/employer data, positions or signals. Never print or commit secrets (Telegram token etc.).
- All user-facing times are UK time (`Europe/London`, 24 h, labelled "UK").
- Sam mostly uses an Android phone; check phone (412×860) and desktop (1600×900) layouts.
- Commit straight to `main` (that's how the site deploys). Bump the `?v=` cache-busting number on every script/style tag in `index.html` whenever `app/` changes.

## Code layout
- `index.html`: shell only. Scripts load with `defer` in order: geo → app → windgl → cmd → brief → sat → hazards → supply → pins → health. They share globals (classic scripts), so later files call `show()`, `R`, `MK`, `PX`, `info()` etc. from `app.js`.
- `app/app.js`: everything core (map, pins/labels `layout()`, weather canvas, lanes, storms, ENSO, calendar/ticker, panels, markets board, news, UK energy, curves/seasonal, refining, quakes). Top-level `const`/`let` names must not clash across files (e.g. `SM`, `ukT` already caused bugs).
- Zoom gestures (pinch, wheel) only CSS-scale `#map` (`zg` state); the real resize, `layout()` and weather redraw run once in `zCommit()` when the gesture pauses. Don't resize the map per gesture event again.
- Weather draws into a viewport-sized sticky layer (`#wxl`) using cached geometry (`GEO`); don't make canvases map-sized again.
- `later(fn)` defers non-critical loads; `getData(branch,file)` / `rawUrls()` read data branches (fall back to local files when served locally).
- `windgl.js` replaces `anim`/`sizeP` with a WebGL trail renderer (canvas `#wpg`); falls back to the 2D `#wp` canvas if WebGL is missing or the context is lost.
- `hazards.js`: rivers/frost/fires/soil/rail. Adds its own layer switches, commodity-panel rows via `hzCrop(r)`, risk inputs via `hzFrostFor()`, brief items via `hzWatch()`, and search entries via `window.CMD_FN` / `window.CMD_ITEMS` (read by `cmd.js`).
- `supply.js`: USDA outlook (`SUP`), panel section via `supHTML/supDraw`, Supply tab `renderSup`, brief items `supWatch()`. `TGT` maps each crop + month to the market year today's weather affects; keep weather wording qualitative (direction, not a number).
- `pins.js` wraps `show`, `mkShow`, `showChoke`, `showUK`, `showRef` to add the pin button.

## Data
- Each workflow publishes one source to its own branch with a force-pushed single commit (see README). Don't commit data to `main`.
- `alerts.yml` embeds the Python alert engine; it fetches all data branches with git, then saves state to the `state` branch. When editing alert logic, keep it valid YAML and compile-check the embedded Python.

## Testing
- `tests/smoke.mjs` (Playwright) is run by `site-check.yml` on every code push. Locally: assemble site + data branches into a folder, then `node tests/smoke.mjs <folder>`.
- In tests block the service worker (`serviceWorkers: "block"`), otherwise route mocks don't apply.
