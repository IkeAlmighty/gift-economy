import { socketioAuthMiddleware } from "../../middleware/authMiddleware.js";

export default function setupNotificationsNamespace(io) {
  const notificationsNs = io.of("/notifications");

  // Ensure namespace-level auth
  notificationsNs.use(socketioAuthMiddleware);

  notificationsNs.on("connection", (socket) => {
    console.log("User connected to notifications:", socket.id);

    socket.on("ping", () => socket.emit("pong"));

    socket.on("disconnect", () => {
      console.log("User disconnected from notifications:", socket.id);
    });
  });

  return notificationsNs;
}
