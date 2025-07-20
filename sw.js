// Service Worker para cache offline - VRTon
const CACHE_NAME = 'vrton-v1.2.0';
const urlsToCache = [
  '/',
  '/11-index.html',
  '/colaboradores.html',
  '/contacto.html',
  '/styles.css',
  '/script.js',
  '/faq.js',
  '/menu.js',
  '/assets/logo.png',
  '/assets/fondo.mp4',
  '/assets/comunidad.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css'
];

// Instalar Service Worker
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Interceptar requests
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - devolver respuesta del cache
        if (response) {
          return response;
        }

        return fetch(event.request).then(
          function(response) {
            // Verificar que la respuesta sea válida
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clonar la respuesta
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});

// Actualizar cache
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
