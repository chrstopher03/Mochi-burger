self.addEventListener('install',e=>{

  e.waitUntil(
    caches.open('burger-cache').then(cache=>{

      return cache.addAll([
        '/',
        '/index.html',
        '/admin.html',
        '/kitchen.html'
      ])

    })
  )

})

self.addEventListener('fetch',e=>{

  e.respondWith(
    caches.match(e.request).then(response=>{
      return response || fetch(e.request)
    })
  )

})