/* ---- Satellite imagery: NASA GIBS (VIIRS NOAA-20 true colour, previous day), drawn under the weather layer ---- */
(() => {
  const LAYER = "VIIRS_NOAA20_CorrectedReflectance_TrueColor";
  const base = "https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?version=1.1.1&service=WMS&request=GetMap&format=image/jpeg&STYLE=default&SRS=EPSG:4326&layers=" + LAYER;
  const day = k => new Date(Date.now() - k * 864e5).toISOString().slice(0, 10);
  const url = (b, w, h, d) => `${base}&bbox=${b.map(v => v.toFixed(3)).join(",")}&WIDTH=${w}&HEIGHT=${h}&TIME=${d}`;
  const ls = (k, v) => { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v) } catch (e) { return null } };
  const wrap = document.createElement("div");
  wrap.id = "sat";
  wrap.innerHTML = '<img class="sb" alt="" decoding="async"><img class="sd" alt="" decoding="async">';
  const WLy = document.getElementById("wxl");
  WLy.parentNode.insertBefore(wrap, WLy);
  const bImg = wrap.querySelector(".sb"), dImg = wrap.querySelector(".sd");
  let on = ls("cm_sat") == "1", dIdx = 1, detT = 0, lastU = "";
  function loadBase() {
    const d = day(dIdx);
    bImg.onerror = () => { if (dIdx < 3) { dIdx++; loadBase() } };
    bImg.src = url([-180, -90, 180, 90], 2048, 1024, d);
    wrap.title = "NASA VIIRS satellite image, " + new Date(d + "T12:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  }
  /* when zoomed in, fetch a sharper image of just the visible area */
  function detail() {
    clearTimeout(detT);
    if (!on) return;
    detT = setTimeout(() => {
      const s = document.getElementById("scroll"), W = map.offsetWidth, H = map.offsetHeight;
      if (W < 2600) { dImg.style.display = "none"; return }
      const x0 = Math.max(0, s.scrollLeft - map.offsetLeft), y0 = Math.max(0, s.scrollTop - map.offsetTop), vw = Math.min(W, s.clientWidth), vh = Math.min(H, s.clientHeight);
      const pad = .25, lx0 = Math.max(0, x0 - vw * pad), ly0 = Math.max(0, y0 - vh * pad), lx1 = Math.min(W, x0 + vw * (1 + pad)), ly1 = Math.min(H, y0 + vh * (1 + pad));
      const b = [lx0 / W * 360 - 180, 90 - ly1 / H * 180, lx1 / W * 360 - 180, 90 - ly0 / H * 180];
      const pw = Math.min(2048, Math.round(lx1 - lx0)), ph = Math.min(2048, Math.round((ly1 - ly0) * pw / (lx1 - lx0)));
      const u = url(b, pw, ph, day(dIdx)); if (u == lastU) return; lastU = u;
      const img = new Image();
      img.onload = () => { dImg.src = img.src; Object.assign(dImg.style, { display: "block", left: lx0 / W * 100 + "%", top: ly0 / H * 100 + "%", width: (lx1 - lx0) / W * 100 + "%", height: (ly1 - ly0) / H * 100 + "%" }) };
      img.src = u;
    }, 450);
  }
  function apply() {
    document.body.classList.toggle("saton", on);
    btn.classList.toggle("on", on);
    if (on && !bImg.src) loadBase();
    if (on) detail();
  }
  const btn = document.createElement("button");
  btn.textContent = innerWidth < 500 ? "Sat" : "Satellite"; btn.dataset.x = "sat"; btn.title = "NASA satellite image (yesterday)";
  btn.onclick = () => { on = !on; ls("cm_sat", on ? "1" : "0"); apply() };
  document.getElementById("wxm").appendChild(btn);
  document.getElementById("scroll").addEventListener("scroll", () => on && detail(), { passive: true });
  addEventListener("resize", () => on && detail());
  const zoomWatch = new ResizeObserver(() => on && detail());
  zoomWatch.observe(map);
  window.toggleSat = v => { on = v == null ? !on : v; ls("cm_sat", on ? "1" : "0"); apply() };
  apply();
})();
