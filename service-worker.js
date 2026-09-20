const CACHE = "spirit-slasher-v1.13-build-1";
const ASSET_BASE = "https://antoniosman.github.io/spirit-slasher/";
const CORE = [
  "./",
  "./index.html",
  "./styles.css",
  "./funeral-webgl.js",
  "./online-client.js",
  "./app.js",
  "./manifest.webmanifest",
  "./version.json",
  "./icon.svg",
  "./icon-192.png",
  "./icon-512.png",
  "./assets-manifest.json"
];

async function fetchWithTimeout(url, timeoutMs = 12000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { cache: "no-cache", mode: "cors", signal: controller.signal });
  } catch {
    if (controller.signal.aborted) return null;
    // Opaque responses are still cacheable and keep images/audio available
    // when the app itself is served from the named tunnel.
    const fallbackController = new AbortController();
    const fallbackTimer = setTimeout(() => fallbackController.abort(), timeoutMs);
    try {
      return await fetch(url, { cache: "no-cache", mode: "no-cors", signal: fallbackController.signal });
    } catch {
      return null;
    } finally {
      clearTimeout(fallbackTimer);
    }
  } finally {
    clearTimeout(timer);
  }
}

async function warmAssets() {
  let manifest;
  try {
    const response = await fetch("./assets-manifest.json", { cache: "no-cache" });
    manifest = await response.json();
  } catch {
    return;
  }
  const cache = await caches.open(CACHE);
  const queue = [...(Array.isArray(manifest?.assets) ? manifest.assets : [])];
  const worker = async () => {
    while (queue.length) {
      const assetPath = queue.shift();
      const url = `${ASSET_BASE}${assetPath}`;
      if (await cache.match(url)) continue;
      const response = await fetchWithTimeout(url);
      if (response && (response.ok || response.type === "opaque")) await cache.put(url, response.clone());
    }
  };
  await Promise.all(Array.from({ length: 4 }, worker));
}

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
      // Activate the new shell quickly; asset warming continues opportunistically
      // and never makes a poor connection wait for the app to open.
      .then(() => Promise.race([warmAssets(), new Promise(resolve => setTimeout(resolve, 4000))]))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", event => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  if (new URL(event.request.url).pathname.startsWith("/api/")) return;
  const requestUrl = new URL(event.request.url);
  if (requestUrl.pathname.includes("/assets/")) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        const network = fetch(event.request).then(response => {
          if (response.ok || response.type === "opaque") {
            caches.open(CACHE).then(cache => cache.put(event.request, response.clone()));
          }
          return response;
        }).catch(() => cached || Response.error());
        return cached || network;
      })
    );
    return;
  }
  event.respondWith(
    caches.match(event.request).then(cached => {
      const network = fetch(event.request).then(response => {
        if (response.ok && new URL(event.request.url).origin === self.location.origin) {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(event.request, copy));
        }
        return response;
      }).catch(() => cached || caches.match("./index.html"));
      return cached || network;
    })
  );
});
