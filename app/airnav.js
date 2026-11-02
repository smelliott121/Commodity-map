/* ---- Airport disruption (drone incidents from news, FAA live US status) and naval activity (reported Russian activity near the UK/Europe, USNI US Navy positions) ---- */
(() => {
  window.APT = null; window.NAV = null;
  const day = 864e5, dd = s => Date.parse(s + "T12:00Z");
  const fmtD = s => new Date(dd(s)).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
  const go = (lo, la) => typeof panTo == "function" && panTo(lo, la);
  const HOME = "JER";

  /* layer switches */
  const tg = document.getElementById("tg"), lg = tg && tg.querySelector(".lg");
  [["air", "Airport disruption", 1], ["navy", "Naval activity", 1]].forEach(([k, t, on]) => {
    if (!tg) return; const b = document.createElement("button"); b.textContent = t; b.dataset.k = k;
    if (!on) { b.classList.add("off"); map.classList.add("off-" + k) }
    b.onclick = () => { b.classList.toggle("off", map.classList.toggle("off-" + k)); layout() };
    lg ? tg.insertBefore(b, lg) : tg.appendChild(b);
  });
  const mk = (lo, la, cls, html, title, click) => { const e = document.createElement("div"); e.className = "mk " + cls; e.style.left = X(lo) / 3.6 + "%"; e.style.top = Y(la) / 1.8 + "%"; e.innerHTML = html; e.title = title; e.onclick = ev => { ev.stopPropagation(); click(); e.classList.add("on") }; map.appendChild(e); return e };

  /* ---------- airports ---------- */
  function byAirport(days) {
    const cut = Date.now() - days * day, M = {};
    (APT.inc || []).forEach(i => { if (dd(i.d) < cut) return; const m = M[i.a] = M[i.a] || { a: i.a, n: 0, s: 0, c: 0, last: i.d, L: [] }; m.n++; m[i.k == "conflict" ? "c" : "s"]++; m.L.push(i); if (i.d > m.last) m.last = i.d });
    return Object.values(M).filter(m => APT.ap[m.a]).sort((a, b) => b.n - a.n);
  }
  function drawAir() {
    document.querySelectorAll(".mk.L-air").forEach(e => e.remove());
    byAirport(30).forEach(m => {
      const ap = APT.ap[m.a], recent = Date.now() - dd(m.last) < 3 * day, sz = Math.min(26, 10 + Math.sqrt(m.n) * 4);
      mk(ap.lon, ap.lat, `L-air ${m.c > m.s ? "war" : "sgt"}${recent ? " hot" : ""}${m.a == HOME ? " home" : ""}`, `<i style="width:${sz}px;height:${sz}px">✈</i>${m.a == HOME || m.n >= 3 || recent ? `<b class="aptag">${esc(m.a)} · ${m.n}</b>` : ""}`,
        `${ap.n}: ${m.n} drone disruption report${m.n > 1 ? "s" : ""} in 30 days`, () => showApt(m.a));
    });
    (APT.faa || []).forEach(f => { const ap = APT.ap[f.a]; if (!ap) return;
      mk(ap.lon, ap.lat, "L-air faa", `<i>!</i><b class="aptag">${esc(f.a)} ${esc(/Ground Stop/i.test(f.kind) ? "ground stop" : /Ground Delay/i.test(f.kind) ? "delay programme" : /Closure/i.test(f.kind) ? "closed" : "delays")}</b>`, `${ap.n}: ${f.kind}`, () => showApt(f.a)) });
    layout();
  }
  function bars(series, h = 90) {   // weekly stacked bars: [[t, sightings, conflict]]
    const W = 340, n = series.length, mx = Math.max(1, ...series.map(s => s[1] + s[2])), bw = W / n;
    let g = "";
    series.forEach(([t, s, c], i) => { const hs = s / mx * (h - 14), hc = c / mx * (h - 14), x = i * bw;
      if (c) g += `<rect x="${x + .5}" y="${h - 12 - hc}" width="${bw - 1}" height="${hc}" fill="#ff5a4e"><title>${new Date(t).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}: ${c} wartime</title></rect>`;
      if (s) g += `<rect x="${x + .5}" y="${h - 12 - hc - hs}" width="${bw - 1}" height="${hs}" fill="#ffb020"><title>${new Date(t).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}: ${s} sightings</title></rect>`;
      const d = new Date(t); if (d.getUTCDate() <= 7) g += `<text x="${x + bw / 2}" y="${h - 1}" class="ax" text-anchor="middle">${d.toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" })}</text>` });
    return `<svg viewBox="0 0 ${W} ${h}" width="100%" height="${h}" preserveAspectRatio="none" class="chs">${g}</svg>`;
  }
  function weekly(L) {
    const t0 = Date.UTC(2026, 0, 5), out = [];
    for (let t = t0; t < Date.now(); t += 7 * day) out.push([t, 0, 0]);
    L.forEach(i => { const k = Math.floor((dd(i.d) - t0) / (7 * day)); if (k >= 0 && k < out.length) out[k][i.k == "conflict" ? 2 : 1]++ });
    return out;
  }
  function showApt(a) {
    const ap = APT.ap[a] || { n: a }, L = (APT.inc || []).filter(i => i.a == a), f = (APT.faa || []).filter(x => x.a == a);
    const c = d => L.filter(i => Date.now() - dd(i.d) < d * day).length;
    info(`<h2>${esc(ap.n)}</h2>
${f.map(x => `<div class="row"><span>FAA now</span><b class="wrap dn">${esc(x.kind)}${x.avg ? " · avg " + esc(x.avg) : ""}${x.why ? `<small class="dn2" style="display:block">${esc(x.why)}</small>` : ""}</b></div>`).join("")}
${L.length ? `<div class="tgrid"><div><span class="note" style="margin:0">Last 30 days</span><b>${c(30)}</b><small>days with reports</small></div><div><span class="note" style="margin:0">Last 90 days</span><b>${c(90)}</b><small>days</small></div><div><span class="note" style="margin:0">Since January</span><b>${L.length}</b><small>days</small></div></div>
<div class="kh">Reports by week</div>${bars(weekly(L), 70)}
<div class="kh">Reports</div>${L.slice(0, 12).map(i => `<a class="bsn" href="${esc(safeU(i.u))}" target="_blank" rel="noopener"><span class="${i.k == "conflict" ? "dn" : ""}">${fmtD(i.d)}</span> ${esc(i.t)} <small>${esc(i.s)}</small></a>`).join("")}` : '<div class="note">No drone disruption reports found for this airport.</div>'}
<div class="note">${a == HOME ? "Your local airport. " : ""}Built from news reports: each dot is a day on which at least one outlet reported drones disrupting flights at this airport. Quiet incidents that never made the news are missed. Red = wartime drone attacks (e.g. Moscow), amber = sightings near civilian airports.</div>`);
  }
  window.showApt = showApt;
  function airList() {
    if (!APT) return;
    const T = byAirport(90), S = (APT.inc || []).filter(i => i.k == "sighting"), C = (APT.inc || []).filter(i => i.k == "conflict"), cut30 = Date.now() - 30 * day;
    info(`<h2>Airport disruption</h2>
<div class="tgrid"><div><span class="note" style="margin:0">Drone sightings</span><b style="color:#ffb020">${S.filter(i => dd(i.d) > cut30).length}</b><small>airport-days, 30 d</small></div><div><span class="note" style="margin:0">Wartime attacks</span><b style="color:#ff5a4e">${C.filter(i => dd(i.d) > cut30).length}</b><small>airport-days, 30 d</small></div><div><span class="note" style="margin:0">US FAA now</span><b>${(APT.faa || []).length}</b><small>stops / delays</small></div></div>
<div class="kh">Drone disruption reports per week, 2026</div><div class="ukl"><span><i style="background:#ffb020"></i>Sightings near civilian airports</span><span><i style="background:#ff5a4e"></i>Wartime drone attacks</span></div>${bars(weekly(APT.inc || []))}
<div class="kh">Most affected, last 90 days</div>${T.slice(0, 12).map(m => `<div class="row" style="cursor:pointer" data-a="${esc(m.a)}"><span>${esc(APT.ap[m.a].n)}${m.a == HOME ? " ★" : ""}<small class="dn2" style="display:block">${esc(APT.ap[m.a].c)} · last ${fmtD(m.last)}</small></span><b style="color:${m.c > m.s ? "#ff5a4e" : "#ffb020"}">${m.n} day${m.n > 1 ? "s" : ""}</b></div>`).join("")}
${(APT.faa || []).length ? `<div class="kh">US airports now (FAA)</div>${APT.faa.map(f => `<div class="row" style="cursor:pointer" data-a="${esc(f.a)}"><span>${esc(f.a)} · ${esc(f.kind)}</span><b class="wrap">${esc(f.avg || f.reopen || "")}</b></div>`).join("")}` : ""}
<div class="note">Drone data is built from news reports since January 2026, so it shows how often incidents are reported, not every incident. US delays and ground stops are live from the FAA. There's no free live feed for European airport delays.</div>`);
    document.querySelectorAll("#panel [data-a]").forEach(el => el.onclick = () => { const ap = APT.ap[el.dataset.a]; ap && go(ap.lon, ap.lat); showApt(el.dataset.a) });
  }
  window.airList = airList;

  /* ---------- navy ---------- */
  function areas(days) {
    const cut = Date.now() - days * day, M = {};
    (NAV.ru || []).forEach(e => { if (dd(e.d) < cut) return; const m = M[e.area] = M[e.area] || { area: e.area, lat: e.area == "English Channel" ? 50.15 : e.lat, lon: e.area == "English Channel" ? -0.3 : e.lon, n: 0, oil: 0, last: e.d, L: [] }; m.n++; m.oil += e.oil ? 1 : 0; m.L.push(e); if (e.d > m.last) m.last = e.d });
    return Object.values(M).sort((a, b) => b.n - a.n);
  }
  function drawNav() {
    document.querySelectorAll(".mk.L-navy").forEach(e => e.remove());
    areas(90).forEach(m => { const recent = Date.now() - dd(m.last) < 7 * day;
      mk(m.lon, m.lat, "L-navy ru" + (recent ? " hot" : ""), `<i>⚓</i><b class="nvtag">${esc(m.area)} · ${m.n}</b>`, `${m.area}: ${m.n} reported Russian naval or shadow-fleet events in 90 days`, () => showArea(m.area)) });
    const U = NAV.usni && NAV.usni.ships || [], seen = {};
    U.forEach(s => { const k = s.lat + "," + s.lon, o = seen[k] = (seen[k] || 0) + 1;
      mk(s.lon + (o - 1) * 1.6, s.lat - (o - 1) * .9, "L-navy us " + s.kind, `<i>${s.kind == "carrier" ? "▲" : "◆"}</i><b class="nvtag">${esc(s.ship.replace("USS ", ""))}</b>`, `${s.ship} (${s.hull}) · ${s.where}`, () => showShip(s)) });
    layout();
  }
  function showArea(a) {
    const L = (NAV.ru || []).filter(e => e.area == a);
    info(`<h2>Russian naval activity · ${esc(a)}</h2>
<div class="tgrid"><div><span class="note" style="margin:0">Last 30 days</span><b>${L.filter(e => Date.now() - dd(e.d) < 30 * day).length}</b><small>days reported</small></div><div><span class="note" style="margin:0">Since January</span><b>${L.length}</b><small>days</small></div><div><span class="note" style="margin:0">Shadow-fleet tankers</span><b>${L.filter(e => e.oil).length}</b><small>of those days</small></div></div>
<div class="kh">Reports</div>${L.slice(0, 15).map(e => `<a class="bsn" href="${esc(safeU(e.u))}" target="_blank" rel="noopener"><span>${fmtD(e.d)}</span> ${e.oil ? "🛢 " : ""}${esc(e.t)} <small>${esc(e.s)}</small></a>`).join("")}
<div class="note">Positions are the sea area named in the reports, not live tracks: Russian warships don't broadcast their position and the Royal Navy announces escorts after the event. 🛢 marks reports involving sanctioned "shadow fleet" oil tankers, which carry Russian crude past the UK.</div>`);
  }
  function showShip(s) {
    info(`<h2>${esc(s.ship)} <small class="dn2">${esc(s.hull)}</small></h2>
<div class="row"><span>Type</span><b>${s.kind == "carrier" ? "Aircraft carrier (carrier strike group)" : "Amphibious assault ship (amphibious ready group)"}</b></div>
<div class="row"><span>Reported area</span><b>${esc(s.where)}</b></div>
<div class="note" style="margin-top:4px">${esc(s.note)}</div>
<div class="note">From the <a href="${esc(safeU(NAV.usni.u))}" target="_blank" rel="noopener">${esc(NAV.usni.title)}</a>: approximate positions, published weekly-ish by the US Naval Institute from Navy and public information. Carrier groups near Hormuz, the Red Sea or Taiwan are the ones markets watch.</div>`);
  }
  function navList() {
    if (!NAV) return;
    const A = areas(90), U = NAV.usni && NAV.usni.ships || [];
    info(`<h2>Naval activity</h2>
<div class="kh">Russian navy and shadow fleet near the UK and Europe, last 90 days</div>${A.length ? A.map(m => `<div class="row" style="cursor:pointer" data-ar="${esc(m.area)}"><span>${esc(m.area)}<small class="dn2" style="display:block">last ${fmtD(m.last)}${m.oil ? ` · ${m.oil} with shadow-fleet tankers` : ""}</small></span><b>${m.n} day${m.n > 1 ? "s" : ""}</b></div>`).join("") : '<div class="note">No reports in the last 90 days.</div>'}
<div class="kh">US Navy carriers and amphibious groups${NAV.usni && NAV.usni.d ? " · as of " + fmtD(NAV.usni.d) : ""}</div>${U.map((s, i) => `<div class="row" style="cursor:pointer" data-us="${i}"><span>${esc(s.ship)}<small class="dn2" style="display:block">${s.kind}</small></span><b>${esc(s.where)}</b></div>`).join("") || '<div class="note">No current tracker.</div>'}
<div class="note">No public source shows every navy ship: warships switch off their position transponders. This layer shows what's publicly reported: Royal Navy and press reports of Russian warships, spy ships and shadow-fleet tankers (placed in the sea area named), and the US Naval Institute's fleet tracker.</div>`);
    document.querySelectorAll("#panel [data-ar]").forEach(el => el.onclick = () => { const m = A.find(x => x.area == el.dataset.ar); m && go(m.lon, m.lat); showArea(el.dataset.ar) });
    document.querySelectorAll("#panel [data-us]").forEach(el => el.onclick = () => { const s = U[+el.dataset.us]; go(s.lon, s.lat); showShip(s) });
  }
  window.navList = navList;

  async function load() {
    try { const j = await (await getData("airports", "airports.json")).json(); if (j && j.inc) { window.APT = j; drawAir() } } catch (e) {}
    try { const j = await (await getData("navy", "navy.json")).json(); if (j && j.ru) { window.NAV = j; drawNav() } } catch (e) {}
    window.renderHealth && renderHealth();
  }
  later(load, 2000); setInterval(load, 20 * 6e4);

  window.anWatch = () => {
    const L = [];
    if (APT) {
      const h = (APT.inc || []).filter(i => i.a == HOME && Date.now() - dd(i.d) < 2 * day);
      if (h.length) L.push({ t: `Drones disrupting Jersey Airport (${(APT.inc || []).filter(i => i.a == HOME && Date.now() - dd(i.d) < 14 * day).length} days in the last 2 weeks)`, run: () => { const ap = APT.ap[HOME]; ap && go(ap.lon, ap.lat); showApt(HOME) }, sev: 2 });
      const gs = (APT.faa || []).filter(f => /Ground Stop/i.test(f.kind)); if (gs.length) L.push({ t: `US ground stops: ${gs.map(f => f.a).join(", ")}`, run: airList, sev: 1 });
    }
    if (NAV) { const r = (NAV.ru || []).filter(e => Date.now() - dd(e.d) < 3 * day); if (r.length) L.push({ t: `Russian naval activity reported: ${[...new Set(r.map(e => e.area))].join(", ")}`, run: navList, sev: 1 }) }
    return L;
  };
  window.CMD_FN = (window.CMD_FN || []).concat([
    ["AIR", "Airport disruption and drone incidents", "airport drones drone flights delays ground stop faa jersey diverted", () => { layerOn("air"); airList() }],
    ["NAVY", "Naval activity: Russian ships near the UK, US carriers", "navy naval warship russian royal navy shadow fleet carrier usni", () => { layerOn("navy"); navList() }]]);
})();
