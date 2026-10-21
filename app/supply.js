/* ---- Supply outlook: USDA PSD projections (Update supply outlook job) + what our weather data says about them ---- */
(() => {
  window.SUP = null;
  const sg = (v, d = 1) => { const a = Math.abs(v).toFixed(d); return (+a == 0 ? "" : v >= 0 ? "+" : "−") + a };
  const HOME = { Coffee: "Brazil", Wheat: "Ukraine", "Palm oil": "Indonesia", Sugar: "India", Corn: "United States", Cotton: "United States", Soybeans: "Brazil", "Orange juice": "United States", Rice: "India" };
  const myL = m => `${m}/${String((m + 1) % 100).padStart(2, "0")}`;
  const sfx = u => /60 KG/i.test(u) ? "M bags" : /bales/i.test(u) ? "M bales" : /MT/i.test(u) ? " Mt" : "";
  const qty = (v, u) => v == null ? "—" : (v / 1000).toFixed(v >= 1e5 ? 0 : 1) + sfx(u);
  const relL = r => r ? new Date(r + "-15").toLocaleDateString("en-GB", { month: "short", year: "numeric" }) : "";
  const pct = (a, b) => a != null && b ? (a / b - 1) * 100 : null;

  function stuCtx(o) {
    const s = o.w.stu, n = s.length, cur = s[n - 1]; if (cur == null) return null;
    const past = s.slice(Math.max(0, n - 11), n - 1).filter(x => x != null), avg = past.length ? past.reduce((a, b) => a + b, 0) / past.length : null;
    let since = null, kind = null;
    for (let i = n - 2; i >= 0; i--) { if (s[i] == null) continue; if (s[i] <= cur) { since = o.my[i]; break } }
    if (since == null || o.my[n - 1] - since >= 5) kind = "low";
    if (kind != "low") { since = null; for (let i = n - 2; i >= 0; i--) { if (s[i] == null) continue; if (s[i] >= cur) { since = o.my[i]; break } } if (since == null || o.my[n - 1] - since >= 5) kind = "high" }
    const yrs = s.filter(x => x != null).length;
    const txt = kind == "low" ? (since ? `lowest since ${myL(since)}` : `lowest in ${yrs} years`) : kind == "high" ? (since ? `highest since ${myL(since)}` : `highest in ${yrs} years`) : "";
    return { cur, avg, d: avg != null ? cur - avg : null, txt, kind };
  }
  function revOf(o, label) {
    const L = o.rev && o.rev[`${label}|${o.my.at(-1)}`];
    if (!L || L.length < 2) return null;
    const a = L.at(-2), b = L.at(-1);
    return { p: pct(b[1], a[1]), at: b[0], from: a[0] };
  }
  /* which USDA market year today's weather in the map region actually affects (null = little effect right now) */
  const TGT = {
    Soybeans: (m, y) => m >= 9 ? y : m <= 3 ? y - 1 : null,            // Brazil: planted Sep-Dec, harvested Jan-Apr
    Coffee: (m, y) => m >= 6 ? y + 1 : m <= 3 ? y : y,                   // Brazil: flowering Sep-Nov sets next year's crop
    Wheat: (m, y) => m >= 9 ? y + 1 : m <= 6 ? y : null,                 // Ukraine winter wheat: sown autumn, harvested July
    Corn: (m, y) => m >= 4 && m <= 8 ? y : null,                         // US: planting to grain fill
    Cotton: (m, y) => m >= 5 && m <= 8 ? y : null,
    Sugar: (m, y) => m >= 6 && m <= 9 ? y : null,                        // India: monsoon grows the cane
    Rice: (m, y) => m >= 6 && m <= 9 ? y : null,                         // India kharif rice
    "Palm oil": (m, y) => y + 1,                                         // dry spells cut output 6-24 months later
  };
  function target(r) { const f = TGT[r.n], d = new Date(); return f ? f(d.getMonth() + 1, d.getFullYear()) : null }
  /* what the map's weather data says about the official estimate, in words */
  function lean(r) {
    const k = typeof wxRisk == "function" ? wxRisk(r) : null, so = r.soil, fr = typeof hzFrostFor == "function" ? hzFrostFor(r.n) : null;
    const dry = [], wet = []; let w = 0;
    if (so && so.pct <= -20) { dry.push(`soil ${sg(so.pct, 0)}% vs normal${so.rank == 0 ? ", driest in " + (so.n + 1) + " years" : so.rank == 1 ? ", 2nd driest in " + (so.n + 1) + " years" : ""}`); w += so.rank <= 1 ? 2 : 1 }
    if (k && k.rp != null && k.rx != null && k.rp < -.4 && k.rx < -.4) { dry.push("rain well below normal last week and next"); w += 1 }
    if (fr) { dry.push(`${fr.lvl == 2 ? "frost risk" : "frost watch"} ${fr.dayTxt}`); w += fr.lvl }
    if (k && k.tA != null && k.tA > 2.5) { dry.push(`${sg(k.tA)}°C hotter than normal`); w += 1 }
    if (so && so.pct >= 30) wet.push(`soil ${sg(so.pct, 0)}% vs normal`);
    if (k && k.rp != null && k.rx != null && k.rp > 1 && k.rx > .6) wet.push("very wet last week and next");
    const crit = k && k.lvl == 2, stage = k && k.stage ? k.stage : "", o = SUP && SUP.c[r.n], cur = o ? o.my.at(-1) : null, ty = target(r);
    const base = { stage, ty, next: ty != null && cur != null && ty > cur };
    if (ty == null) return { ...base, dir: 0, why: [], txt: "Off-season: weather has little effect on output now", off: true };
    const which = base.next ? `the ${myL(ty)} crop (not forecast yet)` : `this estimate`;
    if (w >= 1) return { ...base, dir: -1, strong: w >= 2 && crit, why: dry, txt: `Leans below ${which}${w >= 2 && crit ? ", clearly" : ""}` };
    if (wet.length) return { ...base, dir: 0, why: wet, txt: /harvest/i.test(stage) ? "Wet at harvest: delays and quality risk" : `Wet: usually fine for ${which}` };
    return { ...base, dir: 0, why: [], txt: `No strong weather signal for ${which}` };
  }
  window.supLean = lean;

  window.supHTML = r => {
    const o = SUP && SUP.c[r.n]; if (!o) return "";
    const n = o.my.length, cur = o.my[n - 1], u = o.unit, wp = o.w.prod, st = stuCtx(o), home = HOME[r.n], hc = o.ctry[home], hp = hc && hc.Production;
    const rv = revOf(o, "World production"), rh = home && revOf(o, home + " production"), L = lean(r);
    const ctryRows = Object.entries(o.ctry).filter(([, v]) => v.Production).map(([c, v]) => { const a = v.Production[n - 2], b = v.Production[n - 1], p = pct(b, a); return `<div class="row"><span>${esc(c)}</span><b>${qty(b, u)} <small class="${p == null ? "" : p >= 0 ? "up" : "dn"}">${p == null ? "" : sg(p) + "% y/y"}</small></b></div>` }).join("");
    return `<div class="kh" id="sup">Supply outlook · USDA ${relL(SUP.release)} report</div>
<div class="tgrid"><div><span class="note" style="margin:0">World output ${myL(cur)}</span><b>${qty(wp[n - 1], u)}</b><small>${pct(wp[n - 1], wp[n - 2]) == null ? "" : sg(pct(wp[n - 1], wp[n - 2])) + "% y/y"}</small></div>
<div><span class="note" style="margin:0">Stocks-to-use</span><b class="${st && st.kind == "low" ? "dn" : st && st.kind == "high" ? "up" : ""}">${st ? st.cur.toFixed(1) + "%" : "—"}</b><small>${st && st.d != null ? sg(st.d) + " pts vs 10-yr avg" : ""}</small></div>
<div><span class="note" style="margin:0">${esc(home || "Main producer")}</span><b>${hp ? qty(hp[n - 1], u) : "—"}</b><small>${hp && pct(hp[n - 1], hp[n - 2]) != null ? sg(pct(hp[n - 1], hp[n - 2])) + "% y/y" : ""}</small></div></div>
${st && st.txt ? `<div class="row"><span>World stocks vs use</span><b class="wrap ${st.kind == "low" ? "dn" : "up"}">${st.txt}${st.kind == "low" ? ": tight, supports prices" : ": ample, weighs on prices"}</b></div>` : ""}
<div class="row"><span>Last USDA revision</span><b class="wrap">${rv ? `World ${sg(rv.p)}%${rh ? `, ${esc(home)} ${sg(rh.p)}%` : ""} (${relL(rv.at)})` : "Tracked from the next report"}</b></div>
<div class="row"><span>Our weather vs this estimate</span><b class="wrap ${L.dir < 0 ? "dn" : ""}">${esc(L.txt)}</b></div>
${L.why.length || L.stage ? `<div class="note" style="margin-top:2px">${L.why.length ? esc(home) + ": " + esc(L.why.join("; ")) + ". " : ""}${L.stage ? "Crop stage now: " + esc(L.stage.toLowerCase()) + "." : ""}</div>` : ""}
<div class="ukl" style="margin-top:8px"><span><i style="background:var(--amb)"></i>World stocks-to-use</span><span><i style="background:var(--mut)"></i>10-yr average</span></div><div class="ukc2" id="supc"></div>
${ctryRows ? `<div class="kh">Main producers, ${myL(cur)} vs ${myL(cur - 1)}</div>${ctryRows}` : ""}
<div class="note">USDA's projection for the ${myL(cur)} season (market years run differently by country). Stocks-to-use = stocks left at the end of the season ÷ a year's use: the lower it is, the less buffer against a crop problem, so prices react more. "Our weather" compares the map's soil, rain and frost data with what's normal; it says which way the official number is more likely to be revised, not by how much.</div>`;
  };
  window.supDraw = r => {
    const o = SUP && SUP.c[r.n], box = $("#supc"); if (!o || !box) return;
    const s = o.w.stu, T = o.my.map(m => Date.UTC(m, 6, 1)), past = s.slice(-11, -1).filter(x => x != null), avg = past.length ? past.reduce((a, b) => a + b, 0) / past.length : null;
    tsChart(box, { t: T, h: 130, series: [{ n: "Stocks-to-use", c: "var(--amb)", v: s }], ref: avg, fmt: v => v.toFixed(1) + "%", tk: v => v + "%", lab: t => myL(new Date(t).getUTCFullYear()) });
  };

  /* Supply tab on the markets board */
  function renderSup(el) {
    const L = R.map((r, i) => ({ r, i, o: SUP && SUP.c[r.n] })).filter(x => x.o);
    const rows = L.map(({ r, i, o }) => {
      const n = o.my.length, p = pct(o.w.prod[n - 1], o.w.prod[n - 2]), st = stuCtx(o), ln = lean(r), rv = revOf(o, "World production");
      return `<div class="mkr spr" data-ri="${i}"><span>${esc(r.n)}<small>${myL(o.my[n - 1])}${rv ? ` · rev ${sg(rv.p)}%` : ""}</small></span>
<span class="cg" style="color:var(--${p == null ? "mut" : p >= 0 ? "up" : "dn"})">${p == null ? "—" : sg(p) + "%"}</span>
<span class="spst ${st && st.kind == "low" ? "dn" : st && st.kind == "high" ? "up" : ""}" title="${esc(st && st.txt || "")}">${st ? st.cur.toFixed(0) + "%" : "—"}<small>${st && st.d != null ? sg(st.d, 0) : ""}</small></span>
<span class="spl ${ln.dir < 0 ? "dn" : ""}" title="${esc(ln.txt + (ln.why.length ? ": " + ln.why.join("; ") : ""))}">${ln.off ? "off-season" : (ln.dir < 0 ? (ln.strong ? "▼▼" : "▼") : ln.why.length ? "wet" : "ok") + (ln.next ? " " + String(ln.ty % 100).padStart(2, "0") + "/" + String((ln.ty + 1) % 100).padStart(2, "0") : "")}</span></div>` }).join("");
    el.innerHTML = `${mkHead("sup")}<div class="mkt"><div class="mkr spr mkhd"><span>Crop · season</span><span style="text-align:right" title="World production vs last season">Output</span><span style="text-align:right" title="World stocks-to-use, and points vs 10-yr average">Stocks/use</span><span style="text-align:right" title="What our weather data says about the estimate">Weather</span></div>
${rows || '<div class="note" style="padding:16px">Loads after the Update supply outlook job runs.</div>'}</div>
<div class="mkf"><b>How to read it.</b> Output: USDA's world production forecast vs last season. Stocks/use: how much is left at season end compared with a year's use, with the gap to the 10-year average below it; red means unusually tight (prices more sensitive to bad news), green unusually comfortable. Weather: ▼ means our soil, rain or frost data points to a smaller crop than USDA expects; ▼▼ when the signal is strong at a critical crop stage. A season label (e.g. 27/28) means today's weather is shaping next season's crop, which USDA hasn't forecast yet; "off-season" means weather matters little right now. "rev" is how much USDA changed its world estimate at the last monthly report. Tap a crop for the full outlook. ${SUP ? "USDA " + relL(SUP.release) + " report." : ""} No cocoa: USDA doesn't cover it.</div>`;
    $("#mkx").onclick = () => mkOpen(false);
    el.querySelectorAll("[data-tab]").forEach(b => b.onclick = () => { window.MKTAB = b.dataset.tab; mkBoard() });
    el.querySelectorAll("[data-ri]").forEach(d => d.onclick = () => { const i = +d.dataset.ri; show(i); typeof panTo == "function" && panTo(R[i].lon, R[i].lat); el.querySelectorAll("[data-ri]").forEach(x => x.classList.toggle("sel", x == d)); setTimeout(() => { const p = $("#panel"), s = document.querySelector("#panel #sup"); if (s) p.scrollTo({ top: s.offsetTop - 50, behavior: "smooth" }) }, 250) });
  }
  window.renderSup = renderSup;
  window.openSup = () => { window.MKTAB = "sup"; mkOpen(true) };

  /* brief: tight balances and weather pointing against the estimate */
  window.supWatch = () => {
    const out = [];
    R.forEach((r, i) => {
      const o = SUP && SUP.c[r.n]; if (!o) return;
      const st = stuCtx(o), ln = lean(r), go = () => { show(i); setTimeout(() => { const p = $("#panel"), s = document.querySelector("#panel #sup"); if (s) p.scrollTo({ top: s.offsetTop - 50 }) }, 250) };
      if (ln.dir < 0 && ln.strong) out.push({ t: ln.next ? `${r.n}: weather is setting up a smaller ${myL(ln.ty)} ${HOME[r.n]} crop (${ln.why[0]})` : `${r.n}: our weather points below USDA's ${HOME[r.n]} estimate (${ln.why[0]})`, run: go, sev: 2 });
      else if (st && st.kind == "low") out.push({ t: `${r.n}: world stocks-to-use ${st.cur.toFixed(1)}%, ${st.txt}`, run: go, sev: 1 });
    });
    return out;
  };

  async function load() { try { const j = await (await getData("supply", "supply.json")).json(); if (j && j.c) { window.SUP = j; window.renderHealth && renderHealth(); if (document.body.classList.contains("mkopen") && window.MKTAB == "sup") mkBoard() } } catch (e) {} }
  later(load, 2200); setInterval(load, 3 * 36e5);

  window.CMD_FN = (window.CMD_FN || []).concat([["SUPPLY", "Supply outlook (USDA crop forecasts)", "supply usda wasde psd production stocks stocks-to-use harvest outlook forecast", () => window.openSup()]]);
})();
