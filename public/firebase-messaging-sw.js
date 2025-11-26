// Firebase Cloud Messaging Service Worker
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js');

// Initialize Firebase in the service worker
firebase.initializeApp({
  apiKey: "AIzaSyCERyzJWx2Dmw-jVY6tNoCu2pVRrPTGWts",
  authDomain: "pizza-vibe-delivery.firebaseapp.com",
  projectId: "pizza-vibe-delivery",
  storageBucket: "pizza-vibe-delivery.firebasestorage.app",
  messagingSenderId: "131496425922",
  appId: "1:131496425922:web:cbb4529d5d6c1d2e12fe5b"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification.title || 'Pizza Vibe Delivery';
  const notificationOptions = {
    body: payload.notification.body || 'Nova notificação',
    icon: '/logo.png',
    badge: '/logo.png',
    tag: 'pizza-vibe-notification',
    vibrate: [200, 100, 200],
    data: payload.data,
    actions: [
      {
        action: 'view',
        title: 'Ver pedido'
      },
      {
        action: 'close',
        title: 'Fechar'
      }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
