// Self-unregistering service worker to recover from stale registrations
self.addEventListener('install', (event) => {
  // Activate immediately
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      try {
        // Unregister this SW
        await self.registration.unregister();
        // Reload all controlled clients so they are no longer under SW control
        const clients = await self.clients.matchAll({
          type: 'window',
          includeUncontrolled: true,
        });
        for (const client of clients) {
          // Force a reload to clear old caches and SW control
          client.navigate(client.url);
        }
      } catch (e) {
        // no-op
      }
    })(),
  );
});

// No-op fetch handler (should be short-lived before unregister)
self.addEventListener('fetch', () => {});
