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

// Manejar notificaciones en primer plano
messaging.onMessage((payload) => {
  console.log("Notificación en primer plano:", payload);
  // Mostrar notificación manualmente
  const { title, body } = payload.notification;
  new Notification(title, { body });
});

// Manejar notificaciones en segundo plano
messaging.onBackgroundMessage((payload) => {
  console.log("Notificación en segundo plano:", payload);
  const { title, body } = payload.notification;
  const notificationOptions = {
    body,
    icon: "/icon.png",
  };

  self.registration.showNotification(title, notificationOptions);
});

// Manejar clic en notificación
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow("https://tudominio.com"));
});
