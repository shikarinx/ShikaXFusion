// sw.js - A more complete Service Worker

const CACHE_NAME = 'shikaxfusion-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/home.html',
  '/login.css',
  '/home.css',
  '/login.js',
  '/main.js',
  '/icon-512x512.png',
  'https://fonts.googleapis.com/css2?family=Amita:wght@400;700&family=Monoton&display=swap'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});