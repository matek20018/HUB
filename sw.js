// HUB service worker: aplikacja działa offline, a nowa wersja pobiera się sama, gdy jest internet.
const V = "hub-v1";
const FONTS = "hub-fonts";
const CORE = ["./", "./index.html", "./lango.html", "./config.js", "./manifest.webmanifest",
  "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== V && k !== FONTS).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// Najpierw sieć (świeża wersja), a jeśli jej nie ma albo jest bardzo słaba — kopia z pamięci.
function networkFirst(req) {
  return new Promise(resolve => {
    let done = false;
    const fallback = () => caches.match(req, { ignoreSearch: true })
      .then(m => m || caches.match("./index.html"));
    const timer = setTimeout(() => { if (!done) fallback().then(r => { if (r && !done) { done = true; resolve(r); } }); }, 4000);
    fetch(req).then(res => {
      if (res && res.ok) { const cp = res.clone(); caches.open(V).then(c => c.put(req, cp)); }
      if (!done) { done = true; clearTimeout(timer); resolve(res); }
    }).catch(() => { if (!done) { clearTimeout(timer); fallback().then(r => { done = true; resolve(r || Response.error()); }); } });
  });
}

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const u = new URL(req.url);
  if (u.origin === location.origin) { e.respondWith(networkFirst(req)); return; }
  if (u.hostname === "fonts.googleapis.com" || u.hostname === "fonts.gstatic.com") {
    e.respondWith(caches.open(FONTS).then(c => c.match(req).then(m => m || fetch(req).then(res => {
      if (res.ok || res.type === "opaque") c.put(req, res.clone());
      return res;
    }))));
  }
  // Supabase i reszta: zwykła sieć, bez pamięci podręcznej.
});
