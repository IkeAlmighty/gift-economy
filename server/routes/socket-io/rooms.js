import { socketioAuthMiddleware } from "../../middleware/authMiddleware.js";

export default function setupChatNamespace(io) {
  const chatNs = io.of("/chat");

  // Ensure namespace-level auth (do not trust client-provided IDs)
  chatNs.use(socketioAuthMiddleware);

  const getRoomType = (roomId) => (roomId.includes(":") ? "dm" : "listing");

  chatNs.on("connection", (socket) => {
    socket.on("join-room", (roomId) => {
      if (!roomId) {
        socket.emit("error", { message: "Room ID is required" });
        return;
      }

      const user = socket.data.user;
      if (!user) {
        socket.emit("error", { message: "Unauthorized" });
        return;
      }

      const type = getRoomType(roomId);

      if (type === "dm") {
        const [u1, u2] = roomId.split(":");
        // Validate sender is part of the DM room
        if (user.id !== u1 && user.id !== u2) {
          socket.emit("error", { message: "Not a participant in this DM" });
          return;
        }
      }

      socket.join(roomId);
      socket.emit("room-joined", { roomId, type });
    });

    // Listen for chat messages; accept {roomId,text} or legacy {listingId,text}
    socket.on("chat-message", (payload) => {
      const text = payload?.text?.toString()?.trim();
      const roomId = payload?.roomId;
      if (!roomId || !text) {
        socket.emit("error", { message: "roomId and text are required" });
        return;
      }

      const user = socket.data.user;
      if (!user) {
        socket.emit("error", { message: "Unauthorized" });
        return;
      }

      const type = getRoomType(roomId);
      if (type === "dm") {
        const [u1, u2] = roomId.split(":");
        if (user.id !== u1 && user.id !== u2) {
          socket.emit("error", { message: "Not a participant in this DM" });
          return;
        }
      }

      const message = {
        roomId,
        text,
        sender: { id: user.id, username: user.username, screenName: user.screenName },
        ts: Date.now(),
      };

      // Emit to everyone in the room (including sender)
      chatNs.to(roomId).emit("chat-message", message);
    });

    socket.on("disconnect", () => {
      // Optional: handle presence/cleanup here
    });
  });

  return chatNs;
}
