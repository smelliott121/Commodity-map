/* ---- Fertiliser prices (World Bank Pink Sheet, monthly; Update fertiliser prices job) ---- */
(() => {
  window.FERT = null;
  const SER = [["urea", "Urea", "nitrogen · made from natural gas", "#4ea8f2"], ["dap", "DAP", "phosphate + nitrogen", "#ff8a3d"], ["potash", "Potash", "potassium chloride", "#d36cf0"], ["tsp", "TSP", "triple superphosphate", "#3fcf8e"], ["rock", "Phosphate rock", "raw input for DAP/TSP", "#9aa5ab"]];
  const pc = (a, b) => a != null && b ? (a / b - 1) * 100 : null;
  const sgn = v => v == null ? "—" : (v >= 0 ? "+" : "−") + Math.abs(v).toFixed(0) + "%";
  const mon = s => new Date(s + "-15").toLocaleDateString("en-GB", { month: "short", year: "numeric" });
  function stats(k) {
    const v = FERT.s[k] || [], n = v.length, last = v[n - 1];
    const past = v.slice(-121, -1).filter(x => x != null), avg = past.length ? past.reduce((a, b) => a + b, 0) / past.length : null;
    return { last, m1: pc(last, v[n - 2]), y1: pc(last, v[n - 13]), avg, vsAvg: pc(last, avg) };
  }
  function ratio(a, b) { const A = FERT.s[a] || [], B = FERT.s[b] || []; return A.map((x, i) => x != null && B[i] ? x / B[i] : null) }
  window.fertRows = () => {     // compact rows for the Supply tab
    if (!FERT) return "";
    return SER.slice(0, 3).map(([k, n]) => { const s = stats(k); return `<div class="mkr hzr" data-fert="1"><span>${esc(n)}<small>$/t · ${mon(FERT.d.at(-1))}</small></span><span class="hzv">$${Math.round(s.last)}</span><span class="hzc"><span style="color:var(--${(s.y1 || 0) >= 0 ? "up" : "dn"})">${sgn(s.y1)} y/y</span></span></div>` }).join("");
  };
  function showFert() {
    if (!FERT) return;
    const d = FERT.d, n = d.length, cut = Math.max(0, n - 72), T = d.slice(cut).map(x => Date.parse(x + "-15T00:00Z"));
    const r = ratio("urea", "maize"), rl = r.at(-1), rp = r.slice(-121, -1).filter(x => x != null), ra = rp.reduce((a, b) => a + b, 0) / rp.length;
    const g = stats("gas_eu");
    info(`<h2>Fertiliser prices</h2><div class="note" style="margin:-4px 0 8px">Monthly averages, World Bank Pink Sheet · latest ${mon(d.at(-1))}</div>
${SER.map(([k, nm, w, c]) => { if (!FERT.s[k]) return ""; const s = stats(k); return `<div class="row"><span><i class="tkdot" style="background:${c}"></i>${esc(nm)}<small class="dn2" style="display:block">${esc(w)}</small></span><b>$${Math.round(s.last)}/t<small class="dn2" style="display:block;text-align:right">${sgn(s.m1)} m/m · ${sgn(s.y1)} y/y · ${sgn(s.vsAvg)} vs 10-yr avg</small></b></div>` }).join("")}
<div class="kh">Last 6 years, $/tonne</div><div class="ukl">${SER.slice(0, 3).map(([, nm, , c]) => `<span><i style="background:${c}"></i>${esc(nm)}</span>`).join("")}</div><div class="ukc2" id="fertc"></div>
<div class="kh">Is it affordable for farmers?</div>
<div class="row"><span>Tonnes of corn to buy a tonne of urea</span><b class="${rl > ra * 1.15 ? "dn" : rl < ra * .85 ? "up" : ""}">${rl.toFixed(2)}<small class="dn2" style="display:block;text-align:right">10-yr average ${ra.toFixed(2)}</small></b></div>
<div class="row"><span>European gas (TTF, monthly)</span><b>$${g.last.toFixed(1)}/MMBtu<small class="dn2" style="display:block;text-align:right">${sgn(g.y1)} y/y</small></b></div>
<div class="note">Urea is made from natural gas, so it follows gas prices (especially Europe's) with a lag. When fertiliser is expensive relative to crop prices, farmers apply less or switch to crops that need less (soybeans need almost no nitrogen, corn needs a lot), which feeds into next season's yields and planted area. Potash and phosphate are mined and dominated by a few exporters (Canada, Russia, Belarus, Morocco, China), so sanctions and export curbs move them.</div>`);
    setTimeout(() => { const box = $("#fertc"); box && tsChart(box, { t: T, h: 150, series: SER.slice(0, 3).map(([k, nm, , c]) => ({ n: nm, c, v: (FERT.s[k] || []).slice(cut) })), fmt: v => "$" + Math.round(v), lab: t => new Date(t).toLocaleDateString("en-GB", { month: "short", year: "numeric" }) }) }, 0);
  }
  window.showFert = showFert;
  async function load() { try { const j = await (await getData("fertiliser", "fertiliser.json")).json(); if (j && j.s) { window.FERT = j; window.renderHealth && renderHealth() } } catch (e) {} }
  later(load, 2600);
  window.CMD_FN = (window.CMD_FN || []).concat([["FERT", "Fertiliser prices (urea, DAP, potash)", "fertiliser fertilizer urea dap potash phosphate nitrogen ammonia tsp", () => showFert()]]);
})();
