/* ---- Command bar: press / or Ctrl+K (or tap the search icon) and type ---- */
(() => {
  const SEC = { curve: "#cvs", curv: "#cvs", seas: "#sns", seasonal: "#sns", cot: "#cc", positioning: "#cc", news: ".nwl", chart: "#pc", price: "#pc", gp: "#pc" };
  const norm = s => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9=^.\- ]/g, " ").trim();
  function panTo(lon, lat) {
    const s = $("#scroll"), W = map.offsetWidth, H = map.offsetHeight;
    s.scrollTo({ left: (lon + 180) / 360 * W + map.offsetLeft - s.clientWidth / 2, top: (90 - lat) / 180 * H + map.offsetTop - s.clientHeight * (innerWidth >= 1000 ? .45 : .3), behavior: "smooth" });
  }
  function goSec(sel) {
    if (!sel) return;
    let n = 0;
    const t = setInterval(() => {
      const el = document.querySelector("#panel " + sel), p = $("#panel");
      if (el || ++n > 25) {
        clearInterval(t);
        if (el) p.scrollTo({ top: Math.max(0, el.getBoundingClientRect().top - p.getBoundingClientRect().top + p.scrollTop - 48), behavior: "smooth" });
      }
    }, 80);
  }
  const layerOn = k => { if (map.classList.contains("off-" + k)) { const b = document.querySelector(`#tg button[data-k="${k}"]`); b ? b.click() : map.classList.remove("off-" + k) } };
  const wxMode = k => { const b = document.querySelector(`#wxm button[data-k="${k}"]`); if (b && !b.classList.contains("on")) b.click() };

  function items() {
    const L = [];
    R.forEach((r, i) => L.push({ t: r.n, s: r.loc + (r.sym ? " · " + r.sym : ""), k: [r.n, r.loc, r.sym || "", (r.sym || "").replace("=F", "")].join(" "), g: "Commodity",
      run: sec => { show(i); document.querySelectorAll(".pin").forEach(x => x.classList.remove("sel")); const pin = document.querySelectorAll(".pin")[i]; pin && pin.classList.add("sel"); panTo(r.lon, r.lat); layout(); goSec(SEC[sec]) } }));
    (typeof MKG != "undefined" ? MKG : []).forEach(([grp, rows]) => rows.forEach(s => {
      if (R.some(r => r.sym == s[0])) return;
      L.push({ t: s[1], s: grp + " · " + s[0].replace("=F", ""), k: [s[1], s[0], s[0].replace("=F", "").replace("^", ""), grp].join(" "), g: "Market",
        run: sec => { if (typeof mkShow == "function") { mkShow(s[0]); goSec(SEC[sec]) } } });
    }));
    MK.forEach(m => L.push({ t: m.n, s: m.k == "choke" ? "Chokepoint · shipping traffic" : "Port", k: m.n + " " + (m.k == "choke" ? "chokepoint strait canal shipping" : "port"), g: m.k == "choke" ? "Chokepoint" : "Port",
      run: () => { panTo(m.lon, m.lat); m.k == "choke" && typeof showChoke == "function" ? showChoke(m) : m.el && m.el.click() } }));
    (typeof REFS != "undefined" ? REFS : []).forEach(r => L.push({ t: r[0], s: `Refinery · ~${r[3].toLocaleString("en")} kb/d`, k: r[0] + " refinery " + r[4], g: "Refinery",
      run: () => { panTo(r[2], r[1]); showRef({ n: r[0], cap: r[3], w: r[4] }) } }));
    (typeof QK != "undefined" ? QK : []).filter(q => q.properties.mag >= 5.5).forEach(q => {
      const p = q.properties, [lon, lat] = q.geometry.coordinates;
      L.push({ t: `M${p.mag.toFixed(1)} earthquake`, s: (p.place || "") + " · " + ago(p.time / 1000), k: "quake earthquake " + (p.place || ""), g: "Earthquake", run: () => { layerOn("quake"); panTo(lon, lat); showQuake(q) } });
    });
    (typeof STM != "undefined" && STM ? STM : []).forEach(s => L.push({ t: s.name, s: "Tropical storm · " + s.kt + " kt", k: "storm hurricane typhoon cyclone " + s.name, g: "Storm", run: () => { panTo(s.lon, s.lat); showStorm(s) } }));
    const F = [
      ["BRIEF", "Today's briefing", "what changed brief morning summary", () => typeof openBrief == "function" && openBrief()],
      ["RISK", "Weather risk scoreboard", "weather risk crops scoreboard", () => typeof openRisk == "function" && openRisk()],
      ["MKT", "Markets board", "markets board prices futures bonds indices", () => mkOpen(true)],
      ["NEWS", "Market news", "news headlines breaking", () => openNews("all")],
      ["CAL", "Market calendar", "calendar events holidays wasde fed cpi eia", () => openCal()],
      ["UK", "UK power and gas", "uk energy power electricity wind gas lng storage", () => { panTo(-2.5, 54.6); showUK() }],
      ["REF", "Refining and crack spread", "refining crack spread refinery eia utilisation stocks", () => showRef()],
      ["ENSO", "El Niño / La Niña", "enso el nino la nina pacific", () => typeof showEnso == "function" && showEnso()],
      ["QUAKE", "Earthquakes this week", "quakes earthquakes seismic fault", () => { layerOn("quake"); quakeList() }],
      ["KEY", "Line key", "key legend lanes pipelines", () => openKey()],
      ["RAIN", "Show rain", "weather rain precipitation", () => wxMode("p")],
      ["TEMP", "Show temperature", "weather temperature heat", () => wxMode("t")],
      ["WIND", "Show wind", "weather wind", () => wxMode("w")],
      ["WXOFF", "Weather layer off", "weather off clear", () => wxMode("off")],
      ["SAT", "Satellite image", "satellite clouds nasa imagery", () => typeof toggleSat == "function" && toggleSat()],
      ["THEME", "Switch light or dark", "theme light dark mode", () => $("#thb").click()],
    ];
    F.forEach(([c, t, k, run]) => L.push({ t, s: c, k: c + " " + k, g: "Function", code: c.toLowerCase(), run }));
    return L;
  }

  function quakeList() {
    const Q = (typeof QK != "undefined" ? QK : []).slice().sort((a, b) => b.properties.mag - a.properties.mag).slice(0, 25);
    info(`<h2>Earthquakes this week</h2>${Q.length ? Q.map((q, i) => { const p = q.properties; return `<div class="row" style="cursor:pointer" data-q="${i}"><span>M${p.mag.toFixed(1)} · ${esc(p.place || "")}<small class="dn2">${ago(p.time / 1000)}${p.alert ? " · USGS " + p.alert : ""}</small></span><b>›</b></div>` }).join("") : '<div class="note">No data yet.</div>'}<div class="note">Magnitude 4.5 and above, last 7 days, from USGS.</div>`);
    document.querySelectorAll("#panel [data-q]").forEach(el => el.onclick = () => { const q = Q[+el.dataset.q], [lon, lat] = q.geometry.coordinates; panTo(lon, lat); showQuake(q) });
  }
  window.quakeList = quakeList;

  function search(q) {
    const words = norm(q).split(/\s+/).filter(Boolean);
    if (!words.length) return [];
    let sec = null;
    if (words.length > 1) { const lw = words.at(-1), hit = SEC[lw] ? lw : lw.length >= 2 ? Object.keys(SEC).find(k => k.startsWith(lw)) : null; if (hit) { words.pop(); sec = hit } }
    const all = items(), out = [];
    for (const it of all) {
      const key = norm(it.t + " " + it.k), toks = key.split(/\s+/);
      let sc = 0, ok = true;
      for (const w of words) {
        if (toks.includes(w)) sc += 3;
        else if (toks.some(t => t.startsWith(w))) sc += 2;
        else if (key.includes(w)) sc += 1;
        else { ok = false; break }
      }
      if (!ok) continue;
      if (it.code && it.code == words.join("")) sc += 10;
      if (norm(it.t).startsWith(words.join(" "))) sc += 3;
      if (it.g == "Commodity") sc += 1;
      out.push({ it, sc });
    }
    return out.sort((a, b) => b.sc - a.sc).slice(0, 9).map(x => ({ ...x.it, sec }));
  }

  const el = document.createElement("div");
  el.id = "cmd";
  el.innerHTML = `<div class="cmdbox gl2" role="dialog" aria-label="Command bar"><div class="cmdin"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><input id="cmdq" autocomplete="off" spellcheck="false" placeholder="Search markets, places, functions…" aria-label="Search"><kbd>Esc</kbd></div><div id="cmdr" role="listbox"></div></div>`;
  document.body.appendChild(el);
  const inp = $("#cmdq"), res = $("#cmdr");
  let cur = [], sel = 0;
  const hint = `<div class="cmdh"><span>Try</span>${["cocoa curve", "hormuz", "CL", "wheat seas", "uk", "quake", "news", "risk", "brief"].map(x => `<button data-h="${x}">${x}</button>`).join("")}<p>Add <b>curve</b>, <b>seas</b>, <b>cot</b>, <b>news</b> or <b>chart</b> after a market to jump straight to that section.</p></div>`;
  function render() {
    if (!inp.value.trim()) { res.innerHTML = hint; res.querySelectorAll("[data-h]").forEach(b => b.onclick = () => { inp.value = b.dataset.h; render(); inp.focus() }); cur = []; return }
    cur = search(inp.value); sel = 0;
    res.innerHTML = cur.length ? cur.map((x, i) => `<div class="cmdi${i == sel ? " on" : ""}" role="option" data-i="${i}"><span class="cmdg">${esc(x.g)}</span><b>${esc(x.t)}</b><small>${esc(x.s)}${x.sec ? " · " + esc(x.sec) : ""}</small></div>`).join("") : `<div class="cmdh"><p>Nothing matches “${esc(inp.value)}”.</p></div>`;
    res.querySelectorAll(".cmdi").forEach(d => { d.onclick = () => go(+d.dataset.i); d.onmousemove = () => { sel = +d.dataset.i; mark() } });
  }
  const mark = () => res.querySelectorAll(".cmdi").forEach((d, i) => d.classList.toggle("on", i == sel));
  function go(i) { const x = cur[i]; if (!x) return; close(); x.run(x.sec) }
  function open() { el.classList.add("open"); inp.value = ""; render(); inp.focus(); setTimeout(() => inp.focus(), 30) }
  function close() { el.classList.remove("open"); inp.blur() }
  window.openCmd = open;
  inp.addEventListener("input", render);
  inp.addEventListener("keydown", e => {
    if (e.key == "ArrowDown") { sel = Math.min(cur.length - 1, sel + 1); mark(); e.preventDefault() }
    else if (e.key == "ArrowUp") { sel = Math.max(0, sel - 1); mark(); e.preventDefault() }
    else if (e.key == "Enter") { go(sel); e.preventDefault() }
    else if (e.key == "Escape") { close(); e.stopPropagation() }
  });
  el.addEventListener("pointerdown", e => { if (e.target == el) close() });
  addEventListener("keydown", e => {
    if (el.classList.contains("open")) return;
    if (e.target.closest && e.target.closest("input,textarea")) return;
    if (e.key == "/" || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() == "k")) { e.preventDefault(); open() }
  }, true);
  const b = document.createElement("button");
  b.className = "ib"; b.id = "cmdb"; b.title = "Search (press /)";
  b.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><span class="dsk">Search</span><kbd class="dsk">/</kbd>`;
  b.onclick = open;
  document.querySelector("#top .tr").prepend(b);
})();
