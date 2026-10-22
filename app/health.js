/* ---- Data health: how fresh each source is, shown in the Layers menu ---- */
(() => {
  const H = [
    ["Prices", () => typeof pT != "undefined" && pT, 1.5, true],
    ["Weather", () => typeof G != "undefined" && G && G.updated, 8],
    ["News", () => typeof NW != "undefined" && NW && NW.updated, 1.5],
    ["Storms", () => window.STU, 3],
    ["European storms", () => window.EUS && EUS.updated, 5],
    ["UK power", () => typeof UK != "undefined" && UK && UK.updated, 2],
    ["Futures curves", () => typeof CV != "undefined" && CV && CV.updated, 30, true],
    ["Shipping", () => typeof CK != "undefined" && CK && CK.updated, 30],
    ["Refining (EIA)", () => typeof RF != "undefined" && RF && RF.updated, 8 * 24],
    ["Positioning (CFTC)", () => typeof COT != "undefined" && COT && COT.updated, 9 * 24],
    ["El Niño", () => typeof EN != "undefined" && EN && EN.updated, 6 * 24],
    ["Rivers, frost, fires", () => window.HZ && HZ.updated, 7],
    ["Supply (USDA)", () => window.SUP && SUP.updated, 30, true],
  ];
  const wkend = () => { const d = new Date(), w = d.getUTCDay(); return w == 6 || w == 0 || (w == 1 && d.getUTCHours() < 6) };
  const age = t => { const m = Math.round((Date.now() / 1000 - t) / 60); return m < 60 ? m + "m" : m < 2880 ? Math.round(m / 60) + "h" : Math.round(m / 1440) + "d" };
  function render() {
    const el = document.getElementById("st"); if (!el) return;
    let bad = 0;
    const rows = H.map(([n, get, lim, mkt]) => {
      const t = get();
      if (!t) return `<span class="hr"><i class="hd hm"></i>${n}<b>—</b></span>`;
      const h = (Date.now() / 1000 - t) / 3600, slack = mkt && wkend() ? 72 : 0;
      const st = h <= lim + slack ? "ok" : h <= lim * 3 + slack ? "wa" : "ba";
      if (st == "ba") bad++;
      return `<span class="hr" title="${n}: updated ${age(t)} ago"><i class="hd ${st}"></i>${n}<b>${age(t)}</b></span>`;
    }).join("");
    el.innerHTML = `<div class="hh">Data freshness</div><div class="hg">${rows}</div>`;
    document.getElementById("lyb")?.classList.toggle("warn", bad > 0);
  }
  window.renderHealth = render;
  setTimeout(render, 3000); setTimeout(render, 9000); setInterval(render, 60000);
  document.getElementById("lyb")?.addEventListener("click", () => setTimeout(render, 0));
})();
