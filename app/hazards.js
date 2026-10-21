/* ---- Physical hazards: river levels, frost forecasts, wildfires, soil moisture, rail corridors.
   Data: hazards branch (Update hazards job), soil in climate.json (Update climate normals), crude by rail in refining.json. ---- */
(() => {
  window.HZ = null;
  const NS = "http://www.w3.org/2000/svg";
  const sg = (v, d = 1) => { const a = Math.abs(v).toFixed(d); return (+a == 0 ? "" : v >= 0 ? "+" : "−") + a };
  const ukDay = d => new Date(d + "T12:00Z").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
  const ukDT = t => new Date(t).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Europe/London" }) + " UK";
  const pt = (lon, lat, cls, title, label, click) => {
    const e = document.createElement("div"); e.className = "mk " + cls; e.style.left = X(lon) / 3.6 + "%"; e.style.top = Y(lat) / 1.8 + "%"; e.title = title;
    if (label) { const sp = document.createElement("span"); sp.textContent = label; e.appendChild(sp) }
    e.onclick = ev => { ev.stopPropagation(); click(); e.classList.add("on") }; map.appendChild(e); return e;
  };
  const go = (lon, lat) => typeof panTo == "function" && panTo(lon, lat);

  /* ---------- layer switches (rivers and frost on; fires and rail off until asked for) ---------- */
  const LY = [["river", "River levels", 1], ["frost", "Frost watch", 1], ["fire", "Wildfires", 0], ["rail", "Rail corridors", 0]];
  const tg = document.getElementById("tg"), lg = tg && tg.querySelector(".lg");
  LY.forEach(([k, t, on]) => {
    if (!tg) return;
    const b = document.createElement("button"); b.textContent = t; b.dataset.k = k;
    if (!on) { b.classList.add("off"); map.classList.add("off-" + k) }
    b.onclick = () => { b.classList.toggle("off", map.classList.toggle("off-" + k)); if (k == "fire" && !map.classList.contains("off-fire")) drawFires(); layout() };
    lg ? tg.insertBefore(b, lg) : tg.appendChild(b);
  });

  /* ---------- rivers ---------- */
  function rvState(r) {
    const v = r.v.at(-1), L = r.lv || [];
    if (v == null) return { k: "na", t: "No data" };
    if (L[2] && v <= L[2][0]) return { k: "sev", t: L[2][1] };
    if (L[1] && v <= L[1][0]) return { k: "low", t: L[1][1] };
    if (L[0] && v <= L[0][0]) return { k: "wat", t: L[0][1] };
    return { k: "ok", t: "Normal navigation" };
  }
  const rvT = s => Date.parse(s.length == 13 ? s + ":00Z" : s);
  function showRiver(r) {
    const st = rvState(r), v = r.v.at(-1), T = r.t.map(rvT), last = T.at(-1);
    const wk = r.v[T.findIndex(t => t >= last - 7 * 864e5)], ch = wk != null ? v - wk : null;
    const fc = (r.fc || []).filter(x => rvT(x[0]) > last), fmin = fc.length ? fc.reduce((a, b) => b[1] < a[1] ? b : a) : null;
    const lo30 = Math.min(...r.v.filter(x => x != null)), fst = fmin ? rvState({ v: [fmin[1]], lv: r.lv }) : null;
    info(`<h2>${esc(r.n)}</h2>
<div class="tgrid"><div><span class="note" style="margin:0">Level now</span><b class="rv-${st.k}">${v.toFixed(r.u == "cm" ? 0 : 1)} ${r.u}</b><small>${ukDT(last)}</small></div>
<div><span class="note" style="margin:0">7-day change</span><b>${ch == null ? "—" : sg(ch, r.u == "cm" ? 0 : 1)}</b><small>${r.u}</small></div>
<div><span class="note" style="margin:0">${fmin ? "Forecast low" : "30-day low"}</span><b>${(fmin ? fmin[1] : lo30).toFixed(r.u == "cm" ? 0 : 1)}</b><small>${fmin ? ukDT(rvT(fmin[0])) : r.u}</small></div></div>
<div class="row"><span>Status</span><b class="wrap rv-${st.k}">${esc(st.t)}</b></div>${fst && fst.k != st.k && fst.k != "ok" ? `<div class="row"><span>Forecast</span><b class="wrap rv-${fst.k}">Falling to ${fmin[1].toFixed(1)} ${r.u} by ${ukDT(rvT(fmin[0])).replace(/, \d\d:\d\d UK/, "")}: ${esc(fst.t.toLowerCase())}</b></div>` : ""}
<div class="kh">Last 30 days${fc.length ? " and the official forecast" : ""}</div>
<div class="ukl"><span><i style="background:var(--s1)"></i>Observed</span>${fc.length ? '<span><i style="background:var(--s1);opacity:.5"></i>Forecast</span>' : ""}<span><i style="background:var(--dry)"></i>Low-water thresholds</span></div><div class="ukc2" id="rvc"></div>
<div class="kh">What the levels mean</div>${(r.lv || []).map(([x, t]) => `<div class="row"><span>${esc(t)}</span><b>${x} ${r.u}</b></div>`).join("")}
<div class="note">${esc(r.why)} Source: ${esc(r.src)}${r.u == "ft" ? " (gauge stage, feet)" : " (gauge level at Kaub, cm; not the water depth)"}.</div>`);
    setTimeout(() => {
      const box = $("#rvc"); if (!box) return;
      const ft = fc.map(x => rvT(x[0])), all = T.concat(ft), n = T.length;
      const obs = r.v.concat(ft.map(() => null)), fv = T.map((_, i) => i == n - 1 ? v : null).concat(fc.map(x => x[1]));
      const ser = [{ n: "Observed", c: "var(--s1)", v: obs }]; if (fc.length) ser.push({ n: "Forecast", c: "var(--s1)", v: fv, dash: 1, w: 1.6 });
      tsChart(box, { t: all, h: 150, series: ser, refs: (r.lv || []).map(([x], i) => [x, i ? "var(--dn)" : "var(--dry)"]), incl: (r.lv || []).map(([x]) => x), fmt: x => x.toFixed(r.u == "cm" ? 0 : 1) + " " + r.u, lab: ukDT });
    }, 0);
  }
  window.showRiver = showRiver;

  /* ---------- frost ---------- */
  function frSites() { return (HZ && HZ.frost || []).filter(f => f.in_season || f.lvl) }
  window.hzFrostFor = crop => {
    const L = (HZ && HZ.frost || []).filter(f => f.c == crop && f.lvl && f.in_season).sort((a, b) => b.lvl - a.lvl || a.t - b.t)[0];
    return L ? { n: L.n, lvl: L.lvl, t: L.t, dayTxt: ukDay(L.day) } : null;
  };
  function showFrost(f) {
    const tt = f.lvl ? `${f.lvl == 2 ? "Frost risk" : "Frost watch"}: ${f.t.toFixed(1)}°C on ${ukDay(f.day)}` : `No frost risk in the next ${f.days.length} days`;
    info(`<h2>${esc(f.n)}</h2>
<div class="row"><span>Crop</span><b>${esc(f.c)}${f.in_season ? "" : " (season starts next month)"}</b></div>
<div class="row"><span>Next ${f.days.length} days</span><b class="wrap ${f.lvl == 2 ? "fr2" : f.lvl ? "fr1" : ""}">${esc(tt)}</b></div>
<div class="row"><span>Coldest night forecast</span><b>${f.low != null ? f.low.toFixed(1) + "°C" : "—"}</b></div>
${f.needs_snow ? `<div class="row"><span>Snow cover</span><b class="wrap">${f.snow != null ? Math.round(f.snow) + " cm on the coldest risky night" : "Nights with ≥" + f.needs_snow + " cm snow cover are ignored (snow insulates the crop)"}</b></div>` : ""}
<div class="kh">Overnight minimum temperature</div><div class="ukl"><span><i style="background:#7cc4ff"></i>Forecast low</span><span><i style="background:var(--amb)"></i>Watch ${f.watch}°C</span><span><i style="background:var(--dn)"></i>Damage risk ${f.risk}°C</span></div><div class="ukc2" id="frc"></div>
<div class="note">${esc(f.why)} Forecast from Open-Meteo (2 m air temperature at one point in the region); frost in valleys can be a few degrees colder.</div>`);
    setTimeout(() => { const box = $("#frc"); box && tsChart(box, { t: f.days.map(d => Date.parse(d + "T12:00Z")), h: 140, series: [{ n: "Min temp", c: "#7cc4ff", v: f.tmin }], refs: [[f.watch, "var(--amb)"], [f.risk, "var(--dn)"]], fmt: x => x.toFixed(1) + "°C", lab: t => new Date(t).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" }) }) }, 0);
  }
  window.showFrost = showFrost;
  function frostList() {
    const F = (HZ && HZ.frost || []).slice().sort((a, b) => b.lvl - a.lvl || (a.low ?? 99) - (b.low ?? 99));
    info(`<h2>Frost watch</h2><div class="note" style="margin:-4px 0 8px">Crop regions in or near their frost season, next 10 days</div>
${F.length ? F.map((f, i) => `<div class="row" style="cursor:pointer" data-f="${i}"><span>${esc(f.n)}<small class="dn2">${esc(f.c)}${f.in_season ? "" : " · season starts soon"}</small></span><b class="${f.lvl == 2 ? "fr2" : f.lvl ? "fr1" : ""}">${f.lvl ? f.t.toFixed(0) + "°C " + ukDay(f.day).split(" ")[0] : "low " + (f.low != null ? f.low.toFixed(0) + "°C" : "—")}</b></div>`).join("") : '<div class="note">No crop region is in its frost season right now.</div>'}`);
    document.querySelectorAll("#panel [data-f]").forEach(el => el.onclick = () => { const f = F[+el.dataset.f]; go(f.lon, f.lat); showFrost(f) });
  }

  /* ---------- wildfires (NASA FIRMS VIIRS, last 24 h, binned to 0.5°) ---------- */
  let fireG = null;
  function drawFires() {
    if (fireG || !HZ || !HZ.fires || !HZ.fires.cells || map.classList.contains("off-fire")) return;
    const OVs = document.getElementById("ov"); if (!OVs) return;
    fireG = document.createElementNS(NS, "g"); fireG.setAttribute("class", "L-fire");
    let h = "";
    HZ.fires.cells.forEach(([la, lo, n, frp]) => { const r = Math.min(.75, .16 + Math.sqrt(n) * .06); h += `<circle cx="${(lo + 180).toFixed(2)}" cy="${(90 - la).toFixed(2)}" r="${r.toFixed(2)}" class="${frp > 2000 ? "fx2" : frp > 400 ? "fx1" : ""}"/>` });
    fireG.innerHTML = h; OVs.appendChild(fireG);
  }
  function fireNear(lat, lon, d) {
    let n = 0, frp = 0;
    (HZ && HZ.fires && HZ.fires.cells || []).forEach(c => { if (Math.abs(c[0] - lat) < d / 100 + 1 && km(lat, lon, c[0], c[1]) < d) { n += c[2]; frp += c[3] } });
    return { n, frp };
  }
  function fireList() {
    const C = (HZ && HZ.fires && HZ.fires.cells || []).slice().sort((a, b) => b[3] - a[3]).slice(0, 15);
    const near = c => { const A = typeof qAssets == "function" ? qAssets(c[0], c[1]).filter(a => a.d < 250) : []; return A.length ? A[0].n + " · " + Math.round(A[0].d) + " km" : "" };
    info(`<h2>Wildfires, last 24 hours</h2><div class="note" style="margin:-4px 0 8px">${HZ && HZ.fires ? (HZ.fires.n || 0).toLocaleString("en") + " satellite fire detections (NASA FIRMS, VIIRS)" : "Loading…"}</div>
<div class="kh">Biggest clusters by fire intensity</div>${C.map((c, i) => `<div class="row" style="cursor:pointer" data-c="${i}"><span>${c[0].toFixed(1)}°, ${c[1].toFixed(1)}°<small class="dn2">${esc(near(c)) || "No tracked asset within 250 km"}</small></span><b>${c[2]} fires</b></div>`).join("")}
<div class="note">Each dot is a half-degree square with fires detected by satellite in the last day; bigger dots mean more fires, redder means more intense. Much of it is seasonal crop and savanna burning. It matters for markets when it hits forests (lumber), plantations (palm oil, sugar cane), mines, ports or oil sands.</div>`);
    document.querySelectorAll("#panel [data-c]").forEach(el => el.onclick = () => { const c = C[+el.dataset.c]; layerOn("fire"); drawFires(); go(c[1], c[0]) });
  }

  /* ---------- soil moisture (in climate.json, attached to R as r.soil) ---------- */
  const soilTxt = s => `${sg(s.pct, 0)}% vs normal${s.rank == 0 ? " · driest in " + (s.n + 1) + " yrs" : s.rank == s.n ? " · wettest in " + (s.n + 1) + " yrs" : ""}`;
  function soilList() {
    const L = R.map((r, i) => ({ r, i })).filter(x => x.r.soil).sort((a, b) => a.r.soil.pct - b.r.soil.pct);
    info(`<h2>Soil moisture</h2><div class="note" style="margin:-4px 0 8px">Root-zone soil water (7–28 cm) over the last week vs the same time of year in the last 10 years</div>
${L.length ? L.map(({ r, i }) => `<div class="row" style="cursor:pointer" data-i="${i}"><span>${esc(r.n)}<small class="dn2">${esc(r.loc)}</small></span><b class="${r.soil.pct <= -20 ? "sm-d" : r.soil.pct >= 25 ? "sm-w" : ""}">${soilTxt(r.soil)}</b></div>`).join("") : '<div class="note">Soil data appears after the Update climate normals job runs.</div>'}
<div class="note">Dry soil going into planting or flowering cuts yields even if rain arrives later; waterlogged soil delays planting and harvest. ERA5 reanalysis via Open-Meteo, about 5 days behind.</div>`);
    document.querySelectorAll("#panel [data-i]").forEach(el => el.onclick = () => { const i = +el.dataset.i; go(R[i].lon, R[i].lat); show(i) });
  }

  /* extra rows in the commodity panel */
  window.hzCrop = r => {
    let h = "";
    if (r.soil) h += `<div class="row" style="cursor:pointer" onclick="CMD_RUN('SOIL')"><span>Soil moisture</span><b class="${r.soil.pct <= -20 ? "sm-d" : r.soil.pct >= 25 ? "sm-w" : ""}">${soilTxt(r.soil)}</b></div>`;
    (HZ && HZ.frost || []).filter(f => f.c == r.n && (f.in_season || f.lvl)).forEach(f => {
      const i = HZ.frost.indexOf(f);
      h += `<div class="row" style="cursor:pointer" onclick="showFrost(HZ.frost[${i}])"><span>❄ ${esc(f.n)}</span><b class="${f.lvl == 2 ? "fr2" : f.lvl ? "fr1" : ""}">${f.lvl ? (f.lvl == 2 ? "Frost risk " : "Frost watch ") + f.t.toFixed(0) + "°C " + ukDay(f.day).split(" ")[0] : "No frost (low " + (f.low != null ? f.low.toFixed(0) : "—") + "°C)"} ›</b></div>`;
    });
    if (["Lumber", "Palm oil", "Sugar", "Soybeans", "Cocoa", "Coffee", "Rubber", "Cotton", "Orange juice"].includes(r.n)) {
      const fn = fireNear(r.lat, r.lon, 300);
      if (fn.n >= 25) h += `<div class="row" style="cursor:pointer" onclick="CMD_RUN('FIRE')"><span>🔥 Fires within 300 km (24 h)</span><b>${fn.n.toLocaleString("en")} detections ›</b></div>`;
    }
    return h;
  };

  /* ---------- rail corridors (static, approximate routes) ---------- */
  const RAIL = [
    ["Pilbara iron ore lines", "Iron ore", "Rio Tinto, BHP and Fortescue private heavy-haul railways move ~900 Mt a year of ore from inland mines to Dampier and Port Hedland. Cyclones and derailments here hit seaborne iron ore supply.", [[[117.8, -22.7], [117.3, -21.6], [116.75, -20.65]], [[119.7, -23.35], [119.3, -21.6], [118.6, -20.32]], [[119.4, -22.3], [118.95, -21.2], [118.6, -20.32]]]],
    ["Carajás railway (EFC)", "Iron ore", "Vale's 900 km line from the Carajás mines to Ponta da Madeira (São Luís), the world's largest iron ore mine-to-port system.", [[[-50.2, -6.06], [-48.6, -5.4], [-47.4, -4.9], [-46.2, -4.2], [-44.35, -2.57]]]],
    ["Rumo Malha Norte to Santos", "Soybeans", "Carries Mato Grosso soybeans and corn ~1,900 km to the port of Santos; competes with trucks on the BR-163 and northern barge routes.", [[[-54.64, -16.47], [-51.4, -18.8], [-49.4, -21.0], [-47.1, -22.9], [-46.3, -23.95]]]],
    ["North–South railway (FNS)", "Soybeans", "Links central Brazil's grain belt to the northern port of Itaqui (São Luís), shortening the route to Europe and Asia.", [[[-48.95, -16.33], [-48.6, -12.0], [-48.3, -9.0], [-47.5, -5.5], [-46.2, -4.2], [-44.35, -2.57]]]],
    ["Bakken crude and grain to the Pacific (BNSF)", "Crude oil", "North Dakota crude and northern-plains grain heading west to Pacific Northwest refineries and export terminals. Most US crude-by-rail now goes this way.", [[[-103.6, 48.15], [-106.6, 48.4], [-109.7, 48.55], [-114.3, 48.4], [-117.4, 47.66], [-119.3, 46.2], [-122.6, 48.5]]]],
    ["Bakken to the Midwest and East", "Crude oil", "Crude-by-rail to the US East Coast peaked around 2014; it now runs only when pipeline space or price spreads make it pay.", [[[-103.6, 48.15], [-100.8, 46.8], [-96.8, 46.88], [-93.27, 44.98], [-89.4, 43.07], [-87.65, 41.85], [-80.0, 40.44], [-75.17, 39.95]]]],
    ["Powder River Basin coal", "Coal", "Wyoming's Powder River Basin ships ~40% of US coal by rail to Midwest and Southern power plants.", [[[-105.5, 44.29], [-104.8, 43.1], [-102.0, 41.7], [-100.77, 41.13], [-96.0, 41.26], [-94.6, 39.1]]]],
    ["Corn Belt to the Gulf and Mexico (UP)", "Corn", "Rail is how US corn and soybeans reach Texas Gulf ports and Mexico, the biggest US corn buyer; it takes over when the Mississippi runs low.", [[[-93.6, 41.6], [-95.9, 41.3], [-97.3, 37.69], [-97.5, 35.47], [-97.33, 32.75], [-98.5, 29.42], [-99.5, 27.5]], [[-97.33, 32.75], [-95.37, 29.76]]]],
    ["Canadian prairies to Vancouver (CN, CPKC)", "Wheat", "Canada's wheat and canola, plus potash and coal, roll west through the Rockies to Vancouver. Wildfires, floods and strikes on these lines stall Canadian exports.", [[[-97.14, 49.9], [-101.0, 50.0], [-104.6, 50.45], [-110.68, 50.04], [-114.07, 51.05], [-118.2, 51.0], [-120.33, 50.67], [-121.9, 49.4], [-123.1, 49.28]]]],
    ["CN line to Prince Rupert", "Wheat", "Shorter route to Asia for prairie grain, coal and containers.", [[[-113.5, 53.55], [-118.08, 53.1], [-122.75, 53.92], [-127.2, 54.78], [-130.32, 54.31]]]],
    ["Alberta crude by rail (Hardisty)", "Crude oil", "Oil-sands crude loaded at Hardisty runs south when export pipelines are full; Canada→US rail volumes are tracked monthly by the EIA.", [[[-111.3, 52.67], [-110.68, 50.04], [-105.5, 47.5], [-100.8, 46.8], [-96.8, 46.88]]]],
    ["Russia's Eastern Polygon (Trans-Siberian, BAM)", "Coal", "Kuzbass coal and other bulk heading to Pacific ports for China, Japan and Korea. Capacity limits here cap Russian coal exports.", [[[86.1, 55.35], [92.87, 56.01], [104.3, 52.29], [113.5, 52.03], [127.53, 50.26], [135.07, 48.48], [132.9, 42.82]]]],
    ["Southern Russia grain to Novorossiysk", "Wheat", "Grain trains from the Volga and Central Black Earth regions feed Novorossiysk and the Azov ports, Russia's main wheat outlets.", [[[39.2, 51.67], [39.72, 47.22], [38.97, 45.04], [37.77, 44.72]]]],
    ["Kazakhstan to China (Dostyk–Alashankou)", "Wheat", "Kazakh grain, copper and oil products into western China.", [[[71.43, 51.13], [73.1, 49.8], [75.0, 46.85], [79.6, 46.95], [82.5, 45.25]]]],
    ["Ukraine rail to the EU border", "Wheat", "Ukrainian grain by rail to Poland and the Danube ports; matters most when Black Sea shipping is disrupted.", [[[30.52, 50.45], [27.6, 49.25], [24.03, 49.84], [22.77, 49.78]], [[30.73, 46.48], [29.4, 45.95], [28.83, 45.35]]]],
    ["Daqin coal railway", "Coal", "China's busiest coal line, from Shanxi to Qinhuangdao port; drives seaborne coal and power-sector fuel supply.", [[[113.3, 40.08], [116.5, 40.2], [119.6, 39.93]]]],
    ["Richards Bay coal line", "Coal", "Transnet's line from Mpumalanga coalfields to Richards Bay Coal Terminal; performance problems have cut South African coal exports.", [[[29.98, -26.53], [30.8, -27.7], [32.04, -28.78]]]],
    ["Lobito corridor", "Copper", "Benguela railway from the DRC/Zambia copper belt to the Atlantic port of Lobito in Angola, an alternative to trucking to Durban and Dar es Salaam.", [[[25.47, -10.72], [22.4, -10.7], [18.0, -12.0], [15.74, -12.77], [13.55, -12.35]]]],
  ];
  const D = segs => segs.map(s => s.map(([lo, la], i) => (i ? "L" : "M") + (lo + 180).toFixed(2) + " " + (90 - la).toFixed(2)).join("")).join("");
  {
    const OVs = document.getElementById("ov");
    if (OVs) {
      const g = document.createElementNS(NS, "g"); g.setAttribute("class", "L-rail");
      g.innerHTML = RAIL.map((r, i) => `<path class="rl" d="${D(r[3])}"/><path class="rl2" d="${D(r[3])}"/><path class="rhit" data-r="${i}" d="${D(r[3])}"><title>${esc(r[0])}</title></path>`).join("");
      OVs.appendChild(g);
      g.addEventListener("click", e => { const i = e.target.dataset && e.target.dataset.r; if (i != null) { e.stopPropagation(); showRail(+i) } });
    }
  }
  function showRail(i) {
    const r = i == null ? null : RAIL[i], rf = typeof RF != "undefined" && RF && RF.rail;
    const k = ["total", "canada", "bakken_wc"].filter(x => rf && rf[x]);
    const last = k.length ? rf[k[0]].d.at(-1) : null;
    const yo = s => { const j = s.d.indexOf((+s.d.at(-1).slice(0, 4) - 1) + s.d.at(-1).slice(4)); return j >= 0 ? s.v[j] : null };
    info(`<h2>${r ? esc(r[0]) : "Rail freight"}</h2>${r ? `<div class="row"><span>Main cargo</span><b>${esc(r[1])}</b></div><div style="font-size:13px;margin:6px 0 2px">${esc(r[2])}</div>` : ""}
<div class="kh">US crude oil moved by rail (EIA, monthly)${last ? " · " + new Date(last + "-15").toLocaleDateString("en-GB", { month: "long", year: "numeric" }) : ""}</div>
${k.length ? k.map(x => { const s = rf[x], y = yo(s); return `<div class="row"><span>${esc(s.n)}</span><b>${s.v.at(-1).toFixed(0)} kb/d${y ? ` <small class="dn2">${sg((s.v.at(-1) / y - 1) * 100, 0)}% y/y</small>` : ""}</b></div>` }).join("") + '<div class="ukl"><span><i style="background:var(--amb)"></i>All US crude by rail</span><span><i style="background:var(--s1)"></i>Canada to US</span></div><div class="ukc2" id="rlc"></div>' : '<div class="note">Crude-by-rail data appears after the Update refining job runs.</div>'}
<div class="note">Rail moved over 1 mb/d of US crude in 2014; pipelines have since taken most of it, so rail volumes now jump when pipelines are full or price spreads widen (for example Canadian heavy crude vs WTI). EIA monthly data runs about 3 months behind. Lines on the map are approximate routes of key commodity railways.</div>`);
    if (k.length) setTimeout(() => { const box = $("#rlc"), A = rf.total || rf[k[0]], C = rf.canada; if (!box) return; const n = Math.min(A.d.length, 60), d = A.d.slice(-n), cm = C ? new Map(C.d.map((x, j) => [x, C.v[j]])) : new Map();
      tsChart(box, { t: d.map(x => Date.parse(x + "-15T00:00Z")), h: 140, zero: 1, series: [{ n: "All US", c: "var(--amb)", v: A.v.slice(-n) }, { n: "Canada to US", c: "var(--s1)", v: d.map(x => cm.get(x) ?? null), w: 1.4 }], fmt: v => v.toFixed(0) + " kb/d", lab: t => new Date(t).toLocaleDateString("en-GB", { month: "short", year: "numeric" }) }) }, 0);
  }
  window.showRail = showRail;

  /* ---------- load and draw ---------- */
  function draw() {
    document.querySelectorAll(".mk.L-river,.mk.L-frost").forEach(e => e.remove());
    (HZ.rivers || []).forEach(r => { const st = rvState(r), e = pt(r.lon, r.lat, "L-river rv-" + st.k, `${r.n}: ${r.v.at(-1)} ${r.u} · ${st.t}`, `${r.n.replace("Mississippi at ", "").replace("Rhine at ", "Rhine · ")} ${r.v.at(-1).toFixed(r.u == "cm" ? 0 : 1)}${r.u == "cm" ? " cm" : " ft"}`, () => showRiver(r)) });
    frSites().forEach(f => pt(f.lon, f.lat, "L-frost fl" + f.lvl, `${f.n}: ${f.lvl ? f.t.toFixed(1) + "°C forecast " + ukDay(f.day) : "no frost forecast"}`, f.lvl ? `${f.t.toFixed(0)}°C ${ukDay(f.day).split(" ")[0]}` : "", () => showFrost(f)));
    if (fireG) { fireG.remove(); fireG = null } drawFires();
    layout();
  }
  async function load() {
    try { const j = await (await getData("hazards", "hazards.json")).json(); if (j && j.updated) { window.HZ = j; draw(); window.renderHealth && renderHealth() } } catch (e) {}
  }
  later(load, 1800); setInterval(load, 30 * 6e4);

  /* watch list for the brief */
  window.hzWatch = () => {
    const L = [];
    (HZ && HZ.rivers || []).forEach(r => {
      const s = rvState(r), run = () => { go(r.lon, r.lat); showRiver(r) };
      if (s.k == "low" || s.k == "sev") L.push({ t: `${r.n} ${r.v.at(-1).toFixed(r.u == "cm" ? 0 : 1)} ${r.u}: ${s.t.toLowerCase()}`, run, sev: s.k == "sev" ? 3 : 2 });
      else { const f = (r.fc || []).reduce((a, b) => !a || b[1] < a[1] ? b : a, null), fs = f && rvState({ v: [f[1]], lv: r.lv }); if (fs && fs.k != "ok" && fs.k != s.k) L.push({ t: `${r.n} forecast to fall to ${f[1].toFixed(1)} ${r.u}: ${fs.t.toLowerCase()}`, run, sev: 1 }) }
    });
    (HZ && HZ.frost || []).filter(f => f.lvl && f.in_season).forEach(f => L.push({ t: `${f.lvl == 2 ? "Frost risk" : "Frost watch"} for ${f.c.toLowerCase()}: ${f.t.toFixed(0)}°C ${ukDay(f.day)} in ${f.n}`, run: () => { go(f.lon, f.lat); showFrost(f) }, sev: f.lvl == 2 ? 3 : 1 }));
    return L;
  };

  /* command bar entries */
  const FN = {
    RIVER: () => { layerOn("river"); const r = HZ && HZ.rivers && HZ.rivers.slice().sort((a, b) => ({ sev: 0, low: 1, wat: 2, ok: 3, na: 4 })[rvState(a).k] - ({ sev: 0, low: 1, wat: 2, ok: 3, na: 4 })[rvState(b).k])[0]; if (r) { go(r.lon, r.lat); showRiver(r) } },
    FROST: () => { layerOn("frost"); frostList() },
    FIRE: () => { layerOn("fire"); drawFires(); fireList() },
    SOIL: () => soilList(),
    RAIL: () => { layerOn("rail"); showRail(null) },
    FREIGHT: () => { typeof mkShow == "function" && mkShow("BDRY") },
  };
  window.CMD_RUN = c => FN[c] && FN[c]();
  window.CMD_FN = [
    ["RIVER", "River levels (Rhine, Mississippi)", "river rhine kaub mississippi barge low water draft", FN.RIVER],
    ["FROST", "Frost watch for crops", "frost freeze cold coffee citrus wheat winterkill", FN.FROST],
    ["FIRE", "Wildfires, last 24 hours", "fire fires wildfire firms burning smoke", FN.FIRE],
    ["SOIL", "Soil moisture vs normal", "soil moisture drought dry wet", FN.SOIL],
    ["RAIL", "Rail corridors and crude by rail", "rail railway train crude by rail bakken freight", FN.RAIL],
    ["FREIGHT", "Freight rates (dry bulk, tankers)", "freight shipping rates baltic dry bulk tanker bdry bwet", FN.FREIGHT],
  ];
  window.CMD_ITEMS = () => (HZ && HZ.rivers || []).map(r => ({ t: r.n, s: `River level · ${r.v.at(-1)} ${r.u} · ${rvState(r).t}`, k: r.n + " river barge water level", g: "River", run: () => { layerOn("river"); go(r.lon, r.lat); showRiver(r) } }))
    .concat(RAIL.map((r, i) => ({ t: r[0], s: "Rail corridor · " + r[1], k: r[0] + " rail railway " + r[1], g: "Rail", run: () => { layerOn("rail"); go(r[3][0][0][0], r[3][0][0][1]); showRail(i) } })));
})();
