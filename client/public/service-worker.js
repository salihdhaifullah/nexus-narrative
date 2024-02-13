const CACHE_NAME = 'nexus-narrative-cache';

const urlsToCache = [
  "/static/404.jpg",
  "/static/android-chrome-192x192.png",
  "/static/android-chrome-512x512.png",
  "/static/apple-icon.png",
  "/static/favicon-16x16.png",
  "/static/favicon-32x32.png",
  "/static/favicon.ico",
  "/static/hero.jpg",
  "/static/icon.svg",
  "/static/index.css",
  "/static/js/theme.js",

  "/static/fonts/Aleo-Italic-VariableFont_wght.ttf",
  "/static/fonts/Aleo-VariableFont_wght.ttf",
  "/static/fonts/static/Aleo-BlackItalic.ttf",
  "/static/fonts/static/Aleo-Black.ttf",
  "/static/fonts/static/Aleo-BoldItalic.ttf",
  "/static/fonts/static/Aleo-Bold.ttf",
  "/static/fonts/static/Aleo-ExtraBoldItalic.ttf",
  "/static/fonts/static/Aleo-ExtraBold.ttf",
  "/static/fonts/static/Aleo-ExtraLightItalic.ttf",
  "/static/fonts/static/Aleo-ExtraLight.ttf",
  "/static/fonts/static/Aleo-Italic.ttf",
  "/static/fonts/static/Aleo-LightItalic.ttf",
  "/static/fonts/static/Aleo-Light.ttf",
  "/static/fonts/static/Aleo-MediumItalic.ttf",
  "/static/fonts/static/Aleo-Medium.ttf",
  "/static/fonts/static/Aleo-Regular.ttf",
  "/static/fonts/static/Aleo-SemiBoldItalic.ttf",
  "/static/fonts/static/Aleo-SemiBold.ttf",
  "/static/fonts/static/Aleo-ThinItalic.ttf",
  "/static/fonts/static/Aleo-Thin.ttf"
]

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME)
    .then((cache) => {
      cache.addAll(urlsToCache)
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
