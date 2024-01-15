const CACHE_NAME = 'nexus-narrative-cache';

const urlsToCache = async () => {
  const res = await fetch(`${self.location.origin}/build`)
  return await res.json()
}

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME)
  .then(async (cache) => {
    cache.addAll(await urlsToCache())
  }))
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) return response;

      return fetch(event.request).then((networkResponse) => {
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
        });

        return networkResponse;
      });
    })
  );
});
