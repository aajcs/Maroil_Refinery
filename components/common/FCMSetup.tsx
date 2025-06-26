import { useEffect } from "react";
import { getMessaging, getToken } from "firebase/messaging";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCY6v4KIMlFWRc9jjCqtZVStCrjVfOx50E",
  authDomain: "maroilrefinery.firebaseapp.com",
  projectId: "maroilrefinery",
  storageBucket: "maroilrefinery.firebasestorage.app",
  messagingSenderId: "666748400455",
  appId: "1:666748400455:web:5849c3c31f79cd82bf1262",
};

const app = initializeApp(firebaseConfig);

const FCMSetup = () => {
  useEffect(() => {
    const setupFCM = async () => {
      try {
        const messaging = getMessaging(app);

        // Solicitar permisos
        const permission = await Notification.requestPermission();

        if (permission === "granted") {
          // Obtener token FCM
          const token = await getToken(messaging, {
            vapidKey:
              "BAt0qzq_29FehDspXF44THssvagrCEBELNbae6gJe3cMRG_KsODiwiG4E3hdo5eEId7RS6isQqxEkxqO_fSp7eg",
          });

          if (token) {
            console.log("Token FCM:", token);

            // Enviar token al backend Express
            await fetch("http://localhost:8082/api/save-token", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ token }),
            });
          }
        }
      } catch (error) {
        console.error("Error FCM:", error);
      }
    };

    setupFCM();
  }, []);

  return null;
};

export default FCMSetup;
