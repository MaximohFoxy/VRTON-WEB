// Script to unregister service worker and clear cache
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for(let registration of registrations) {
            registration.unregister();
        }
    });
}

// Clear all caches
if ('caches' in window) {
    caches.keys().then(function(names) {
        names.forEach(function(name) {
            caches.delete(name);
        });
    });
}