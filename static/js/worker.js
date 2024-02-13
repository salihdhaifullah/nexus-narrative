if ('serviceWorker' in navigator && location.hostname !== "localhost") {
    navigator.serviceWorker.register('/static/service-worker.js')
        .then((registration) => {
            console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch((error) => {
            console.error('Service Worker registration failed:', error);
        });
}
