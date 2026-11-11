/* ---- Report recaps (built by the alert engine, state/recaps.json): what a scheduled report said and how markets reacted ---- */
(() => {
  window.RCP = null;
  const dayT = t => new Date(t * 1000).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "Europe/London" });
  const timeT = t => new Date(t * 1000).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Europe/London" });
  const mvTxt = m => m.bp != null ? `${m.bp >= 0 ? "+" : "−"}${Math.abs(m.bp).toFixed(0)} bp` : `${m.ch >= 0 ? "+" : "−"}${Math.abs(m.ch).toFixed(1)}%`;
  const mvCol = m => { const v = m.bp != null ? m.bp : m.ch; return v >= 0 ? "var(--up)" : "var(--dn)" };
  const zTxt = m => m.z == null ? "" : m.z >= 1.5 ? `${m.z.toFixed(1)}× a normal day: big` : m.z >= 1 ? `${m.z.toFixed(1)}× a normal day` : "an ordinary day's move";
  const list = () => (RCP && RCP.r) || [];
  const onBoard = s => typeof MKG != "undefined" && MKG.some(g => g[1].some(x => x[0] == s));

  function showRecap(r) {
    if (typeof r == "string") r = list().find(x => x.id == r);
    if (!r) return;
    const runs = [];
    const row = (h, fn) => { if (!fn) return h; runs.push(fn); return h.replace("<div class=\"row\"", `<div class="row" style="cursor:pointer" data-rr="${runs.length - 1}"`) };
    info(`<h2>📋 ${esc(r.n)} recap</h2><div class="note" style="margin:-4px 0 8px">${dayT(r.t)}, released ${timeT(r.t)} UK · reaction measured at the close${r.final ? "" : " (provisional until tonight's settlement)"}</div>
<div class="syn">${esc(r.sum)}</div>
<div class="kh">How markets reacted (close vs the day before)</div>
${r.mv.map(m => row(`<div class="row"><span>${esc(m.n)}<small class="dn2" style="display:block">${zTxt(m)}</small></span><b style="color:${mvCol(m)}">${mvTxt(m)}${onBoard(m.s) ? " ›" : ""}</b></div>`, onBoard(m.s) ? () => mkShow(m.s) : null)).join("")}
${(r.usda || []).length ? `<div class="kh">What USDA changed vs last month</div>${r.usda.map(u => row(`<div class="row"><span>${esc(u.lab || u.what)}<small class="dn2" style="display:block">${esc(u.my)}</small></span><b>${esc(u.txt)}<small class="dn2" style="display:block;text-align:right">${u.pc >= 0 ? "+" : "−"}${Math.abs(u.pc).toFixed(1)}%</small></b></div>`, typeof openSup == "function" ? () => openSup() : null)).join("")}` : ""}
${(r.news || []).length ? `<div class="kh">What the headlines said</div>${r.news.map(n => `<a class="bsn" href="${esc(safeU(n.u))}" target="_blank" rel="noopener">${esc(n.t)} <small>${esc(n.s)}</small></a>`).join("")}` : ""}
<div class="note">The move is each market's settlement on the report day against the day before, compared with its normal daily move over the last 60 days. Report-day moves show how much the numbers surprised traders: the bigger the multiple, the bigger the surprise. Analysts' pre-report estimates aren't published as free data, so the headlines are the place to see what was expected.${(r.usda || []).length ? " USDA changes come from USDA's own database, so they include US and world numbers for the newest season." : ""}</div>
${list().length > 1 ? `<div class="row" style="cursor:pointer" data-all="1"><span>All recent report recaps</span><b>${list().length} ›</b></div>` : ""}`);
    document.querySelectorAll("#panel [data-rr]").forEach(el => el.onclick = () => runs[+el.dataset.rr]());
    document.querySelectorAll("#panel [data-all]").forEach(el => el.onclick = openRecaps);
  }
  function openRecaps() {
    const L = list();
    info(`<h2>Report recaps</h2><div class="note" style="margin:-4px 0 8px">What each big scheduled report did to markets, last 60 days</div>
${L.length ? L.map((r, i) => { const m = r.mv[0]; return `<div class="row" style="cursor:pointer" data-i="${i}"><span>${esc(r.n)} · ${dayT(r.t)}<small class="dn2" style="display:block">${esc(r.sum.split(". ")[0])}</small></span><b>${m ? `<span style="color:${mvCol(m)}">${esc(m.n)} ${mvTxt(m)}</span>` : ""} ›</b></div>` }).join("") : '<div class="note">The first recap appears after the next big report (WASDE, CPI, Fed, OPEC+ or the weekly EIA numbers) once markets have closed.</div>'}
<div class="note">Built after each report once US markets close (about 19:45 UK). You also get it on Telegram: always for WASDE, CPI, the Fed and OPEC+, and for the weekly EIA reports only when prices moved more than usual.</div>`);
    document.querySelectorAll("#panel [data-i]").forEach(el => el.onclick = () => showRecap(L[+el.dataset.i]));
  }
  window.showRecap = showRecap; window.openRecaps = openRecaps;

  /* recaps from the last 7 days, for other views */
  const recent = (d = 7) => list().filter(r => Date.now() / 1000 - r.t < d * 864e2);
  window.rcRecent = recent;
  window.rcWatch = () => recent(2).map(r => ({ t: `${r.n} recap: ${r.sum.split(". ")[0]}`, run: () => showRecap(r), sev: r.mv.some(m => (m.z || 0) >= 1.5) ? 2 : 1 }));
  window.rcCrop = c => {      // row in a commodity's panel
    if (!c || !c.sym) return "";
    const r = recent(10).find(x => x.mv.some(m => m.s == c.sym)); if (!r) return "";
    const m = r.mv.find(x => x.s == c.sym);
    return `<div class="row" style="cursor:pointer" onclick="showRecap('${esc(r.id)}')"><span>📋 ${esc(r.n)} ${dayT(r.t)}</span><b style="color:${mvCol(m)}">${mvTxt(m)} on the day ›</b></div>`;
  };

  /* recaps block at the top of the calendar (panel on phone, side column on desktop) */
  if (typeof calBody == "function") {
    const orig = calBody;
    window.calBody = function (container, days) {
      orig(container, days);
      const R = recent(7); if (!R.length) return;
      const bx = document.createElement("div"); bx.className = "rcb";
      bx.innerHTML = `<div class="kh">Recent reports: what happened</div>` + R.slice(0, 4).map(r => { const m = r.mv[0]; return `<div class="evr rcr" data-id="${esc(r.id)}"><b>📋 ${esc(r.n)} · ${dayT(r.t)}</b><small>${m ? `${esc(m.n)} ${mvTxt(m)}` : ""}${r.mv[1] ? ` · ${esc(r.mv[1].n)} ${mvTxt(r.mv[1])}` : ""} · tap for the recap</small></div>` }).join("");
      bx.querySelectorAll("[data-id]").forEach(el => el.onclick = ev => { ev.stopPropagation(); showRecap(el.dataset.id) });
      const seg = container.querySelector(".seg"); seg ? seg.after(bx) : container.prepend(bx);
    };
  }

  async function load() {
    try { const j = await (await getData("state", "recaps.json")).json(); if (j && j.r) { window.RCP = j; typeof ticker == "function" && ticker(); window.renderHealth && renderHealth() } } catch (e) {}
  }
  later(load, 2200); setInterval(load, 30 * 6e4);
  window.CMD_FN = (window.CMD_FN || []).concat([["RECAP", "Report recaps: what WASDE, CPI, Fed, OPEC+ and EIA did to markets", "recap wasde usda report results reaction cpi fed fomc opec eia what happened summary", () => openRecaps()]]);
})();
