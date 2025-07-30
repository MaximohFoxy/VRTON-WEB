// Script to unregister service worker and clear cache
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for(let registration of registrations) {
            registration.unregister();
            console.log('ServiceWorker unregistered');
        }
    });
}

// Clear all caches
if ('caches' in window) {
    caches.keys().then(function(names) {
        return Promise.all(
            names.map(name => {
                console.log('Deleting cache:', name);
                return caches.delete(name);
            })
        );
    });
}
