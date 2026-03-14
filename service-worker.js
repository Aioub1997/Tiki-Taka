const CACHE_NAME = 'racing-ww-v1';
const urlsToCache = [
  '/Tiki-Taka/',
  '/Tiki-Taka/index.html',
  '/Tiki-Taka/joueurs.html',
  '/Tiki-Taka/matchs.html',
  '/Tiki-Taka/convocations.html',
  '/Tiki-Taka/equipe.html',
  '/Tiki-Taka/login.html',
  '/Tiki-Taka/css/style.css',
  'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600&display=swap'
];

// Installation — mise en cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// Activation — supprimer anciens caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — réseau d'abord, cache en fallback
self.addEventListener('fetch', event => {
  // Ne pas intercepter les requêtes Firebase
  if (event.request.url.includes('firestore') ||
      event.request.url.includes('firebase') ||
      event.request.url.includes('gstatic')) {
    return;
  }
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
