import { useCallback, useEffect, useState } from "react";
import { getNotificationsByUserId } from "@/app/api/notificationService";
import { Notification } from "@/libs/interfaces";
export interface NotificationResponse {
  total: number; // Total de notificaciones
  notifications: Notification[]; // Array de notificaciones
}
export const useNotifications = (userId: string) => {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<NotificationResponse>({
    total: 0,
    notifications: [],
  });

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const notificationData = await getNotificationsByUserId(userId);
      setNotifications(notificationData);
    } catch (error) {
      console.error("Error al obtener las notificaciones por usuario:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchNotifications();
    }
  }, [userId, fetchNotifications]);

  return {
    loading,
    notifications,
  };
};
