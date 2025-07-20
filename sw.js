// Service Worker para VRTon - Cache optimizado con invalidación automática
const CACHE_VERSION = 'vrton-v1.3.0';
const CACHE_NAME = `vrton-cache-${CACHE_VERSION}`;

// Recursos críticos que se cachean inmediatamente
const CORE_ASSETS = [
    './',
    './index.html',
    './colaboradores.html',
    './styles.css',
    './scripts/loading.js',
    './scripts/i18n.js',
    './scripts/components.js',
    './scripts/countdown.js',
    './scripts/script.js',
    './scripts/menu.js',
    './scripts/faq.js',
    './scripts/equipos.js',
    './data/translations.json',
    './data/equipos.json',
    '/assets/logo.png',
    '/includes/header.html',
    '/includes/footer.html'
];

// Recursos que se cachean bajo demanda
const RUNTIME_CACHE = [
    '/assets/',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/',
    'https://flagcdn.com/'
];

// Recursos que no se cachean
const NO_CACHE = [
    '/sw.js',
    '/unregister-sw.js',
    'chrome-extension://',
    'moz-extension://'
];

// Instalar Service Worker
self.addEventListener('install', event => {
    console.log('[SW] Installing version:', CACHE_VERSION);
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[SW] Precaching core assets');
                return cache.addAll(CORE_ASSETS.map(url => new Request(url, {
                    cache: 'reload' // Forzar recarga desde red
                })));
            })
            .then(() => {
                // Activar inmediatamente
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('[SW] Install failed:', error);
            })
    );
});

// Activar Service Worker
self.addEventListener('activate', event => {
    console.log('[SW] Activating version:', CACHE_VERSION);
    
    event.waitUntil(
        Promise.all([
            // Limpiar caches antiguos
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('[SW] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            // Tomar control inmediatamente
            self.clients.claim()
        ])
    );
});

// Interceptar requests
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    
    // Skip non-GET requests y URLs no cacheables
    if (event.request.method !== 'GET' || 
        NO_CACHE.some(pattern => url.href.includes(pattern))) {
        return;
    }
    
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    const url = new URL(request.url);
    
    try {
        // Para HTML: Network first con cache fallback
        if (request.headers.get('accept').includes('text/html')) {
            return await networkFirstStrategy(request);
        }
        
        // Para JSON: Cache first con revalidación en background
        if (url.pathname.endsWith('.json')) {
            return await cacheFirstWithBackgroundUpdate(request);
        }
        
        // Para assets estáticos: Cache first
        if (isStaticAsset(url)) {
            return await cacheFirstStrategy(request);
        }
        
        // Para CDN: Cache first con TTL largo
        if (isCDNAsset(url)) {
            return await cacheFirstStrategy(request, 86400000); // 24 horas
        }
        
        // Default: Network first
        return await networkFirstStrategy(request);
        
    } catch (error) {
        console.error('[SW] Request failed:', error);
        return new Response('Network error', { 
            status: 500, 
            statusText: 'Service Worker Error' 
        });
    }
}

// Network First Strategy - para contenido dinámico
async function networkFirstStrategy(request) {
    const cache = await caches.open(CACHE_NAME);
    
    try {
        // Intentar red primero
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            // Cachear respuesta exitosa
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        // Si falla la red, usar cache
        console.log('[SW] Network failed, trying cache:', request.url);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        throw error;
    }
}

// Cache First Strategy - para assets estáticos
async function cacheFirstStrategy(request, maxAge = 3600000) { // 1 hora default
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
        const cachedDate = new Date(cachedResponse.headers.get('date') || Date.now());
        const isExpired = (Date.now() - cachedDate.getTime()) > maxAge;
        
        if (!isExpired) {
            return cachedResponse;
        }
    }
    
    // Cache miss o expirado - ir a red
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        // Si hay cache aunque esté expirado, usarlo
        if (cachedResponse) {
            return cachedResponse;
        }
        throw error;
    }
}

// Cache First con revalidación en background
async function cacheFirstWithBackgroundUpdate(request) {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    // Revalidar en background
    const networkUpdate = fetch(request).then(response => {
        if (response.ok) {
            cache.put(request, response.clone());
        }
        return response;
    }).catch(error => {
        // Ignorar errores de red en background porque no afectan la respuesta inmediata
        console.error('Network update failed:', error);
    });
    
    // Retornar cache inmediatamente si existe
    if (cachedResponse) {
        return cachedResponse;
    }
    
    // Si no hay cache, esperar red
    return await networkUpdate;
}

// Utility functions
function isStaticAsset(url) {
    return /\.(css|js|png|jpg|jpeg|webp|svg|woff|woff2|ttf|ico)$/.test(url.pathname);
}

function isCDNAsset(url) {
    return url.hostname.includes('cdnjs.cloudflare.com') || 
           url.hostname.includes('flagcdn.com');
}

// Escuchar mensajes del cliente
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({
            version: CACHE_VERSION
        });
    }
});
