const CACHE = "spirit-slasher-v1.9.0";
const CORE = [
  "./",
  "./index.html",
  "./styles.css",
  "./funeral-webgl.js",
  "./app.js",
  "./manifest.webmanifest",
  "./version.json",
  "./icon.svg",
  "./icon-192.png",
  "./icon-512.png",
  "./assets/audio/intro.mp3",
  "./assets/audio/outro.mp3",
  "./assets/audio/funeral.mp3",
  "./assets/brand/spirit-slasher-logo.png",
  "./assets/locations/movie-1-atlas.webp",
  "./assets/locations/movie-2-atlas.webp",
  "./assets/locations/movie-3-atlas.webp",
  "./assets/characters/char_alex.webp",
  "./assets/characters/char_billy.webp",
  "./assets/characters/char_catherine.png",
  "./assets/characters/char_demarin.webp",
  "./assets/characters/char_elisa.webp",
  "./assets/characters/char_ester.png",
  "./assets/characters/char_eva.png",
  "./assets/characters/char_evaggelia.png",
  "./assets/characters/char_evelyn.webp",
  "./assets/characters/char_hope.webp",
  "./assets/characters/char_ian.png",
  "./assets/characters/char_irene.png",
  "./assets/characters/char_jasmine.png",
  "./assets/characters/char_luna.webp",
  "./assets/characters/char_paul.png",
  "./assets/characters/char_pauline.webp",
  "./assets/characters/char_phillip.webp",
  "./assets/characters/char_rino.webp",
  "./assets/characters/char_sargenie.jpeg",
  "./assets/characters/char_smaragda.jpeg",
  "./assets/characters/char_sorina.png",
  "./assets/characters/char_tony.webp",
  "./assets/characters/char_vicky.jpg",
  "./assets/characters/char_vincent.jpg",
  "./assets/characters/char_violet.png",
  "./assets/characters/char_zoe.jpeg"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener("message", event => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
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
