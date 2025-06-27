import { useEffect } from "react";
import { getMessaging, getToken } from "firebase/messaging";
import { initializeApp } from "firebase/app";
import apiClient from "@/app/api/apiClient";
import { useSession } from "next-auth/react";

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
  const { data: session } = useSession();

  useEffect(() => {
    const setupFCM = async () => {
      try {
        if (session?.user) {
          // Only request token once if not already granted and stored
          if (
            Notification.permission === "granted" &&
            localStorage.getItem("fcmToken")
          ) {
            return;
          }

          const messaging = getMessaging(app);

          // Solicitar permisos si no ha sido concedido
          if (Notification.permission !== "granted") {
            const permission = await Notification.requestPermission();
            if (permission !== "granted") return;
          }

          // Obtener token FCM
          const token = await getToken(messaging, {
            vapidKey:
              "BAt0qzq_29FehDspXF44THssvagrCEBELNbae6gJe3cMRG_KsODiwiG4E3hdo5eEId7RS6isQqxEkxqO_fSp7eg",
          });

          if (token) {
            console.log("Token FCM:", token);
            // Store token to avoid duplicate requests
            localStorage.setItem("fcmToken", token);

            // Enviar token al backend
            await apiClient.post("/save-token", { token });
          }
        }
      } catch (error) {
        console.error("Error FCM:", error);
      }
    };

    setupFCM();
  }, [session]);

  return null;
};

export default FCMSetup;
