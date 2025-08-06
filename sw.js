
const CACHE_NAME = 'middlemanza-cache-v1';

// On install, cache the shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
      ]).catch(err => {
        console.error('Failed to cache initial assets:', err);
      });
    })
  );
});

// On fetch, use cache first, then network
self.addEventListener('fetch', event => {
  // We only want to cache GET requests.
  if (event.request.method !== 'GET') {
    return;
  }
  
  event.respondWith(
    caches.open(CACHE_NAME).then(async cache => {
      const cachedResponse = await cache.match(event.request);
      
      const fetchedResponsePromise = fetch(event.request).then(networkResponse => {
        // If we got a valid response, update the cache
        if (networkResponse && networkResponse.ok) {
            cache.put(event.request, networkResponse.clone());
        }
        return networkResponse;
      }).catch(err => {
        console.error('Fetch failed:', err);
        // This will be triggered on network failure
      });

      // Return cached response if available, otherwise wait for network
      return cachedResponse || fetchedResponsePromise;
    })
  );
});

// Clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
