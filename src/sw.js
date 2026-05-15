import { precacheAndRoute } from 'workbox-precaching'

// Precache Vite generated assets safely
precacheAndRoute(self.__WB_MANIFEST || [])

self.addEventListener('push', function (event) {
    let data = { title: 'New Alert', body: 'You have a new PulseNet alert.' };
    if (event.data) {
        try { data = event.data.json(); } catch (e) { }
    }

    event.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.body
        })
    );
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            // If tab is open, focus it
            for (let client of windowClients) {
                if (client.url.includes('/superadmin') || client.url.includes('/admin')) {
                    if ('focus' in client) return client.focus()
                }
            }
            // Otherwise open a new window
            if (clients.openWindow) {
                return clients.openWindow('/login');
            }
        })
    );
});
