import axios from "axios";
import { getSession, signOut } from "next-auth/react";

interface ExtendedUser {
  token: string;
}

const apiClient = axios.create({
  baseURL: "http://localhost:8080/api",
  // baseURL: "https://api-maroil-refinery-2500582bacd8.herokuapp.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token a cada solicitud
apiClient.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    const token = (session?.user as ExtendedUser)?.token;
    if (token) {
      config.headers["x-token"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// 2) Interceptor de respuesta: captura logout o 401
apiClient.interceptors.response.use(
  (response) => {
    if (response.data?.logout) {
      window.alert("Sesión expirada. Por favor inicie sesión nuevamente.");
      signOut({ callbackUrl: "/auth/login" });
      // opcionalmente bloquear más lógica:
      return Promise.reject(new Error("Logout triggered"));
    }
    return response;
  }
  // (error) => {
  //   if (error.response?.status === 401) {
  //     window.alert("No autorizado. Por favor inicie sesión nuevamente.");
  //     signOut({ callbackUrl: "/login" });
  //   }
  //   return Promise.reject(error);
  // }
);

export default apiClient;
