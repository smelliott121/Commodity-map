/* ---- "Since you last looked": this device remembers a snapshot when you leave; next visit shows what changed ---- */
(() => {
  const KEY = "cm_since";
  const get = () => { try { return JSON.parse(localStorage.getItem(KEY) || "null") } catch (e) { return null } };
  const put = v => { try { localStorage.setItem(KEY, JSON.stringify(v)) } catch (e) {} };
  const prev = get();
  const ago = t => { const h = (Date.now() - t) / 36e5; return h < 1 ? Math.round(h * 60) + " min" : h < 36 ? Math.round(h) + " h" : Math.round(h / 24) + " days" };
  const syms = () => (typeof MKG != "undefined" ? MKG.flatMap(g => g[1]) : []);
  function snap() {
    if (typeof PX == "undefined" || !PX || !Object.keys(PX).length) return null;
    const px = {}; syms().forEach(s => { const q = PX[s[0]]; if (q && q.price) px[s[0]] = q.price });
    return { t: Date.now(), px,
      st: (typeof STM != "undefined" ? STM : []).map(s => s.name), eu: (window.EUS && EUS.lows || []).filter(l => l.name).map(l => l.name),
      rv: (window.HZ && HZ.rivers || []).map(r => [r.id, r.v.at(-1)]), sup: window.SUP && SUP.release, nw: Date.now(),
      ck: (typeof MK != "undefined" ? MK : []).filter(m => m.cs && m.cs.tot).map(m => [m.n, m.cs.tot.p]) };
  }
  let saveOK = false;
  const save = () => { if (!saveOK) return; const s = snap(); if (s) put(s) };
  addEventListener("visibilitychange", () => { if (document.visibilityState == "hidden") save() });
  addEventListener("pagehide", save);
  setInterval(save, 10 * 6e4);

  function changes() {
    if (!prev) return null;
    const out = { moves: [], storms: [], eu: [], rivers: [], news: [], other: [] };
    // biggest price moves since then, scaled by each market's normal daily move
    syms().forEach(s => { const q = PX[s[0]], p0 = prev.px && prev.px[s[0]]; if (!q || !q.price || !p0 || q.roll) return;
      const ch = (q.price / p0 - 1) * 100, vol = typeof dailyVol == "function" ? dailyVol(s[0]) : null, days = Math.max(1, (Date.now() - prev.t) / 864e5), z = vol ? Math.abs(ch) / (vol * Math.sqrt(days)) : Math.abs(ch) / 2;
      out.moves.push({ s: s[0], n: s[1], ch, z }) });
    out.moves.sort((a, b) => b.z - a.z);
    (typeof STM != "undefined" ? STM : []).forEach(s => { if (!(prev.st || []).includes(s.name)) out.storms.push(s) });
    (window.EUS && EUS.lows || []).filter(l => l.name && !(prev.eu || []).includes(l.name)).forEach(l => out.eu.push(l));
    (window.HZ && HZ.rivers || []).forEach(r => { const o = (prev.rv || []).find(x => x[0] == r.id); if (o && Math.abs(r.v.at(-1) - o[1]) >= (r.u == "cm" ? 15 : 2)) out.rivers.push({ r, d: r.v.at(-1) - o[1] }) });
    if (typeof NW != "undefined" && NW && NW.items) out.news = NW.items.filter(i => i.sc >= 6 && i.d * 1000 > prev.t).sort((a, b) => b.sc - a.sc).slice(0, 5);
    if (window.SUP && prev.sup && SUP.release != prev.sup) out.other.push({ t: `New USDA supply report (${SUP.release})`, run: () => typeof openSup == "function" && openSup() });
    (typeof MK != "undefined" ? MK : []).forEach(m => { const o = (prev.ck || []).find(x => x[0] == m.n); if (o && m.cs && m.cs.tot && Math.abs(m.cs.tot.p - o[1]) >= .25) out.other.push({ t: `${m.n}: traffic now ${(m.cs.tot.p * 100).toFixed(0)}% vs normal (was ${(o[1] * 100).toFixed(0)}%)`, run: () => typeof showChoke == "function" && showChoke(m) }) });
    if (window.APT) { const j = (APT.inc || []).filter(i => i.a == "JER" && Date.parse(i.d + "T23:59Z") > prev.t); if (j.length) out.other.push({ t: `Drones disrupted Jersey Airport on ${j.length} day${j.length > 1 ? "s" : ""}`, run: () => typeof showApt == "function" && showApt("JER") }) }
    return out;
  }
  function open() {
    const c = changes(); if (!c) return;
    const top = c.moves.filter(m => m.z >= 1.5).slice(0, 8), runs = [];
    const R = (t, sub, val, fn, col) => { runs.push(fn); return `<div class="row" style="cursor:pointer" data-r="${runs.length - 1}"><span>${t}${sub ? `<small class="dn2" style="display:block">${sub}</small>` : ""}</span><b${col ? ` style="color:${col}"` : ""}>${val}</b></div>` };
    let h = "";
    if (top.length) h += `<div class="kh">Biggest moves</div>` + top.map(m => R(esc(m.n), `${m.z.toFixed(1)}× a normal move for the time away`, `${m.ch >= 0 ? "+" : "−"}${Math.abs(m.ch).toFixed(1)}%`, () => mkShow(m.s), `var(--${m.ch >= 0 ? "up" : "dn"})`)).join("");
    if (c.storms.length || c.eu.length) h += `<div class="kh">New storms</div>` + c.storms.map(s => R(esc(s.name), esc(s.cls || ""), `${s.kt || ""} kt`, () => { panTo(s.lon, s.lat); typeof showStorm == "function" && showStorm(s) })).join("") + c.eu.map(l => R(`Storm ${esc(l.name)}`, "European windstorm", `${l.min.toFixed(0)} hPa`, () => typeof showEu == "function" && showEu(l))).join("");
    if (c.rivers.length) h += `<div class="kh">River levels</div>` + c.rivers.map(({ r, d }) => R(esc(r.n), "", `${d >= 0 ? "+" : "−"}${Math.abs(d).toFixed(r.u == "cm" ? 0 : 1)} ${r.u}`, () => typeof showRiver == "function" && showRiver(r))).join("");
    if (c.other.length) h += `<div class="kh">Also changed</div>` + c.other.map(o => R(esc(o.t), "", "›", o.run)).join("");
    if (c.news.length) h += `<div class="kh">Breaking news while you were away</div>` + c.news.map(i => `<a class="bsn" href="${esc(safeU(i.u))}" target="_blank" rel="noopener">${esc(i.t)} <small>${esc(i.s)}</small></a>`).join("");
    info(`<h2>Since you last looked</h2><div class="note" style="margin:-4px 0 8px">${ago(prev.t)} ago on this device</div>${h || '<div class="note">Nothing much has changed: no unusual price moves, new storms or alerts.</div>'}
<div class="note">Moves are compared with each market's normal swing over the time you were away, so a 3% move in a quiet market can rank above 5% in a volatile one.</div>`);
    document.querySelectorAll("#panel [data-r]").forEach(el => el.onclick = () => runs[+el.dataset.r]());
    btn && btn.classList.remove("hot");
  }
  window.openSince = open;

  /* top-bar button, shown when you've been away 4h+ */
  let btn = null;
  setTimeout(() => {
    saveOK = true;
    if (!prev || Date.now() - prev.t < 4 * 36e5) return;
    const c = changes(); const n = c ? c.moves.filter(m => m.z >= 1.5).length + c.storms.length + c.eu.length + c.rivers.length + c.other.length + c.news.length : 0;
    const tr = document.querySelector("#top .tr"); if (!tr) return;
    btn = document.createElement("button"); btn.className = "ib hot"; btn.id = "sinb"; btn.title = `Since you last looked (${ago(prev.t)} ago): ${n} change${n == 1 ? "" : "s"}`;
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v4h4"/><path d="M12 7v5l3 2"/></svg>`;
    btn.onclick = open;
    const b = document.getElementById("brb"); b ? b.after(btn) : tr.prepend(btn);
  }, 9000);   // after prices, storms and hazards have loaded
  window.CMD_FN = (window.CMD_FN || []).concat([["SINCE", "Since you last looked", "since last visit changes what changed away catch up", () => open()]]);
})();
