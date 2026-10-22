/* ---- European / Atlantic windstorms (Update European storms job): tracked lows, gust swath, named storms, wind warnings ---- */
(() => {
  window.EUS = null;
  const NS = "http://www.w3.org/2000/svg";
  const ukT2 = t => new Date(t + (t.length == 16 ? ":00Z" : "")).toLocaleString("en-GB", { weekday: "short", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Europe/London" }) + " UK";
  const tms = t => Date.parse(t + (t.length == 16 ? ":00Z" : ""));
  const kmh2mph = v => Math.round(v * .621);
  const GC = v => v >= 130 ? "#d63cff" : v >= 110 ? "#ff3b3b" : v >= 90 ? "#ff8a2b" : "#f2c94c";
  /* energy and shipping assets that windstorms hit */
  const ASSETS = [["Johan Sverdrup oil field", 58.85, 2.6, "North Sea oil"], ["Troll gas field", 60.65, 3.72, "Norway's biggest gas field (Europe's gas supply)"], ["Brent / East Shetland fields", 61.1, 1.7, "North Sea oil"],
    ["Ekofisk", 56.55, 3.2, "North Sea oil and gas"], ["Forties pipeline system", 57.7, 0.9, "North Sea oil (a Brent basket grade)"], ["Sullom Voe terminal", 60.46, -1.3, "Oil terminal"], ["Kollsnes / Nyhamna gas plants", 60.55, 4.85, "Norwegian gas export"],
    ["Dover Strait / Channel", 51.0, 1.4, "World's busiest shipping lane"], ["Felixstowe", 51.95, 1.33, "UK's largest container port"], ["Rotterdam", 51.9, 4.1, "Europe's largest port and refining hub"], ["Antwerp", 51.3, 4.3, "Port and chemicals hub"],
    ["Milford Haven LNG", 51.7, -5.05, "UK LNG import terminals"], ["Isle of Grain LNG", 51.44, 0.72, "UK LNG import terminal"], ["Fawley refinery", 50.83, -1.33, "UK's largest refinery"], ["Pembroke refinery", 51.68, -5.0, "UK refinery"],
    ["Hornsea / Dogger Bank wind farms", 54.0, 1.8, "UK offshore wind"], ["Le Havre", 49.48, 0.1, "France's main container port"], ["Hamburg", 53.55, 9.95, "Germany's main port"], ["Bilbao", 43.35, -3.05, "Biscay port"]];
  
  function cur(l) { const n = Date.now(); let b = l.pts[0]; for (const p of l.pts) if (tms(p[3]) <= n) b = p; return b }
  function posAt(l, t) { let b = null, bd = 1e18; for (const p of l.pts) { const d = Math.abs(tms(p[3]) - t); if (d < bd) { bd = d; b = p } } return bd <= 6 * 36e5 ? b : null }
  function owner(cell) {   // which storm is responsible for a gust cell: the nearest centre at the time of the peak gust
    const t = tms(cell[3]); let best = null, bd = 1e9;
    (EUS.lows || []).forEach(l => { const p = posAt(l, t); if (!p) return; const d = km(cell[0], cell[1], p[1], p[0]); if (d < bd) { bd = d; best = l } });
    return bd < 1100 ? best : null;
  }
  function hits(l) {   // energy and shipping assets under this storm's strong-gust swath
    const G = (EUS.gust || []).filter(g => g[2] >= 90 && owner(g) === l), out = [];
    ASSETS.forEach(a => { const g = G.filter(c => Math.abs(c[0] - a[1]) < 3 && km(a[1], a[2], c[0], c[1]) < 170).sort((x, y) => y[2] - x[2])[0];
      if (g) out.push({ n: a[0], w: a[3], g: g[2], t: g[3] }) });
    return out.sort((a, b) => b.g - a.g);
  }
  function title(l) { return l.name ? `Storm ${l.name}` : `Atlantic low` }

  function showEu(l) {
    const c = cur(l), lo = l.pts.reduce((a, b) => b[2] < a[2] ? b : a), H = hits(l), W = EUS.warn || {}, MO = EUS.mo || [];
    const fut = l.pts.filter(p => tms(p[3]) > Date.now()), every = fut.filter((_, i) => i % 4 == 0).slice(0, 8);
    const ukW = MO.length ? MO.map(m => `<div class="row"><span class="wrap">${esc(m.t)}<small class="dn2" style="display:block">${esc(m.d.replace(m.t + ": ", "").slice(0, 160))}</small></span><b><a href="${esc(safeU(m.u))}" target="_blank" rel="noopener">›</a></b></div>`).join("") : "";
    const euW = Object.entries(W).filter(([k]) => k != "UK" || !MO.length).map(([k, v]) => `<div class="row"><span>${esc(k)}${v.areas && (v.areas.red || v.areas.orange) ? `<small class="dn2" style="display:block">${esc((v.areas.red || v.areas.orange).slice(0, 3).join(", "))}</small>` : ""}</span><b>${v.n.red ? `<span class="wv wr">${v.n.red} red</span>` : ""}${v.n.orange ? `<span class="wv wo">${v.n.orange} amber</span>` : ""}${v.n.yellow ? `<span class="wv wy">${v.n.yellow} yellow</span>` : ""}</b></div>`).join("");
    info(`<h2 style="display:flex;align-items:center;gap:8px"><span class="eul big">L</span><span>${esc(title(l))}</span></h2>
${l.name ? `<div class="note" style="margin:-4px 0 6px">Named by the UK, Irish and Dutch weather services. Track and gusts are from the forecast model, not an official advisory.</div>` : ""}
<div class="tgrid"><div><span class="note" style="margin:0">Pressure now</span><b>${c[2].toFixed(0)}</b><small>hPa</small></div>
<div><span class="note" style="margin:0">Deepest</span><b>${lo[2].toFixed(0)}</b><small>${ukT2(lo[3])}</small></div>
<div><span class="note" style="margin:0">Strongest gusts</span><b>${l.gmax ? l.gmax : "—"}</b><small>km/h${l.gmax ? " · " + kmh2mph(l.gmax) + " mph" : ""}</small></div></div>
${l.bomb ? `<div class="row"><span>Deepening</span><b class="wrap dn">${l.fall24} hPa in 24 h: explosive cyclogenesis ("weather bomb")</b></div>` : l.fall24 ? `<div class="row"><span>Deepening</span><b>${l.fall24} hPa in 24 h</b></div>` : ""}
${H.length ? `<div class="kh">Energy and shipping in its strongest winds</div>${H.slice(0, 8).map(h => `<div class="row"><span>${esc(h.n)}<small class="dn2" style="display:block">${esc(h.w)}</small></span><b style="color:${GC(h.g)}">${h.g} km/h<small class="dn2" style="display:block;text-align:right">${ukT2(h.t)}</small></b></div>`).join("")}` : ""}
${ukW || euW ? `<div class="kh">Official wind warnings now (all storms)</div>${ukW}${euW}` : ""}
${every.length ? `<div class="kh">Forecast track</div><table class="ftb"><tr><th>Valid (UK)</th><th>Centre</th><th>Pressure</th></tr>${every.map(p => `<tr><td>${ukT2(p[3])}</td><td>${Math.abs(p[1]).toFixed(1)}°N ${Math.abs(p[0]).toFixed(1)}°${p[0] >= 0 ? "E" : "W"}</td><td>${p[2].toFixed(0)} hPa</td></tr>`).join("")}</table>` : ""}
<div class="kh">Why it matters for markets</div><div class="note" style="margin-top:2px">Windstorms can shut North Sea platforms and Norwegian gas plants (Brent, UK and EU gas), close ports and the Channel, and swing UK and German power prices: lots of wind pushes prices down, unless gusts are strong enough to make turbines shut down for safety. The coloured haze shows the strongest gusts forecast in the next 3 days (orange 90+, red 110+, purple 130+ km/h); small triangles mark countries with amber (or red) wind warnings, with the count. Model: Open-Meteo, on a 2° grid, so local gusts can be higher.</div>`);
  }
  window.showEu = showEu;

  let g = null;
  function draw() {
    document.querySelectorAll(".mk.L-eust").forEach(e => e.remove());
    const OVs = document.getElementById("ov"); if (!OVs || !EUS) return;
    if (!g) { g = document.createElementNS(NS, "g"); g.setAttribute("class", "L-eust"); OVs.appendChild(g) }
    let h = "";
    h += `<defs><filter id="eublur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="0.9"/></filter></defs><g filter="url(#eublur)" class="eusw">`;
    (EUS.gust || []).filter(c => c[2] >= 90).forEach(([la, lo, v]) => { h += `<rect x="${lo + 180 - 1.1}" y="${90 - la - 1.1}" width="2.2" height="2.2" fill="${GC(v)}" fill-opacity="${v >= 130 ? .5 : v >= 110 ? .42 : .3}"/>` });
    h += `</g>`;
    const now = Date.now();
    (EUS.lows || []).forEach(l => {
      const P = l.pts.map(p => [p[0], p[1], tms(p[3])]), past = P.filter(p => p[2] <= now), fut = P.filter(p => p[2] >= now);
      const d = a => a.map((p, i) => (i ? "L" : "M") + (p[0] + 180).toFixed(2) + " " + (90 - p[1]).toFixed(2)).join("");
      if (past.length > 1) h += `<path class="eup ${l.name ? "nm" : ""}" d="${d(past)}"/>`;
      if (fut.length) h += `<path class="euf ${l.name ? "nm" : ""}" d="${d((past.length ? [past.at(-1)] : []).concat(fut))}"/>`;
      fut.forEach((p, i) => { if (i && i % 4 == 0) h += `<circle class="eud" cx="${(p[0] + 180).toFixed(2)}" cy="${(90 - p[1]).toFixed(2)}" r=".35"/>` });
      const c = cur(l), e = document.createElement("div");
      e.className = "mk L-eust" + (l.name ? " nm" : "");
      e.style.left = X(c[0]) / 3.6 + "%"; e.style.top = Y(c[1]) / 1.8 + "%";
      e.innerHTML = `<b class="eul">L</b>${l.name ? `<b class="eutag">STORM ${esc(l.name.toUpperCase())} · ${c[2].toFixed(0)} hPa</b>` : ""}`;
      e.title = `${title(l)} · ${c[2].toFixed(0)} hPa now, deepest ${l.min.toFixed(0)} hPa${l.gmax ? " · gusts to " + l.gmax + " km/h" : ""}`;
      e.onclick = ev => { ev.stopPropagation(); showEu(l); e.classList.add("on") };
      map.appendChild(e);
    });
    g.innerHTML = h;
    // countries with amber/red wind warnings
    Object.entries(EUS.warn || {}).forEach(([k, v]) => { if (!v.n.orange && !v.n.red) return;
      const e = document.createElement("div"); e.className = "mk L-eust euw " + (v.n.red ? "wr" : "wo"); e.style.left = X(v.lon) / 3.6 + "%"; e.style.top = Y(v.lat) / 1.8 + "%";
      e.innerHTML = `<b class="euwt">${v.n.red || v.n.orange}</b>`; e.title = `${k}: ${v.n.red ? v.n.red + " red" : v.n.orange + " amber"} wind warning${(v.n.red || v.n.orange) > 1 ? "s" : ""}`;
      e.onclick = ev => { ev.stopPropagation(); const l = (EUS.lows || []).find(x => x.name) || (EUS.lows || [])[0]; l ? showEu(l) : null }; map.appendChild(e) });
    layout();
  }
  async function load() { try { const j = await (await getData("eustorms", "eustorms.json")).json(); if (j && j.updated) { window.EUS = j; draw(); window.renderHealth && renderHealth() } } catch (e) {} }
  later(load, 1600); setInterval(load, 30 * 6e4);

  window.euWatch = () => {
    const L = [];
    (EUS && EUS.lows || []).forEach(l => { if (!l.name && !(l.gmax >= 120 && l.bomb)) return; const fut = l.pts.some(p => tms(p[3]) > Date.now()); if (!fut) return;
      L.push({ t: `${title(l)}: ${l.min.toFixed(0)} hPa${l.bomb ? ", explosive deepening" : ""}${l.gmax ? `, gusts to ${l.gmax} km/h` : ""}`, run: () => { typeof panTo == "function" && panTo(cur(l)[0], cur(l)[1]); showEu(l) }, sev: l.gmax >= 110 || l.bomb ? 3 : 2 }) });
    const red = Object.entries(EUS && EUS.warn || {}).filter(([, v]) => v.n.red).map(([k]) => k);
    if (red.length) L.push({ t: `Red wind warnings: ${red.join(", ")}`, run: () => { const l = (EUS.lows || [])[0]; l && showEu(l) }, sev: 3 });
    return L;
  };
  window.CMD_FN = (window.CMD_FN || []).concat([["WINDSTORM", "European windstorms", "storm windstorm europe uk gale wind warning met office named", () => { typeof layerOn == "function" && layerOn("storms"); const l = (EUS && EUS.lows || []).find(x => x.name) || (EUS && EUS.lows || [])[0]; if (l) { panTo(cur(l)[0], cur(l)[1]); showEu(l) } }]]);
  const prevItems = window.CMD_ITEMS;
  window.CMD_ITEMS = () => (prevItems ? prevItems() : []).concat((EUS && EUS.lows || []).filter(l => l.name).map(l => ({ t: title(l), s: `European windstorm · ${l.min.toFixed(0)} hPa`, k: `storm ${l.name} windstorm europe`, g: "Storm", run: () => { panTo(cur(l)[0], cur(l)[1]); showEu(l) } })));
})();
