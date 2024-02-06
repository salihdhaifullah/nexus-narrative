const CACHE_NAME = 'nexus-narrative-cache';

const urlsToCache = async () => {
  const res = await fetch(`${self.location.origin}/api/build`)
  return await res.json()
}

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME)
    .then(async (cache) => {
      cache.addAll(await urlsToCache())
    }))
})

async function getResponse(event) {
  if (event.request.method !== 'GET') {
    return await fetch(event.request);
  }

  try {
    const response = await caches.match(event.request);

    if (response && !navigator.onLine) {
      console.log('Got response from cache on request', event.request);
      return response;
    }

    const networkResponse = await fetch(event.request);
    console.log('Fetch with method', event.request.method);

    if (event.request.method === 'GET') {
      const clonedResponse = networkResponse.clone();
      const cache = await caches.open(CACHE_NAME);
      cache.put(event.request, clonedResponse);
    }

    return networkResponse;
  } catch (error) {
    console.error('Fetch error:', error);
    const cachedResponse = await caches.match(event.request);
    if (cachedResponse) {
      console.log('Got response from cache on error', event.request);
      return cachedResponse;
    }
  }
}

self.addEventListener('fetch', (event) => event.respondWith(getResponse(event)))
