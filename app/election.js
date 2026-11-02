/* ---- US midterms (Update US midterms job): Senate and governor races by state, ratings before the vote, results as races are called ---- */
(() => {
  window.ELX = null;
  const NS = "http://www.w3.org/2000/svg";
  const PC = { D: "#3b82f6", R: "#ef4444", I: "#a855f7", O: "#9aa5ab" };
  const PN = { D: "Democratic", R: "Republican", I: "Independent", O: "Other" };
  const start = Date.UTC(2026, 10, 2), end = Date.UTC(2026, 10, 14);
  const live = () => Date.now() >= start && Date.now() < end;
  let mode = "senate", src = "mkt", shapes = null, g = null, chip = null;
  const mkFor = k => ELX && ELX.mk && ELX.mk[mode == "senate" ? "senate" : "gov"] && ELX.mk[mode == "senate" ? "senate" : "gov"][k];
  const fav = m => m && m.o && m.o.length && m.o[0].pct != null ? m.o[0] : null;   // market favourite
  const mkTxt = m => { const f = fav(m); return f ? `${f.n} ${Math.round(f.pct)}%` : "—" };

  /* layer switch: on by default around election week */
  const tg = document.getElementById("tg"), lg = tg && tg.querySelector(".lg");
  if (tg) { const b = document.createElement("button"); b.textContent = "US midterms"; b.dataset.k = "elect";
    if (!live()) { b.classList.add("off"); map.classList.add("off-elect") }
    b.onclick = () => { b.classList.toggle("off", map.classList.toggle("off-elect")); if (!map.classList.contains("off-elect")) load(); layout() };
    lg ? tg.insertBefore(b, lg) : tg.appendChild(b) }

  const races = () => ELX ? (mode == "senate" ? ELX.senate : ELX.gov) : {};
  const stateOf = k => k.replace(" (special)", "");
  function fillFor(st) {
    const R = races(), L = Object.keys(R).filter(k => stateOf(k) == st).map(k => R[k]);
    if (!L.length) return null;
    const r = L.find(x => !x.win) || L[0];      // show an uncalled race first if the state has two
    if (r.win) return { c: PC[r.win], o: .62, flip: L.some(x => x.flip) };
    if (src == "mkt") { const k = Object.keys(R).find(x => R[x] === r), f = fav(mkFor(k));
      if (f) { const pr = f.pct / 100; return pr < .6 ? { c: "#f2c94c", o: .45, toss: 1 } : { c: PC[f.p] || PC.O, o: pr >= .9 ? .16 : pr >= .75 ? .26 : .38 } } }
    const rt = r.rate;
    if (!rt) return { c: PC[r.ip] || PC.O, o: .12 };
    if (rt.lab == "Tossup") return { c: "#f2c94c", o: .45, toss: 1 };
    return { c: PC[rt.p] || PC.O, o: { Safe: .16, Likely: .24, Lean: .34, Tilt: .4 }[rt.lab] || .2 };
  }
  function draw() {
    const OVs = document.getElementById("ov"); if (!OVs || !shapes || !ELX) return;
    if (!g) { g = document.createElementNS(NS, "g"); g.setAttribute("class", "L-elect"); OVs.insertBefore(g, OVs.firstChild ? OVs.firstChild.nextSibling : null);
      g.addEventListener("click", e => { const s = e.target.dataset && e.target.dataset.st; if (s) { e.stopPropagation(); showState(s) } }) }
    let h = `<defs><pattern id="elflip" width="1.2" height="1.2" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width=".45" height="1.2" fill="#fff" fill-opacity=".55"/></pattern></defs>`;
    Object.entries(shapes).forEach(([st, polys]) => {
      const d = polys.map(r => r.map(([x, y], i) => (i ? "L" : "M") + (x + 180).toFixed(2) + " " + (90 - y).toFixed(2)).join("") + "Z").join("");
      const f = fillFor(st);
      h += `<path class="els${f ? " on" : ""}" data-st="${esc(st)}" d="${d}" fill="${f ? f.c : "none"}" fill-opacity="${f ? f.o : 0}"><title>${esc(st)}</title></path>`;
      if (f && f.flip) h += `<path class="elf" d="${d}" fill="url(#elflip)"/>`;
    });
    g.innerHTML = h;
    // summary chip over the middle of the US
    if (!chip) { chip = document.createElement("div"); chip.className = "mk L-elect elchip"; chip.style.left = X(-98) / 3.6 + "%"; chip.style.top = Y(47.5) / 1.8 + "%"; chip.onclick = e => { e.stopPropagation(); openElect() }; map.appendChild(chip) }
    const s = senateTotals();
    const C = ELX.mk && ELX.mk.control || {}, od = (L, lab) => { const d = (L || []).find(o => o.p == "D"); return d && d.pct != null ? `<i>${lab}</i><em style="color:${d.pct >= 50 ? PC.D : PC.R}">${d.pct >= 50 ? "D " + Math.round(d.pct) : "R " + Math.round(100 - d.pct)}%</em>` : "" };
    chip.innerHTML = `<b class="elct"><b class="elr"><i>Senate seats</i><em style="color:${PC.D}">D ${s.D + s.I}</em><em style="color:${PC.R}">R ${s.R}</em><small>${s.called}/${s.races} called</small></b>${C.S ? `<b class="elr"><i>Market odds</i>${od(C.S, "Senate")}${od(C.H, "House")}</b>` : ""}</b>`;
    chip.title = "US midterms: tap for the full picture";
    layout();
  }
  function senateTotals() {
    const N = ELX.notup, W = ELX.sen_won, races = Object.keys(ELX.senate).length, called = W.D + W.R + W.I;
    return { D: N.D + W.D, I: N.I + W.I, R: N.R + W.R, called, races, left: races - called };
  }
  const rateTxt = r => r ? (r.lab == "Tossup" ? "Toss-up" : `${r.lab} ${r.p}`) + ` · average of ${r.n} forecasters` : "No ratings";
  function raceHTML(k, r, kind) {
    const lead = r.win ? `<b style="color:${PC[r.win]}">${PN[r.win]} ${r.flip ? "gain (seat flips)" : "hold"}</b>` : r.runoff ? "<b>Going to a runoff</b>" : "<b>Not called yet</b>";
    const cs = r.c.slice().sort((a, b) => (b.w - a.w) || ((b.pct || 0) - (a.pct || 0)));
    return `<div class="kh">${kind} · ${esc(k)}</div>
<div class="row"><span>Result</span>${lead}</div>
<div class="row"><span>Incumbent</span><b>${esc(r.inc || "—")} <small style="color:${PC[r.ip] || "inherit"}">${r.ip || ""}</small></b></div>
<div class="row"><span>Forecasters</span><b class="wrap">${esc(rateTxt(r.rate))}</b></div>
${(() => { const m = ELX.mk && ELX.mk[kind == "Senate" ? "senate" : "gov"] && ELX.mk[kind == "Senate" ? "senate" : "gov"][k]; return m ? `<div class="row"><span>Market odds (Kalshi)</span><b class="wrap">${m.o.filter(o => o.pct != null && o.pct >= 1).map(o => `<span style="color:${PC[o.p] || "inherit"}">${esc(o.n)} ${Math.round(o.pct)}%</span>`).join(" · ")}</b></div>` : "" })()}
${cs.slice(0, 6).map(c => `<div class="row"><span>${c.w ? "✓ " : ""}${esc(c.n)}<small class="dn2" style="display:block">${esc(c.pl || PN[c.p])}</small></span><b style="color:${PC[c.p]}">${c.pct != null ? c.pct.toFixed(1) + "%" : ""}</b></div>`).join("")}
${r.status ? `<div class="note" style="margin-top:2px">${esc(r.status)}</div>` : ""}`;
  }
  function showState(st) {
    const S = Object.entries(ELX.senate).filter(([k]) => stateOf(k) == st), G = Object.entries(ELX.gov).filter(([k]) => stateOf(k) == st);
    info(`<h2>${esc(st)} · 2026 midterms</h2>${S.length || G.length ? S.map(([k, r]) => raceHTML(k, r, "Senate")).join("") + G.map(([k, r]) => raceHTML(k, r, "Governor")).join("") : '<div class="note">No Senate or governor race here this year (every state elects House members).</div>'}
<div class="note">${foot()}</div>`);
  }
  window.showElectState = showState;
  const foot = () => `Results from Wikipedia's race tables, which editors update as AP and the networks call races, so they can lag TV by up to an hour. Forecasters = average of the published race ratings (Cook, Inside Elections, Sabato and others). Market odds: Kalshi. Updated ${ELX ? new Date(ELX.updated * 1000).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Europe/London" }) + " UK" : ""}. House races aren't shown.`;
  function openElect() {
    if (!ELX) return;
    const s = senateTotals(), seats = [];
    const N = ELX.notup, W = ELX.sen_won, open = s.left;
    for (const [p, n] of [["D", N.D + W.D], ["I", N.I + W.I]]) for (let i = 0; i < n; i++) seats.push(PC[p]);
    for (let i = 0; i < open; i++) seats.push("var(--line2)");
    for (let i = 0; i < N.R + W.R; i++) seats.push(PC.R);
    const close = (obj, kind) => Object.entries(obj).map(([k, r]) => {
        const m = ELX.mk && ELX.mk[kind == "Senate" ? "senate" : "gov"] && ELX.mk[kind == "Senate" ? "senate" : "gov"][k], f = fav(m);
        const fl = r.rate && ["Tossup", "Tilt", "Lean"].includes(r.rate.lab), mc = f && f.pct < 70, dis = f && r.rate && r.rate.p && f.p != r.rate.p && f.pct >= 55;
        return { k, r, f, dis, show: r.win ? r.flip : fl || mc || dis, sc: r.flip ? -1 : f ? Math.abs(f.pct - 50) : r.rate ? Math.abs(r.rate.avg) * 20 : 99 };
      }).filter(x => x.show).sort((a, b) => a.sc - b.sc)
      .map(({ k, r, f, dis }) => `<div class="row" style="cursor:pointer" data-st="${esc(stateOf(k))}"><span>${esc(k)}<small class="dn2" style="display:block">${esc(kind)} · forecasters: ${esc(rateTxt(r.rate).split(" · ")[0])}${f ? ` · market: <b style="color:${PC[f.p] || "inherit"}">${esc(f.n)} ${Math.round(f.pct)}%</b>` : ""}${dis ? " · disagree" : ""}</small></span><b style="color:${r.win ? PC[r.win] : "inherit"}">${r.win ? PN[r.win] + (r.flip ? " gain" : " hold") : "not called ›"}</b></div>`).join("");
    const C = ELX.mk && ELX.mk.control || {}, dPct = L => { const d = (L || []).find(o => o.p == "D"); return d && d.pct != null ? d.pct : null };
    const cbar = (lab, L) => { const d = dPct(L); if (d == null) return ""; return `<div class="row"><span>${lab}</span><b><span style="color:${PC.D}">D ${Math.round(d)}%</span> · <span style="color:${PC.R}">R ${Math.round(100 - d)}%</span></b></div><div class="elodd"><i style="width:${d}%;background:${PC.D}"></i><i style="width:${100 - d}%;background:${PC.R}"></i></div>` };
    const mkt = C.S || C.H ? `<div class="kh">Prediction markets (Kalshi): chance of control</div>${cbar("Senate", C.S)}${cbar("House", C.H)}${(C.combo || []).length ? `<div class="row"><span>Balance of power</span><b class="wrap">${C.combo.filter(o => o.pct != null).map(o => `${esc(o.n)} ${Math.round(o.pct)}%`).join(" · ")}</b></div>` : ""}` : "";
    const gw = ELX.gov_won, gl = Object.keys(ELX.gov).length;
    info(`<h2>US midterms · 3 November</h2>
<div class="kh">Senate (51 for control; the Vice President breaks 50–50 ties)</div>
<div class="elbar">${seats.map(c => `<i style="background:${c}"></i>`).join("")}<em></em></div>
<div class="tgrid"><div><span class="note" style="margin:0">Democratic + Ind.</span><b style="color:${PC.D}">${s.D + s.I}</b><small>incl. seats not up</small></div><div><span class="note" style="margin:0">Republican</span><b style="color:${PC.R}">${s.R}</b><small>incl. seats not up</small></div><div><span class="note" style="margin:0">Still to call</span><b>${s.left}</b><small>of ${s.races} races</small></div></div>
<div class="kh">Governors</div><div class="row"><span>Called</span><b><span style="color:${PC.D}">D ${gw.D}</span> · <span style="color:${PC.R}">R ${gw.R}</span>${gw.I ? ` · <span style="color:${PC.I}">I ${gw.I}</span>` : ""} of ${gl}</b></div>
${mkt}
<div class="kh">Close races and flips</div>${close(ELX.senate, "Senate") + close(ELX.gov, "Governor") || '<div class="note">None flagged.</div>'}
<div class="kh">On the map</div><div class="seg elseg"><button data-m="senate" class="${mode == "senate" ? "on" : ""}">Senate</button><button data-m="gov" class="${mode == "gov" ? "on" : ""}">Governors</button></div>
<div class="seg elseg elsrc"><button data-s="mkt" class="${src == "mkt" ? "on" : ""}">Shade by market odds</button><button data-s="fc" class="${src == "fc" ? "on" : ""}">By forecasters</button></div>
<div class="note">Before a race is called, states are shaded by ${src == "mkt" ? "the market favourite: pale = 90%+, stronger = 60–90%, yellow = under 60% (close)" : "the forecasters' average: pale = safe, stronger = likely or lean, yellow = toss-up"}. Market odds are what traders pay for each outcome on Kalshi, so they react to news and early vote counts much faster than official calls. Called races are filled solid; stripes mark a seat changing party. Tap a state for candidates and vote shares. Polls close from 23:00 UK on 3 Nov; most results arrive overnight.<br><br>${foot()}</div>`);
    document.querySelectorAll("#panel [data-st]").forEach(el => el.onclick = () => showState(el.dataset.st));
    document.querySelectorAll("#panel .elseg button[data-m]").forEach(b => b.onclick = () => { mode = b.dataset.m; draw(); openElect() });
    document.querySelectorAll("#panel .elsrc button").forEach(b => b.onclick = () => { src = b.dataset.s; draw(); openElect() });
  }
  window.openElect = openElect;

  let busy = null;
  function load() {
    if (busy) return busy;
    busy = (async () => {
      try {
        if (!shapes) shapes = await (await fetch("usstates.json")).json();
        const j = await (await getData("elections", "elections.json")).json();
        if (j && j.senate) { window.ELX = j; draw(); window.renderHealth && renderHealth() }
      } catch (e) {} busy = null;
    })();
    return busy;
  }
  if (live()) later(load, 1400);
  setInterval(() => { if (!map.classList.contains("off-elect")) load() }, 10 * 6e4);

  window.elWatch = () => {
    if (!ELX || !live()) return [];
    const s = senateTotals(), L = [{ t: `US Senate: D ${s.D + s.I} – R ${s.R}, ${s.left} race${s.left == 1 ? "" : "s"} still to call`, run: openElect, sev: 2 }];
    Object.entries(ELX.senate).filter(([, r]) => r.flip).forEach(([k, r]) => L.push({ t: `Senate seat flips in ${k}: ${PN[r.win]} gain`, run: () => showState(stateOf(k)), sev: 2 }));
    return L;
  };
  window.CMD_FN = (window.CMD_FN || []).concat([["ELECT", "US midterms: Senate and governors by state", "election midterms senate governor congress vote results us politics", () => { if (map.classList.contains("off-elect")) document.querySelector('#tg button[data-k="elect"]')?.click(); load().then(() => { typeof panTo == "function" && panTo(-98, 39); openElect() }) }]]);
})();
