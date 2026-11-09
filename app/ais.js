/* ---- Live tankers (Update live tankers job, aisstream.io): tanker positions around the Gulf, Hormuz, the Red Sea and Suez, by ship size ---- */
(() => {
  window.AIS = null;
  const CL = [["VLCC", "#ff8a3d"], ["Suezmax", "#f2c94c"], ["Aframax/LR2", "#4ea8f2"], ["MR/LR1", "#3fcf8e"], ["Small tanker", "#b48cff"], ["Unknown size", "#9aa5ab"]];
  const col = c => (CL.find(x => x[0] == c) || CL[5])[1];
  const tg = document.getElementById("tg"), lg = tg && tg.querySelector(".lg");
  if (tg) { const b = document.createElement("button"); b.textContent = "Live tankers"; b.dataset.k = "ais"; b.onclick = () => { b.classList.toggle("off", map.classList.toggle("off-ais")); layout() }; lg ? tg.insertBefore(b, lg) : tg.appendChild(b) }
  const ukT = t => t ? new Date(t.replace(" ", "T") + (t.endsWith("Z") ? "" : "Z")).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Europe/London" }) + " UK" : "";
  function draw() {
    document.querySelectorAll(".mk.L-ais").forEach(e => e.remove());
    if (!AIS) return;
    (AIS.ships || []).forEach(s => {
      const e = document.createElement("div"); e.className = "mk L-ais"; e.style.left = X(s.lon) / 3.6 + "%"; e.style.top = Y(s.lat) / 1.8 + "%";
      const mv = (s.sog || 0) >= 3, rot = mv && s.cog != null ? s.cog : 0;
      e.innerHTML = mv ? `<i class="aisv" style="transform:rotate(${rot}deg);border-bottom-color:${col(s.c)}"></i>` : `<i class="aisa" style="background:${col(s.c)}"></i>`;
      e.title = `${s.n || "Tanker"} · ${s.c}${s.len ? " (" + s.len + " m)" : ""} · ${mv ? (s.sog || 0).toFixed(0) + " kn" : "stopped / anchored"}${s.dest ? " → " + s.dest : ""}`;
      e.onclick = ev => { ev.stopPropagation(); showShip(s) }; map.appendChild(e);
    });
    Object.entries(AIS.areas || {}).forEach(([a, [[la0, lo0], [la1, lo1]]]) => {
      const n = Object.values(AIS.counts[a] || {}).reduce((x, y) => x + y, 0);
      const e = document.createElement("div"); e.className = "mk L-ais aisc"; e.style.left = X(lo1) / 3.6 + "%"; e.style.top = Y(la1) / 1.8 + "%";
      e.innerHTML = `<b>${n} tanker${n == 1 ? "" : "s"}</b>`; e.title = a; e.onclick = ev => { ev.stopPropagation(); showArea(a) }; map.appendChild(e);
    });
    layout();
  }
  function showShip(s) {
    info(`<h2>${esc(s.n || "Tanker")}</h2>
<div class="row"><span>Size class</span><b style="color:${col(s.c)}">${esc(s.c)}${s.len ? ` · ${s.len} m long` : ""}</b></div>
<div class="row"><span>Speed / course</span><b>${(s.sog || 0) >= 3 ? `${(s.sog || 0).toFixed(1)} kn, heading ${Math.round(s.cog || 0)}°` : "Stopped or at anchor"}</b></div>
${s.dest ? `<div class="row"><span>Destination (as broadcast)</span><b>${esc(s.dest)}</b></div>` : ""}
${s.dr ? `<div class="row"><span>Draught</span><b>${s.dr} m${s.c == "VLCC" ? (s.dr >= 18 ? " · likely loaded" : s.dr <= 12 ? " · likely empty" : "") : ""}</b></div>` : ""}
<div class="row"><span>Area</span><b>${esc(s.a)}</b></div><div class="row"><span>Last position</span><b>${ukT(s.t)}</b></div>
<div class="note">From ships' own AIS position broadcasts, picked up by volunteer receivers (aisstream.io). Ships can switch AIS off or report false positions, which is common near Hormuz and for sanctioned "shadow fleet" tankers, so this shows ships that are broadcasting, not every ship.</div>`);
  }
  function showArea(a) {
    const C = AIS.counts[a] || {}, S = (AIS.ships || []).filter(s => s.a == a), H = (AIS.hist || []);
    const T = H.map(h => Date.parse(h.t + ":00Z")), big = H.map(h => { const c = h.c[a] || {}; return (c.VLCC || 0) + (c.Suezmax || 0) }), small = H.map(h => { const c = h.c[a] || {}; return (c["Aframax/LR2"] || 0) + (c["MR/LR1"] || 0) + (c["Small tanker"] || 0) });
    info(`<h2>${esc(a)}</h2><div class="note" style="margin:-4px 0 8px">Tankers broadcasting their position · sampled ${AIS ? new Date(AIS.updated * 1000).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Europe/London" }) + " UK" : ""}</div>
${CL.map(([c, k]) => `<div class="row"><span><i class="tkdot" style="background:${k}"></i>${esc(c)}</span><b>${C[c] || 0}</b></div>`).join("")}
<div class="row"><span>Under way (3 kn+)</span><b>${(AIS.moving || {})[a] || 0} of ${S.length}</b></div>
${H.length > 2 ? `<div class="kh">Large (VLCC + Suezmax) vs smaller tankers, each sample</div><div class="ukl"><span><i style="background:#ff8a3d"></i>VLCC + Suezmax</span><span><i style="background:#4ea8f2"></i>Aframax and smaller</span></div><div class="ukc2" id="aisc"></div>` : ""}
<div class="kh">Ships</div>${S.sort((x, y) => (y.len || 0) - (x.len || 0)).slice(0, 20).map((s, i) => `<div class="row" style="cursor:pointer" data-s="${i}"><span>${esc(s.n || "—")}<small class="dn2" style="display:block">${esc(s.c)}${s.dest ? " → " + esc(s.dest) : ""}</small></span><b>${(s.sog || 0) >= 3 ? (s.sog || 0).toFixed(0) + " kn" : "stopped"}</b></div>`).join("") || '<div class="note">None broadcasting in this sample.</div>'}
<div class="note">Size comes from the ship's broadcast length: VLCC 300 m+, Suezmax 250–300, Aframax/LR2 220–250, MR/LR1 170–220. Coverage depends on volunteer receivers on the coast, so counts are a sample. Watch the mix: more smaller tankers than usual relative to VLCCs would support cargoes being split into smaller ships.</div>`);
    const L = S.sort((x, y) => (y.len || 0) - (x.len || 0)).slice(0, 20);
    document.querySelectorAll("#panel [data-s]").forEach(el => el.onclick = () => showShip(L[+el.dataset.s]));
    setTimeout(() => { const box = $("#aisc"); box && tsChart(box, { t: T, h: 130, zero: 1, series: [{ n: "VLCC + Suezmax", c: "#ff8a3d", v: big }, { n: "Smaller", c: "#4ea8f2", v: small }], fmt: v => Math.round(v) + " ships", lab: t => new Date(t).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Europe/London" }) }) }, 0);
  }
  function overview() {
    if (!AIS) { info(`<h2>Live tankers</h2><div class="note">Waiting for the first sample. This needs a free aisstream.io API key saved as the GitHub secret AISSTREAM_KEY.</div>`); return }
    const A = Object.keys(AIS.areas || {});
    info(`<h2>Live tankers</h2><div class="note" style="margin:-4px 0 8px">${(AIS.ships || []).length} tankers broadcasting around the Gulf, Hormuz, the Red Sea and Suez</div>
${A.map(a => { const c = AIS.counts[a] || {}, n = Object.values(c).reduce((x, y) => x + y, 0); return `<div class="row" style="cursor:pointer" data-a="${esc(a)}"><span>${esc(a)}<small class="dn2" style="display:block">VLCC ${c.VLCC || 0} · Suezmax ${c.Suezmax || 0} · Aframax/LR2 ${c["Aframax/LR2"] || 0} · MR ${c["MR/LR1"] || 0}</small></span><b>${n} ›</b></div>` }).join("")}
<div class="note">Triangles are tankers under way (pointing where they're heading), dots are stopped or at anchor; colour = size class. Updated every 2 hours from an 8-minute listen to the AIS feed.</div>`);
    document.querySelectorAll("#panel [data-a]").forEach(el => el.onclick = () => showArea(el.dataset.a));
  }
  window.aisOverview = overview;
  async function load() { try { const j = await (await getData("ais", "ais.json")).json(); if (j && j.ships) { window.AIS = j; draw(); window.renderHealth && renderHealth() } } catch (e) {} }
  later(load, 2400); setInterval(load, 30 * 6e4);
  window.CMD_FN = (window.CMD_FN || []).concat([["SHIPS", "Live tankers around Hormuz and the Red Sea", "ais live tankers ships vessels hormuz red sea suez gulf positions", () => { if (map.classList.contains("off-ais")) document.querySelector('#tg button[data-k="ais"]')?.click(); typeof panTo == "function" && panTo(50, 22); overview() }]]);
})();
