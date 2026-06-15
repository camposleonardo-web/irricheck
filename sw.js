// Mude este número a cada atualização do app
const VERSION = '1.0.2';
const CACHE = 'irricheck-' + VERSION;

const FILES = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(FILES).catch(() => {}))
  );
  self.skipWaiting(); // ativa imediatamente sem esperar fechar
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim(); // assume controle imediato de todas as abas
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request)
      .then(r => r || fetch(e.request).catch(() => caches.match('./index.html')))
  );
});
