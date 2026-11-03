/* ---- Tanker charter rates: $/day figures reported in shipping news (Update tanker rates job), tanker freight ETF and owners' shares ---- */
(() => {
  window.TNK = null;
  const CL = [["VLCC", "#ff8a3d", "~2m bbl crude · Middle East → China, US Gulf → Asia"], ["Suezmax", "#f2c94c", "~1m bbl crude · West Africa → Europe, Black Sea"], ["Aframax/LR2", "#4ea8f2", "~0.7m bbl · regional crude, or large product cargoes"], ["Product (MR/LR1)", "#3fcf8e", "diesel, petrol, jet fuel between refineries and markets"]];
  const SH = ["BWET", "FRO", "DHT", "INSW", "TNK", "STNG"];
  const day = 864e5, dd = s => Date.parse(s + "T12:00Z");
  const fmtV = v => v >= 1e6 ? "$" + (v / 1e6).toFixed(v >= 1e7 ? 0 : 2).replace(/\.?0+$/, "") + "m" : "$" + Math.round(v / 1e3) + "k";
  const fmtD = s => new Date(dd(s)).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
  function scatter(P) {
    const W = 340, H = 150, pl = 4, pr = 40, pt = 8, pb = 18, iw = W - pl - pr, ih = H - pt - pb;
    const t0 = Date.UTC(2026, 0, 1), t1 = Date.now(), x = t => pl + (t - t0) / (t1 - t0) * iw;
    const vs = P.map(p => p.v), lo = Math.log10(Math.max(1e4, Math.min(...vs) * .8)), hi = Math.log10(Math.max(...vs) * 1.25), y = v => pt + (hi - Math.log10(v)) / (hi - lo) * ih;
    let g = "";
    [2e4, 5e4, 1e5, 2e5, 5e5, 1e6, 2e6].forEach(v => { const l = Math.log10(v); if (l < lo || l > hi) return; g += `<line x1="${pl}" x2="${pl + iw}" y1="${y(v)}" y2="${y(v)}" class="gl"/><text x="${W - 2}" y="${y(v) + 3.5}" class="ax" text-anchor="end">${fmtV(v)}</text>` });
    for (let m = 0; m < 12; m++) { const t = Date.UTC(2026, m, 1); if (t > t1) break; g += `<text x="${x(t) + 2}" y="${H - 4}" class="ax">${new Date(t).toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" })[0]}</text>` }
    P.forEach(p => { const c = (CL.find(k => k[0] == p.c) || CL[0])[1]; g += `<circle cx="${x(dd(p.d)).toFixed(1)}" cy="${y(p.v).toFixed(1)}" r="${p.fc ? 2.6 : 3.6}" fill="${p.fc ? "none" : c}" stroke="${c}" stroke-width="1.4"><title>${fmtD(p.d)} · ${p.c} ${fmtV(p.v)}/day${p.fc ? " (forecast)" : ""}\n${p.t}</title></circle>` });
    return `<svg width="100%" viewBox="0 0 ${W} ${H}" class="chs">${g}</svg>`;
  }
  function shareRow(sym) {
    const s = MKG.flatMap(g => g[1]).find(x => x[0] == sym), o = s && mkRow(s);
    if (!o) return "";
    return `<div class="row" style="cursor:pointer" data-mk="${esc(sym)}"><span>${esc(o.n)}</span><b>$${o.p.toFixed(2)} ${o.d1 == null ? "" : `<small style="color:var(--${o.d1 >= 0 ? "up" : "dn"})">${o.d1 >= 0 ? "+" : "−"}${Math.abs(o.d1).toFixed(1)}%</small>`}${o.m1 == null ? "" : ` <small class="dn2">1M ${o.m1 >= 0 ? "+" : "−"}${Math.abs(o.m1).toFixed(0)}%</small>`}</b></div>`;
  }
  function showTankers() {
    const P = (TNK && TNK.pts || []), act = P.filter(p => !p.fc);
    const latest = c => act.filter(p => p.c == c).slice(-1)[0];
    const ck = n => { const m = typeof MK != "undefined" && MK.find(x => x.n == n); return m && m.cs && m.cs.tot ? `${m.cs.tot.p >= 0 ? "+" : "−"}${Math.abs(m.cs.tot.p * 100).toFixed(0)}%` : "—" };
    info(`<h2>Tanker rates</h2><div class="note" style="margin:-4px 0 8px">What it costs per day to hire a tanker, by ship size</div>
${CL.map(([c, col, w]) => { const l = latest(c); return `<div class="row"${l ? ` style="cursor:pointer" data-u="${esc(safeU(l.u))}"` : ""}><span><i class="tkdot" style="background:${col}"></i>${esc(c)}<small class="dn2" style="display:block">${esc(w)}</small></span><b>${l ? `${fmtV(l.v)}/day<small class="dn2" style="display:block;text-align:right">${fmtD(l.d)} · ${esc(l.s)}</small>` : '<small class="dn2">no recent figure</small>'}</b></div>` }).join("")}
${P.length ? `<div class="kh">Rates quoted in the news, 2026 (log scale)</div><div class="ukl">${CL.map(([c, col]) => `<span><i style="background:${col}"></i>${esc(c)}</span>`).join("")}<span><i style="border:1px solid var(--mut);background:none;height:6px;width:6px;border-radius:50%"></i>forecast</span></div>${scatter(P)}` : ""}
<div class="kh">Tanker freight and owners (live)</div>${SH.map(shareRow).join("") || '<div class="note">Loads once the prices job has the tanker shares.</div>'}
<div class="kh">What drives it</div>
<div class="row" style="cursor:pointer" data-ck="Strait of Hormuz"><span>Strait of Hormuz traffic vs normal</span><b>${ck("Strait of Hormuz")} ›</b></div>
<div class="row" style="cursor:pointer" data-ck="Bab el-Mandeb"><span>Red Sea (Bab el-Mandeb) traffic vs normal</span><b>${ck("Bab el-Mandeb")} ›</b></div>
${(TNK && TNK.news || []).length ? `<div class="kh">Latest tanker market news</div>${TNK.news.slice(0, 8).map(n => `<a class="bsn" href="${esc(safeU(n.u))}" target="_blank" rel="noopener"><span>${fmtD(n.d)}</span> ${esc(n.t)} <small>${esc(n.s)}</small></a>`).join("")}` : ""}
<div class="note">The official daily rates (Baltic Exchange routes such as TD3C, Middle East → China) are subscription-only, so this collects the $/day figures quoted in shipping headlines: a guide to the level, not an index. Hollow dots are forecasts. BWET holds tanker freight futures, the closest free live proxy; owners' shares track charter rates closely. Attacks or closures at Hormuz and the Red Sea tie up ships on longer routes, which is what drives spikes.</div>`);
    document.querySelectorAll("#panel [data-mk]").forEach(el => el.onclick = () => mkShow(el.dataset.mk));
    document.querySelectorAll("#panel [data-u]").forEach(el => el.onclick = () => open(el.dataset.u, "_blank", "noopener"));
    document.querySelectorAll("#panel [data-ck]").forEach(el => el.onclick = () => { const m = MK.find(x => x.n == el.dataset.ck); if (m && typeof showChoke == "function") { typeof panTo == "function" && panTo(m.lon, m.lat); showChoke(m) } });
  }
  window.showTankers = showTankers;
  async function load() { try { const j = await (await getData("tankers", "tankers.json")).json(); if (j && j.pts) { window.TNK = j; window.renderHealth && renderHealth() } } catch (e) {} }
  later(load, 2500); setInterval(load, 60 * 6e4);
  window.CMD_FN = (window.CMD_FN || []).concat([["TANKER", "Tanker rates (VLCC, Suezmax, Aframax, product)", "tanker tankers vlcc suezmax aframax lr2 mr freight charter rates shipping td3c bwet frontline", () => showTankers()]]);
})();
