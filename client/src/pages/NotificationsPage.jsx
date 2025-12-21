import { useNotifications } from "../Contexts/NotificationsContext";
import { Link } from "react-router";

export default function NotificationsPage() {
  const { notifications, markAsRead, markAllAsRead, deleteNotification, clearNotifications } =
    useNotifications();
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = async (id) => {
    await markAsRead(id);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleDelete = async (id) => {
    await deleteNotification(id);
  };

  const handleClearAll = async () => {
    if (confirm("Are you sure you want to delete all notifications? This cannot be undone.")) {
      await clearNotifications();
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Mark all as read ({unreadCount})
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={handleClearAll}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          <p className="text-xl">No notifications yet</p>
          <p className="mt-2">You'll see updates here when things happen</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`p-4 rounded-lg border-2 ${
                notification.isRead
                  ? "bg-white border-gray-200"
                  : "bg-blue-50 border-blue-300 font-semibold"
              }`}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <p className="text-gray-800">{notification.message}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {notification.link && (
                    <Link
                      to={notification.link}
                      className="px-3 py-1 bg-secondary rounded hover:bg-blue-200"
                    >
                      View
                    </Link>
                  )}
                  {!notification.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(notification._id)}
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                    >
                      Mark read
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notification._id)}
                    className="px-3 py-1 bg-red-100 rounded hover:bg-red-200 text-sm"
                    title="Delete notification"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
