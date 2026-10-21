/* ---- Wind streaks on the GPU (WebGL). Particles still move on the CPU (cheap); the trail fading and
   drawing — the expensive part in 2D canvas — runs on the graphics chip. Falls back to the 2D version. ---- */
(() => {
  const cv = document.createElement("canvas");
  cv.id = "wpg";
  const gl = cv.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false, preserveDrawingBuffer: false });
  if (!gl || typeof anim != "function") return;
  const WLy = document.getElementById("wxl"), old2d = document.getElementById("wp"), o2d = { anim: window.anim, sizeP: window.sizeP };
  WLy.appendChild(cv);

  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s };
  const prog = (vs, fs) => { const p = gl.createProgram(); gl.attachShader(p, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(p); if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p)); return p };
  let pQuad, pLine;
  try {
    pQuad = prog(`attribute vec2 a;varying vec2 v;void main(){v=a*.5+.5;gl_Position=vec4(a,0,1);}`,
      `precision mediump float;uniform sampler2D t;uniform float f;varying vec2 v;void main(){gl_FragColor=max(texture2D(t,v)*f-vec4(1.5/255.),0.);}`);
    pLine = prog(`attribute vec2 a;uniform vec2 r;void main(){gl_Position=vec4(a/r*2.-1.,0,1);gl_Position.y=-gl_Position.y;}`,
      `precision mediump float;uniform vec4 c;void main(){gl_FragColor=c;}`);
  } catch (e) { console.warn("GPU streaks unavailable:", e); cv.remove(); return }

  const quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
  const lineBuf = gl.createBuffer();
  let tex = [], fbs = [], W = 0, H = 0, cur = 0, lines = new Float32Array(0), lost = false;

  function target(w, h) {
    tex.forEach(t => gl.deleteTexture(t)); fbs.forEach(f => gl.deleteFramebuffer(f)); tex = []; fbs = [];
    for (let i = 0; i < 2; i++) {
      const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      const f = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, f);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0);
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      tex.push(t); fbs.push(f);
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }
  function clearTrails() { fbs.forEach(f => { gl.bindFramebuffer(gl.FRAMEBUFFER, f); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT) }); gl.bindFramebuffer(gl.FRAMEBUFFER, null) }
  function drawQuad(t, fade) {
    gl.useProgram(pQuad); gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    const a = gl.getAttribLocation(pQuad, "a"); gl.enableVertexAttribArray(a); gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, t); gl.uniform1i(gl.getUniformLocation(pQuad, "t"), 0); gl.uniform1f(gl.getUniformLocation(pQuad, "f"), fade);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  window.sizeP = function () {
    const [w, h] = wlSize();
    if (old2d) old2d.style.display = "none";
    if (w != W || h != H) { W = w; H = h; cv.width = w; cv.height = h; target(w, h) }
    const n = Math.min(4000, Math.round(w * h / 600));
    PA = Array.from({ length: n }, () => seed(w, h)); PO = null; lines = new Float32Array(n * 4);
  };
  let skip = 0;
  window.anim = function (ts) {
    raf = 0;
    if (lost) return;
    if (typeof zg != "undefined" && zg) { raf = requestAnimationFrame(anim); return }  // paused while a zoom gesture is scaling the map
    if (!G || wm == "off" || !streak) { gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); clearTrails(); return }
    if (!W) sizeP();
    if (ts) { AFT.push(ts); if (AFT.length > 40) AFT.shift(); const slow = AFT.length > 20 && (AFT.at(-1) - AFT[0]) / (AFT.length - 1) > 22; if (slow && (skip ^= 1)) { raf = requestAnimationFrame(anim); return } }
    const g = GEO || wlGeo(), Wm = g.W, Hm = g.H, k = Wm / 900 * .16, [ox, oy] = wlOff();
    if (PO && (PO[0] != ox || PO[1] != oy)) { const dx = ox - PO[0], dy = oy - PO[1]; for (const p of PA) { p.x -= dx; p.y -= dy } clearTrails() }
    PO = [ox, oy];
    let n = 0;
    for (const p of PA) {
      if (p.a-- <= 0 || p.x < 0 || p.x > W || p.y < 0 || p.y > H) { Object.assign(p, seed(W, H), { a: 60 + Math.random() * 60 | 0 }); continue }
      const lon = (p.x + ox) / Wm * 360 - 180, lat = 90 - (p.y + oy) / Hm * 180;
      if (lat > 84 || lat < -84) { p.a = 0; continue }
      const [u, v] = uv(lon, lat), nx = p.x + u * k, ny = p.y - v * k;
      lines[n++] = p.x; lines[n++] = p.y; lines[n++] = nx; lines[n++] = ny;
      p.x = nx; p.y = ny;
    }
    const nxt = 1 - cur;
    gl.viewport(0, 0, W, H);
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbs[nxt]);
    gl.disable(gl.BLEND); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    drawQuad(tex[cur], 0.9);
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.useProgram(pLine); gl.bindBuffer(gl.ARRAY_BUFFER, lineBuf); gl.bufferData(gl.ARRAY_BUFFER, lines.subarray(0, n), gl.DYNAMIC_DRAW);
    const a = gl.getAttribLocation(pLine, "a"); gl.enableVertexAttribArray(a); gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
    gl.uniform2f(gl.getUniformLocation(pLine, "r"), W, H); gl.uniform4f(gl.getUniformLocation(pLine, "c"), .78, .78, .78, .78);
    gl.drawArrays(gl.LINES, 0, n / 2);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.disable(gl.BLEND);
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    drawQuad(tex[nxt], 1);
    cur = nxt;
    raf = requestAnimationFrame(anim);
  };
  cv.addEventListener("webglcontextlost", e => { e.preventDefault(); lost = true; cv.remove(); if (old2d) old2d.style.display = ""; window.anim = o2d.anim; window.sizeP = o2d.sizeP; window.GPU_STREAKS = false; try { sizeP(); startA() } catch (x) {} console.warn("GPU streaks lost, back to 2D") });
  window.GPU_STREAKS = true;
  if (G && wm != "off") { sizeP(); startA() }
})();
