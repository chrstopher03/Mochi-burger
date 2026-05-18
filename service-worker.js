const CACHE_NAME = "mochi-cache-v1";

const urlsToCache = [

  "./",
  "./index.html",
  "./style.css",
  "./funcion.js",
  "./1.jpeg"

];

/* INSTALL */

self.addEventListener("install", event => {

  event.waitUntil(

    caches.open(CACHE_NAME)
    .then(cache => {

      return cache.addAll(urlsToCache);

    })

  );

});

/* FETCH */

self.addEventListener("fetch", event => {

  event.respondWith(

    caches.match(event.request)
    .then(response => {

      return response || fetch(event.request);

    })

  );

});