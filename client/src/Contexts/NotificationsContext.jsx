import { createContext, useContext, useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useUser } from "./UserContext";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  clearAllNotifications,
  deleteNotification,
} from "../endpoints/notifications";

const NotificationsContext = createContext();

export function useNotifications() {
  return useContext(NotificationsContext);
}

export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);
  const { user } = useUser();

  // Fetch notifications from server on mount when user is logged in
  useEffect(() => {
    if (user) {
      async function fetchNotifications() {
        try {
          const res = await getNotifications();
          if (res.ok) {
            const data = await res.json();
            setNotifications(data);
          }
        } catch (err) {
          console.error("Failed to fetch notifications:", err);
        }
      }
      fetchNotifications();
    } else {
      setNotifications([]);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      // Connect to the server
      const socketBase = import.meta.env.VITE_SOCKET_SERVER_URL || window.location.origin;

      const newSocket = io(socketBase, { withCredentials: true });

      setSocket(newSocket);

      // Listen for notifications
      newSocket.on("notification", (notification) => {
        setNotifications((prev) => [notification, ...prev]);
      });

      return () => {
        newSocket.disconnect();
        setSocket(null);
      };
    } else {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [user]);

  const markAsRead = async (id) => {
    try {
      const res = await markNotificationAsRead(id);
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((notif) => (notif._id === id ? { ...notif, isRead: true } : notif))
        );
      }
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const res = await markAllNotificationsAsRead();
      if (res.ok) {
        setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })));
      }
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
    }
  };

  const _deleteNotification = async (id) => {
    try {
      const res = await deleteNotification(id);
      if (res.ok) {
        setNotifications((prev) => prev.filter((notif) => notif._id !== id));
      }
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const clearNotifications = async () => {
    try {
      const res = await clearAllNotifications();
      if (res.ok) {
        setNotifications([]);
      }
    } catch (err) {
      console.error("Failed to clear notifications:", err);
    }
  };

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        markAsRead,
        markAllAsRead,
        deleteNotification: _deleteNotification,
        clearNotifications,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}
