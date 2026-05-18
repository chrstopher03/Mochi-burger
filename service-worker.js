const CACHE_NAME = "mochi-burgers-v2";

/* FILES */

const urlsToCache = [

  "./",
  "./index.html",
  "./style.css",
  "./funcion.js",
  "./manifest.json",
  "./1.jpeg"

];

/* INSTALL */

self.addEventListener("install", event => {

  console.log("Nueva versión instalada");

  self.skipWaiting();

  event.waitUntil(

    caches.open(CACHE_NAME)
    .then(cache => {

      return cache.addAll(urlsToCache);

    })

  );

});

/* ACTIVATE */

self.addEventListener("activate", event => {

  console.log("SW activado");

  event.waitUntil(

    caches.keys().then(cacheNames => {

      return Promise.all(

        cacheNames.map(cache => {

          if(cache !== CACHE_NAME){

            console.log("Eliminando cache vieja:", cache);

            return caches.delete(cache);

          }

        })

      );

    })

  );

  self.clients.claim();

});

/* FETCH */

self.addEventListener("fetch", event => {

  event.respondWith(

    fetch(event.request)

    .then(response => {

      return response;

    })

    .catch(() => {

      return caches.match(event.request);

    })

  );

});