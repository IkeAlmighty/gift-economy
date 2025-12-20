import { Link } from "react-router";
import { useNotifications } from "../Contexts/NotificationsContext";

export default function NotificationBell() {
  const { notifications } = useNotifications();
  const unread = notifications.filter((n) => !n.isRead).length;
  const hasUnread = unread > 0;

  return (
    <div className={`text-2xl ${hasUnread ? "animate-bounce" : ""}`}> 
      <Link to="/notifications" aria-label={hasUnread ? `${unread} unread notifications` : "Notifications"}>
        🔔
      </Link>
    </div>
  );
}
