import { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useUser } from './UserContext';

const NotificationsContext = createContext();

export function useNotifications() {
  return useContext(NotificationsContext);
}

export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      // Connect to the server
      const newSocket = io('http://localhost:3000'); // Adjust URL as needed
      setSocket(newSocket);

      // Listen for notifications
      newSocket.on('notification', (notification) => {
        setNotifications((prev) => [...prev, notification]);
      });

      // Optionally, join a room for the user
      newSocket.emit('join', user._id);

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

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationsContext.Provider value={{ notifications, markAsRead, clearNotifications }}>
      {children}
    </NotificationsContext.Provider>
  );
}
