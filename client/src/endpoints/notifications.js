export async function getNotifications() {
  return fetch("/api/notifications", {
    method: "GET",
    credentials: "include",
  });
}

export async function markNotificationAsRead(id) {
  return fetch(`/api/notifications/${id}/read`, {
    method: "PATCH",
    credentials: "include",
  });
}

export async function markAllNotificationsAsRead() {
  return fetch("/api/notifications/read-all", {
    method: "PATCH",
    credentials: "include",
  });
}

export async function deleteNotification(id) {
  return fetch(`/api/notifications/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
}

export async function clearAllNotifications() {
  return fetch("/api/notifications", {
    method: "DELETE",
    credentials: "include",
  });
}
