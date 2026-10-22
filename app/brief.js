/* ---- "What changed" briefing and weather-risk scoreboard ---- */
(() => {
  const ord = n => n + (n % 100 >= 11 && n % 100 <= 13 ? "th" : ["th", "st", "nd", "rd"][n % 10] || "th");
  const sg = (v, d = 1) => { const a = Math.abs(v).toFixed(d); return (+a == 0 ? "" : v >= 0 ? "+" : "−") + a };
  const ukd = () => new Date().toLocaleDateString("en-CA", { timeZone: "Europe/London" });
  const store = (k, v) => { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v) } catch (e) { return null } };

  /* typical daily move from 40 days of history */
  function dailyVol(sym) {
    const q = PX[sym], h = typeof HI != "undefined" && HI && HI.s[sym];
    const c = h ? h.c.slice(-41) : q && q.c ? q.c.slice() : null, r = []; if (!c) return null;
    for (let i = 1; i < c.length; i++) if (c[i] > 0 && c[i - 1] > 0) r.push(Math.log(c[i] / c[i - 1]));
    if (r.length < 15) return null;
    const mu = r.reduce((a, b) => a + b, 0) / r.length;
    return Math.sqrt(r.reduce((a, b) => a + (b - mu) ** 2, 0) / (r.length - 1)) * 100;
  }
  function cotPct(n) {
    const c = COT && COT.c[n]; if (!c || c.mm.length < 30) return null;
    const L = c.mm.at(-1), h = c.mm.slice(-156);
    return { L, pct: Math.round(h.filter(v => v < L).length / (h.length - 1) * 100) };
  }
  function curveState(sym) {
    const P = CV && sym && CV.c[sym.replace("=F", "")]; if (!P || P.length < 3) return null;
    const mo = s => +s.c.slice(1) * 12 + "FGHJKMNQUVXZ".indexOf(s.c[0]);
    let j = P.length - 1; for (let i = 1; i < P.length; i++) if (mo(P[i]) - mo(P[0]) >= 11) { j = i; break }
    const st = v => v < -1 ? "backwardation" : v > 1 ? "contango" : "flat";
    const now = (P[j].p / P[0].p - 1) * 100, then = P[0].m && P[j].m ? (P[j].m / P[0].m - 1) * 100 : null;
    return { now, then, s: st(now), was: then == null ? null : st(then) };
  }

  /* ---------- weather risk score (0-10) ---------- */
  function wxRisk(r) {
    if (r.nw && r.n != "Nat gas") return null;
    const w = r.w; if (!w) return { score: null, why: "No weather data" };
    const t = stg(r), lvl = t ? t[2] : 1, wt = [0.35, 0.7, 1][lvl] ?? .7, out = { lvl, stage: t ? t[1] : "", why: [] };
    let dry = 0, wet = 0, heat = 0, cold = 0, ens = 0;
    if (r.n == "Nat gas") {
      if (w.tn == null || r.ct == null) return { score: null, why: "No temperature normal yet" };
      const d = w.tn - r.ct, mo = new Date().getMonth() + 1, win = mo >= 10 || mo <= 3;
      if (win && d < 0) cold = Math.min(1, -d / 6) * 8; if (!win && d > 0 && mo >= 5 && mo <= 9) heat = Math.min(1, d / 5) * 7;
      out.tA = d; out.score = Math.round((cold + heat) * 10) / 10; if (out.score >= 2) out.why.push(cold ? `${sg(d)}°C colder than normal: heating demand` : `${sg(d)}°C hotter than normal: cooling demand`);
      return out;
    }
    const rp = r.cn >= 5 ? (w.past - r.cn) / r.cn : null, rx = r.cx >= 5 ? (w.next - r.cx) / r.cx : null;
    out.rp = rp; out.rx = rx; out.tA = w.tn != null && r.ct != null ? w.tn - r.ct : null;
    if (rp != null) { dry += Math.min(1, Math.max(0, -rp - .2) / .6) * 4; wet += Math.min(1, Math.max(0, rp - .6) / 1.4) * 4 }
    if (rx != null) { dry += Math.min(1, Math.max(0, -rx - .2) / .6) * 3; wet += Math.min(1, Math.max(0, rx - .6) / 1.4) * 2.5 }
    if (out.tA != null) heat = Math.min(1, Math.max(0, out.tA - 1.5) / 3) * 3;
    const so = r.soil; out.soil = so ? so.pct : null;
    if (so) { dry += Math.min(1, Math.max(0, -so.pct - 15) / 35) * 2; wet += Math.min(1, Math.max(0, so.pct - 25) / 40) * 1.5 }
    const fr = typeof hzFrostFor == "function" ? hzFrostFor(r.n) : null;
    if (fr) { cold = fr.lvl == 2 ? 6 : 2.5; out.frost = fr }
    if (typeof enPhase == "function" && enPhase() && typeof enRegionsFor == "function") {
      const m = new Date().getMonth() + 1, soon = [m, m % 12 + 1, (m + 1) % 12 + 1];
      const rs = enRegionsFor(r.lat, r.lon).filter(x => x.m.some(v => soon.includes(v)) && ["dry", "wet"].includes(effOf(x, enPhase())));
      if (rs.length) { ens = 1; out.enso = effTxt[effOf(rs[0], enPhase())] }
    }
    const raw = Math.max(dry, wet) + heat + cold + ens;
    out.score = Math.round(Math.min(10, raw * wt * 1.25) * 10) / 10;
    const rainTxt = [rp != null ? `${sg(rp * 100, 0)}% last week` : "", rx != null ? `${sg(rx * 100, 0)}% next week` : ""].filter(Boolean).join(", ") + " vs normal";
    if (dry > wet && dry >= 1.5) out.why.push(`${rp != null && rp > .2 && rx != null && rx < -.2 ? "turning dry" : "dry"}: rain ${rainTxt}`);
    if (wet > dry && wet >= 1.5) out.why.push(`${rx != null && rx > .6 && (rp == null || rp < .2) ? "turning wet" : "wet"}: rain ${rainTxt}`);
    if (so && (so.pct <= -20 || so.pct >= 30)) out.why.push(`soil ${sg(so.pct, 0)}% vs normal${so.rank == 0 ? " (driest in " + (so.n + 1) + " yrs)" : so.rank == so.n ? " (wettest in " + (so.n + 1) + " yrs)" : ""}`);
    if (fr) out.why.push(`${fr.lvl == 2 ? "frost risk" : "frost watch"}: ${fr.t.toFixed(0)}°C forecast ${fr.dayTxt} (${fr.n})`);
    if (heat >= 1) out.why.push(`${sg(out.tA)}°C hotter than normal next week`);
    if (ens) out.why.push(`El Niño/La Niña: typically ${out.enso} now`);
    if (lvl == 2 && out.why.length) out.why.push("critical crop stage");
    return out;
  }
  const rLvl = s => s == null ? ["", "—"] : s >= 6 ? ["sev", "Severe"] : s >= 4 ? ["ele", "Elevated"] : s >= 2 ? ["wat", "Watch"] : ["cal", "Calm"];
  window.wxRisk = wxRisk;

  /* ---------- stories ---------- */
  function stories() {
    const S = [];
    R.forEach((r, i) => {
      const why = []; let sc = 0;
      const vol = r.sym ? dailyVol(r.sym) : null;
      if (r.ch != null && r.live) {
        const z = vol ? Math.abs(r.ch) / vol : Math.abs(r.ch) / 2;
        if (z >= 1.5) { sc += Math.min(4, z); why.push(`${z.toFixed(1)}× a normal day's move`) }
      }
      const wr = wxRisk(r);
      if (wr && wr.score >= 3) { sc += wr.score / 2; why.push(...wr.why.filter(x => x != "critical crop stage").slice(0, 2).map(x => x[0].toUpperCase() + x.slice(1)) .concat(wr.lvl == 2 ? ["at a critical crop stage"] : [])) }
      const cp = cotPct(r.n);
      if (cp && (cp.pct >= 90 && cp.L > 0 || cp.pct <= 10 && cp.L < 0)) { sc += 1.5; why.push(`funds ${cp.L > 0 ? "crowded long" : "crowded short"} (${ord(cp.pct)} percentile of 3 years, squeeze risk)`) }
      const cs = curveState(r.sym);
      if (cs && cs.was && cs.was != cs.s && cs.s != "flat") { sc += 1.5; why.push(`curve flipped to ${cs.s} (was ${cs.was} a month ago)`) }
      if (r.st) { sc += 2; why.push(`storm ${r.st.n} ~${Math.round(r.st.d / 50) * 50} km from its path`) }
      if (typeof QK != "undefined") QK.forEach(q => { const p = q.properties, [lo, la] = q.geometry.coordinates; if (p.mag >= 6 && Date.now() - p.time < 2 * 864e5 && km(r.lat, r.lon, la, lo) < 350) { sc += 2; why.push(`M${p.mag.toFixed(1)} earthquake ${Math.round(km(r.lat, r.lon, la, lo))} km away`) } });
      let nn = [];
      if (NW) { nn = NW.items.filter(x => x.k.includes(r.n) && Date.now() / 1000 - x.d < 18 * 3600).sort((a, b) => (isBrk(b) - isBrk(a)) || b.d - a.d); if (nn.some(isBrk)) { sc += 2; why.push("breaking news") } }
      if (sc >= 1.5 || (r.ch != null && Math.abs(r.ch) >= 3 && r.live)) S.push({ kind: "c", i, r, sc: sc + (r.ch ? Math.abs(r.ch) / 10 : 0), why, news: nn.slice(0, 2) });
    });
    return S.sort((a, b) => b.sc - a.sc);
  }
  function watching() {
    const L = [];
    MK.forEach(m => { if (m.cs && m.cs.lv != "ok" && m.cs.lv != "gap") L.push({ t: `${m.n}: shipping traffic ${sg(m.cs.tot.p * 100, 0)}% vs normal`, run: () => showChoke(m), sev: m.cs.lv == "severe" ? 3 : 2 }) });
    (typeof STM != "undefined" && STM ? STM : []).forEach(s => L.push({ t: `Storm ${s.name}: ${s.kt} kt`, run: () => showStorm(s), sev: s.kt >= 64 ? 3 : 1 }));
    (typeof QK != "undefined" ? QK : []).filter(q => q.properties.mag >= 6 && Date.now() - q.properties.time < 3 * 864e5).forEach(q => L.push({ t: `M${q.properties.mag.toFixed(1)} earthquake: ${q.properties.place || ""}`, run: () => showQuake(q), sev: q.properties.alert == "orange" || q.properties.alert == "red" ? 3 : 1 }));
    if (typeof UK != "undefined" && UK) { const n = ukNow(), pr = ukPrice(); if (n && n.o.wind < 12) L.push({ t: `UK wind only ${Math.round(n.o.wind)}% of power: more gas burn`, run: showUK, sev: 2 }); if (pr && pr.p > 150) L.push({ t: `UK power price £${Math.round(pr.p)}/MWh`, run: showUK, sev: 2 }) }
    if (typeof crackNow == "function") { const c = crackNow(); if (c && c.c.length > 15) { const v = c.c, avg = v.reduce((a, b) => a + b, 0) / v.length; if (Math.abs(c.price - avg) / avg > .15) L.push({ t: `Refining margin $${c.price.toFixed(1)}/bbl, ${c.price > avg ? "well above" : "well below"} its month average`, run: () => showRef(), sev: 1 }) } }
    if (typeof hzWatch == "function") L.push(...hzWatch());
    if (typeof euWatch == "function") L.push(...euWatch());
    if (typeof supWatch == "function") L.push(...supWatch());
    if (typeof enPhase == "function" && enPhase()) L.push({ t: `${enPhase() > 0 ? "El Niño" : "La Niña"} conditions (${enStr(EN.roni.at(-1)[2])})`, run: showEnso, sev: 1 });
    return L.sort((a, b) => b.sev - a.sev);
  }
  function upcoming() {
    if (typeof EVS == "undefined") return [];
    const now = Date.now();
    return EVS.filter(e => e.t > now - 36e5 && e.t < now + 30 * 36e5).slice(0, 6);
  }

  function openBrief() {
    const S = stories().slice(0, 6), W = watching().slice(0, 6), U = upcoming();
    const card = s => {
      const r = s.r, ch = r.ch != null && r.live ? `<b class="${r.ch >= 0 ? "up" : "dn"}">${sg(r.ch)}%</b>` : "";
      return `<div class="bst" data-i="${s.i}"><div class="bsh"><span>${esc(r.n)}</span>${ch}</div>${s.why.length ? `<div class="bsw">${s.why.map(esc).join(" · ")}</div>` : ""}${s.news.map(x => `<a class="bsn" href="${esc(safeU(x.u))}" target="_blank" rel="noopener">${isBrk(x) ? '<span class="bk">⚡</span>' : ""}${esc(x.t)} <i>${esc(x.s)} · ${ago(x.d)}</i></a>`).join("")}</div>`;
    };
    const day = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", timeZone: "Europe/London" });
    info(`<h2>Today's briefing</h2><div class="note" style="margin:-4px 0 8px">${day} · built from prices, weather, positioning, curves and news on this map</div>
${S.length ? S.map(card).join("") : '<div class="note">Quiet: no market stands out on moves, weather, positioning or news right now.</div>'}
${W.length ? `<div class="kh">Also watching</div>${W.map((x, k) => `<div class="row bw" data-w="${k}" style="cursor:pointer"><span>${esc(x.t)}</span><b>›</b></div>`).join("")}` : ""}
${U.length ? `<div class="kh">Coming up (UK time)</div>${U.map(e => `<div class="row"><span>${esc(e.n)}</span><b>${fmtT(e)}</b></div>`).join("")}` : ""}
<div class="note">Ranked by how unusual each signal is: price move against its normal daily range, weather against normal at the current crop stage, crowded fund positioning, curve shape changes, storms, quakes and breaking news. A starting point, not a trading signal.</div>`);
    document.querySelectorAll("#panel .bst").forEach(el => el.onclick = e => { if (e.target.closest("a")) return; const i = +el.dataset.i; show(i); const pin = document.querySelectorAll(".pin")[i]; if (pin) { document.querySelectorAll(".pin").forEach(x => x.classList.remove("sel")); pin.classList.add("sel"); layout() } });
    document.querySelectorAll("#panel .bw").forEach(el => el.onclick = () => W[+el.dataset.w].run());
    store("cm_brief", ukd()); $("#brb") && $("#brb").classList.remove("hot");
  }
  window.openBrief = openBrief;

  /* ---------- weather risk board (tab in the Markets panel) ---------- */
  function renderRisk(el) {
    const rows = R.map((r, i) => ({ r, i, k: wxRisk(r) })).filter(x => x.k).sort((a, b) => (b.k.score ?? -1) - (a.k.score ?? -1));
    const pc = v => v == null ? '<span class="cg" style="color:var(--mut)">—</span>' : `<span class="cg" style="color:var(--${v >= 0 ? "wet" : "dry"});background:color-mix(in srgb,var(--${v >= 0 ? "wet" : "dry"}) ${Math.min(40, Math.abs(v) * 40).toFixed(0)}%,transparent)">${sg(v * 100, 0)}%</span>`;
    const tc = v => v == null ? '<span class="cg" style="color:var(--mut)">—</span>' : `<span class="cg" style="color:${v >= 0 ? "#ff8a5c" : "#7cc4ff"}">${sg(v)}°</span>`;
    const st = l => ['<i class="stl s0" title="little impact"></i>', '<i class="stl s1" title="moderate"></i>', '<i class="stl s2" title="critical"></i>'][l] || "";
    el.innerHTML = `${mkHead("risk")}
<div class="mkt"><div class="mkr rkr mkhd"><span>Crop</span><span title="crop stage">Stage</span><span style="text-align:right">Rain 7d</span><span style="text-align:right">Next 7d</span><span style="text-align:right">Temp</span><span style="text-align:right" title="soil moisture vs 10-year normal">Soil</span><span style="text-align:right">Risk</span></div>
${rows.map(({ r, i, k }) => { const L = rLvl(k.score); return `<div class="mkr rkr" data-ri="${i}" title="${esc((k.why && k.why.join ? k.why.join("; ") : k.why) || "")}"><span>${esc(r.n)}<small>${esc(r.loc.split(",")[0])}</small></span><span>${st(k.lvl)}</span>${pc(k.rp)}${pc(k.rx)}${tc(k.tA)}${pc(k.soil == null ? null : k.soil / 100)}<span class="rks ${L[0]}">${k.score == null ? "—" : k.score.toFixed(1)}</span></div>` }).join("")}</div>
<div class="mkf">Score 0–10 combines rain last week and the week ahead against the 15-year normal, soil moisture against the 10-year normal, temperature against normal, frost forecasts, El Niño/La Niña effects, weighted by how critical the crop stage is right now. Calm under 2, watch 2–4, elevated 4–6, severe 6+. Tap a row for the full panel.</div>`;
    $("#mkx").onclick = () => mkOpen(false);
    el.querySelectorAll("[data-tab]").forEach(b => b.onclick = () => { window.MKTAB = b.dataset.tab; mkBoard() });
    el.querySelectorAll("[data-ri]").forEach(d => d.onclick = () => { const i = +d.dataset.ri; show(i); el.querySelectorAll("[data-ri]").forEach(x => x.classList.toggle("sel", x == d)) });
  }
  window.renderRisk = renderRisk;
  window.openRisk = () => { window.MKTAB = "risk"; mkOpen(true) };

  /* top-bar button */
  const b = document.createElement("button");
  b.className = "ib"; b.id = "brb"; b.title = "Today's briefing";
  b.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/><circle cx="12" cy="12" r="4"/></svg><span class="dsk">Brief</span><i class="nd"></i>`;
  b.onclick = openBrief;
  const tr = document.querySelector("#top .tr"), cb = $("#cmdb");
  cb ? cb.after(b) : tr.prepend(b);
  if (store("cm_brief") != ukd()) b.classList.add("hot");
  /* desktop: open the briefing automatically once a day, after the data has loaded */
  if (innerWidth >= 1000 && store("cm_brief") != ukd()) setTimeout(() => { if (!$("#panel").classList.contains("open")) openBrief() }, 4500);
})();
