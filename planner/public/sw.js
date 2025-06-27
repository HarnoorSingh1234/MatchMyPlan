// MatchMyPlan Service Worker
const CACHE_NAME = 'mmp-cache-v1';
const OFFLINE_URL = '/offline';

// Assets to cache immediately on SW installation
const PRECACHE_ASSETS = [
  '/',
  OFFLINE_URL,
  '/manifest.json',
  '/icons/pwa-icons/favicon-196.png',
  '/icons/pwa-icons/manifest-icon-192.maskable.png',
  '/icons/pwa-icons/manifest-icon-512.maskable.png',
  '/icons/pwa-icons/apple-icon-180.png'
];

// Install event - precache critical assets
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Pre-caching assets');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        console.log('[ServiceWorker] Skip waiting on install');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activate');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[ServiceWorker] Claiming clients');
      return self.clients.claim();
    })
  );
});

// Fetch event - network-first strategy for API requests, cache-first for static assets
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip browser-sync or socket requests
  if (event.request.url.includes('browser-sync') || 
      event.request.url.includes('socket.io') ||
      event.request.url.includes('hot-update')) {
    return;
  }

  // Network-first strategy for API requests
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cache the successful response
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Try to get from cache if network fails
          return caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // If not in cache and network failed, handle specific API cases
            if (event.request.url.includes('/api/tasks')) {
              // Return empty tasks array as fallback
              return new Response(JSON.stringify({ tasks: [] }), {
                headers: { 'Content-Type': 'application/json' }
              });
            }
            // Other API failures
            return new Response(JSON.stringify({ error: 'Network error' }), {
              status: 503,
              headers: { 'Content-Type': 'application/json' }
            });
          });
        })
    );
    return;
  }

  // Cache-first strategy for static assets and HTML pages
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Return from cache if available
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request)
          .then((response) => {
            // Don't cache bad responses
            if (!response || response.status !== 200 || response.type === 'opaque') {
              return response;
            }

            // Clone the response since it can only be consumed once
            const responseToCache = response.clone();

            // Cache the fetched resource for future use
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch((error) => {
            console.log('[ServiceWorker] Fetch failed:', error);

            // If HTML request failed, return the offline page
            if (event.request.mode === 'navigate') {
              return caches.match(OFFLINE_URL);
            }

            // For image requests, you could return a placeholder
            if (event.request.destination === 'image') {
              return caches.match('/icons/offline-image.png');
            }

            // Return empty for other resources
            return new Response('', {
              status: 408,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});

// Use background sync for offline data
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-tasks') {
    event.waitUntil(syncOfflineData());
  }
});

// Handle notifications on mobile
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  try {
    const data = event.data.json();
    
    // Configure vibration pattern for mobile
    const vibrationPattern = [100, 50, 100, 50, 100];
    
    const options = {
      body: data.body || 'Task reminder!',
      icon: '/icons/pwa-icons/favicon-196.png',
      badge: '/icons/pwa-icons/notification-badge.png',
      data: data.data || {},
      vibrate: vibrationPattern,
      actions: [
        {
          action: 'view',
          title: 'View Task',
        },
        {
          action: 'snooze',
          title: 'Snooze',
        }
      ],
      // Prevent duplicates by using a tag
      tag: `task-${data.data?.taskId || Date.now()}`
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'MatchMyPlan Reminder', options)
    );
  } catch (error) {
    console.error('[ServiceWorker] Error showing notification:', error);
  }
});

// Handle notification interactions on mobile
self.addEventListener('notificationclick', (event) => {
  const notification = event.notification;
  notification.close();
  
  // Handle different notification actions
  if (event.action === 'view' && notification.data?.taskId) {
    // Open task details
    const taskUrl = `/task/${notification.data.taskId}`;
    
    event.waitUntil(
      clients.matchAll({type: 'window'}).then((clientList) => {
        // If app is already open, navigate to the task
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'navigate' in client) {
            return client.navigate(taskUrl).then(client => {
              return client.focus();
            });
          }
        }
        
        // Otherwise open a new window to the specific task
        return clients.openWindow(taskUrl);
      })
    );
  } else if (event.action === 'snooze') {
    // Schedule a new notification in 10 minutes
    event.waitUntil(
      new Promise(resolve => {
        setTimeout(() => {
          self.registration.showNotification('Reminder Snoozed', {
            body: notification.body,
            data: notification.data,
            icon: notification.icon,
            badge: notification.badge
          });
          resolve();
        }, 10 * 60 * 1000); // 10 minutes
      })
    );
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.matchAll({type: 'window'}).then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus();
          }
        }
        return clients.openWindow('/');
      })
    );
  }
});

// Function to sync offline data when online
async function syncOfflineData() {
  try {
    // Get offline data from IndexedDB
    const offlineData = await getOfflineData();
    
    if (!offlineData || offlineData.length === 0) {
      return;
    }
    
    // Send data to server
    const response = await fetch('/api/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: offlineData })
    });
    
    if (response.ok) {
      await clearOfflineData();
    } else {
      throw new Error('Sync failed');
    }
  } catch (error) {
    console.error('[ServiceWorker] Sync error:', error);
    throw error; // This will cause the sync to retry
  }
}

// Placeholder functions for IndexedDB operations
// Will implement these with the task management module
function getOfflineData() {
  return Promise.resolve([]);
}

function clearOfflineData() {
  return Promise.resolve(true);
}