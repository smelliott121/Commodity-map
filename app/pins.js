/* ---- Pinned watch tiles: pin any commodity, market, chokepoint, UK power or refining panel as a live tile ---- */
(() => {
  const ls = (k, v) => { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v) } catch (e) { return null } };
  let P = []; try { P = JSON.parse(ls("cm_pins") || "[]") } catch (e) { P = [] }
  const save = () => ls("cm_pins", JSON.stringify(P));
  const key = p => p.t + ":" + p.k;
  const has = p => P.some(x => key(x) == key(p));
  const sg = v => (v >= 0 ? "+" : "−") + Math.abs(v).toFixed(Math.abs(v) < 10 ? 1 : 0);

  const strip = document.createElement("div");
  strip.id = "pins";
  strip.setAttribute("aria-label", "Pinned");
  document.body.appendChild(strip);

  function spark(v, up) {
    if (!v || v.length < 3) return "";
    const lo = Math.min(...v), hi = Math.max(...v), W = 54, H = 18;
    return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><path d="${v.map((t, i) => (i ? "L" : "M") + (i / (v.length - 1) * W).toFixed(1) + " " + (H - 2 - (hi > lo ? (t - lo) / (hi - lo) : .5) * (H - 4)).toFixed(1)).join("")}" fill="none" stroke="var(--${up ? "up" : "dn"})" stroke-width="1.4" vector-effect="non-scaling-stroke"/></svg>`;
  }
  function tile(p) {
    let name = p.k, val = "—", sub = "", sp = "", open = () => {};
    if (p.t == "c") {
      const i = R.findIndex(r => r.n == p.k), r = R[i]; if (!r) return null;
      name = r.n; open = () => show(i);
      if (r.p != null) val = f(r.p, r.p < 20 ? 2 : 0);
      if (r.ch != null && r.live) sub = `<i class="${r.ch >= 0 ? "up" : "dn"}">${sg(r.ch)}%</i>`;
      const q = r.sym && PX[r.sym]; if (q && q.c) { const v = q.c.slice(); v[v.length - 1] = q.price; sp = spark(v, v.at(-1) >= v[0]) }
      const wr = typeof wxRisk == "function" ? wxRisk(r) : null;
      if (wr && wr.score >= 4) sub += ` <i class="pwr" title="Weather risk ${wr.score}">wx ${wr.score.toFixed(0)}</i>`;
    } else if (p.t == "m") {
      const s = (typeof MKG != "undefined" ? MKG : []).flatMap(g => g[1]).find(x => x[0] == p.k); if (!s) return null;
      const o = mkRow(s); name = s[1]; open = () => mkShow(p.k);
      if (o) { val = pxf(o); if (o.d1 != null) sub = `<i class="${o.d1 >= 0 ? "up" : "dn"}">${o.y ? sg(o.d1).replace(/\.\d/, "") + "bp" : sg(o.d1) + "%"}</i>`; sp = spark(o.c.length ? [...o.c.slice(0, -1), o.p] : null, o.c.length ? o.p >= o.c[0] : true) }
    } else if (p.t == "k") {
      const m = MK.find(x => x.id == p.k || x.n == p.k); if (!m) return null;
      name = m.n.replace("Strait of ", ""); open = () => showChoke(m);
      if (m.cs) { val = Math.round(m.cs.tot.v) + " ships"; sub = m.cs.gap ? "no recent data" : `<i style="color:${CST[m.cs.lv][0]}">${sg(m.cs.tot.p * 100)}%</i> vs normal` }
    } else if (p.t == "uk") {
      name = "UK power"; open = () => showUK();
      if (typeof UK != "undefined" && UK) { const pr = ukPrice(), n = ukNow(); if (pr) val = "£" + Math.round(pr.p); if (n) sub = `<i style="color:var(--f-wind)">wind ${Math.round(n.o.wind)}%</i>` }
    } else if (p.t == "ref") {
      name = "3-2-1 crack"; open = () => showRef();
      const c = typeof crackNow == "function" ? crackNow() : null;
      if (c) { val = "$" + c.price.toFixed(1); sub = `<i class="${c.price >= c.prev ? "up" : "dn"}">${sg(c.price - c.prev)}</i>`; sp = spark(c.c, c.c.at(-1) >= c.c[0]) }
    } else return null;
    return { name, val, sub, sp, open };
  }
  function render() {
    strip.innerHTML = "";
    document.body.classList.toggle("haspins", P.length > 0);
    P.forEach((p, idx) => {
      const t = tile(p); if (!t) return;
      const d = document.createElement("div");
      d.className = "ptile"; d.tabIndex = 0;
      d.innerHTML = `<div class="ptop"><b>${esc(t.name)}</b><button class="px" aria-label="Unpin ${esc(t.name)}">×</button></div><div class="pmid"><span class="pval">${t.val}</span>${t.sp}</div><div class="psub">${t.sub}</div>`;
      d.onclick = e => { if (e.target.closest(".px")) { P.splice(idx, 1); save(); render(); syncBtn(); return } t.open() };
      d.onkeydown = e => { if (e.key == "Enter") t.open() };
      strip.appendChild(d);
    });
  }
  window.renderPins = render;

  /* pin button inside the detail panel */
  let cur = null;
  function syncBtn() {
    const b = document.getElementById("ppin"); if (!b || !cur) return;
    const on = has(cur); b.classList.toggle("on", on); b.title = on ? "Unpin" : "Pin as a live tile"; b.setAttribute("aria-pressed", on);
  }
  function addBtn(p) {
    cur = p;
    const pan = $("#panel"); if (!pan.classList.contains("open") || pan.querySelector("#ppin")) { syncBtn(); return }
    const b = document.createElement("button");
    b.id = "ppin"; b.className = "x pinb";
    b.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4h6l-1 6 4 4H6l4-4-1-6Z"/><path d="M12 14v7"/></svg>';
    b.onclick = () => { if (has(cur)) P = P.filter(x => key(x) != key(cur)); else { P.push(cur); if (P.length > 12) P.shift() } save(); render(); syncBtn() };
    pan.appendChild(b); syncBtn();
  }
  const wrapFn = (name, mk) => { const o = window[name]; if (typeof o != "function") return; window[name] = function (...a) { const r = o.apply(this, a); try { const p = mk(...a); if (p) addBtn(p) } catch (e) {} return r } };
  wrapFn("show", i => R[i] && { t: "c", k: R[i].n });
  wrapFn("mkShow", sym => sym == "CRACK" ? { t: "ref", k: "crack" } : R.some(r => r.sym == sym) ? null : { t: "m", k: sym });
  wrapFn("showChoke", m => ({ t: "k", k: m.id || m.n }));
  wrapFn("showUK", () => ({ t: "uk", k: "uk" }));
  wrapFn("showRef", () => ({ t: "ref", k: "crack" }));

  render();
  setInterval(render, 20000);
  setTimeout(render, 4000); setTimeout(render, 9000);
})();
