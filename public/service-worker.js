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

const getResponse = async (event) => {
  if (event.request.method !== "GET") return fetch(event.request);

  const response = await caches.match(event.request)
  if (response && !navigator.onLine) {
    console.log("got response from cache on request", event.request)
    return response;
  }

  const networkResponse = await fetch(event.request);
  console.log("fetch with method ", event.request.method);

  if (event.request.method === "GET") {
    const clonedResponse = networkResponse.clone();
    const cache = await caches.open(CACHE_NAME)
    cache.put(event.request, clonedResponse);
  }

  return networkResponse;
}

self.addEventListener('fetch', (event) => event.respondWith(getResponse(event)))
