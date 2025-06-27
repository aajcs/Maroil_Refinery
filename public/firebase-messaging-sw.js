importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyCY6v4KIMlFWRc9jjCqtZVStCrjVfOx50E",
  authDomain: "maroilrefinery.firebaseapp.com",
  projectId: "maroilrefinery",
  storageBucket: "maroilrefinery.firebasestorage.app",
  messagingSenderId: "666748400455",
  appId: "1:666748400455:web:5849c3c31f79cd82bf1262",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Manejar notificaciones en segundo plano
messaging.onBackgroundMessage((payload) => {
  console.log("[Firebase] Notificación en segundo plano:", payload);

  const { title, body, image } = payload.notification || {};
  // Use unique tag based on notification ID
  const tag = payload.data?._id || payload.data?.id || "default-tag";

  const notificationOptions = {
    body,
    icon: "/icon-192x192.png",
    badge: "/badge-96x96.png",
    image: image,
    vibrate: [200, 100, 200], // Vibración para dispositivos móviles
    data: payload.data, // Mantén los datos originales
    tag, // ensure uniqueness
  };

  // Mostrar notificación solo si no hay ventana enfocada
  return self.clients
    .matchAll({ type: "window", includeUncontrolled: true })
    .then((clientList) => {
      const windowFocused = clientList.some(
        (client) => client.visibilityState === "visible"
      );
      if (!windowFocused) {
        self.registration.getNotifications({ tag }).then((existing) => {
          if (!existing.length) {
            self.registration.showNotification(
              title || "Nueva notificación",
              notificationOptions
            );
          }
        });
      }
    });
});

// Manejar clic en notificación
self.addEventListener("notificationclick", (event) => {
  console.log("Notificación clickeada", event.notification.data);
  event.notification.close();

  // Usa el link del payload o uno por defecto
  const urlToOpen = new URL(
    event.notification.data?.link || "/",
    self.location.origin
  ).href;

  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      // Busca si ya hay una pestaña abierta con esta URL
      for (const client of clientList) {
        if (client.url === urlToOpen && "focus" in client) {
          return client.focus();
        }
      }

      // Si no hay ninguna, abre una nueva
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Manejar cierre de notificación (opcional)
self.addEventListener("notificationclose", (event) => {
  console.log("Notificación cerrada", event.notification);
});
