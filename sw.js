// Commodity Map service worker
// Static files (app code, map geometry, icons, fonts): served instantly from cache, refreshed in the background.
// Data and pages: network first, falling back to the last saved copy when offline or after 4 seconds.
const V = "cm-v5"; // every cache name must start with "cm-": other apps on this domain share cache storage
const STATIC = /\/app\/|coast50\.json|faults\.json|icon-\d+\.png|favicon\.svg|icon\.svg|apple-touch-icon\.png|manifest\.json|fonts\.(googleapis|gstatic)\.com/;

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith("cm-") && k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())
));

async function staticFirst(req) {
  const c = await caches.open(V);
  const hit = await c.match(req);
  const net = fetch(req).then(async res => {
    if (res.ok || res.type === "opaque") {
      const u = new URL(req.url);
      if (u.search) {
        // drop older versions of the same file
        for (const k of await c.keys()) {
          const ku = new URL(k.url);
          if (ku.origin === u.origin && ku.pathname === u.pathname && ku.search !== u.search) c.delete(k);
        }
      }
      c.put(req, res.clone());
    }
    return res;
  }).catch(() => hit);
  return hit || net;
}

async function networkFirst(req) {
  const c = await caches.open(V);
  const u = new URL(req.url);
  const key = u.origin + u.pathname;
  try {
    const res = await Promise.race([fetch(req), new Promise((_, rej) => setTimeout(() => rej(new Error("slow")), 4000))]);
    if (res.ok) c.put(key, res.clone());
    return res;
  } catch (e) {
    const hit = await c.match(key);
    return hit || fetch(req);
  }
}

self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET") return;
  if (!/^https?:/.test(r.url)) return;
  e.respondWith(STATIC.test(r.url) ? staticFirst(r) : networkFirst(r));
});
