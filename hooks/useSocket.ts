import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export const useSocket = (serverPath: string): Socket | null => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Solo inicializar Socket.io en el cliente
    if (typeof window !== "undefined") {
      const socketConnection = io(serverPath, {
        transports: ["websocket"], // Usar solo WebSockets
        autoConnect: true, // Conectar automáticamente
        forceNew: true, // Forzar una nueva conexión
      });

      // Guardar la instancia del socket en el estado
      setSocket(socketConnection);

      // Limpiar la conexión al desmontar el componente
      return () => {
        socketConnection.disconnect();
      };
    }
  }, [serverPath]);

  return socket;
};
