import { socketioAuthMiddleware } from "../../middleware/authMiddleware.js";
import Listing from "../../models/Listing.js";
import Message from "../../models/Message.js";
import { ObjectId } from "mongodb";

export default function setupChatNamespace(io) {
  const chatNs = io.of("/chat");

  // Ensure namespace-level auth (do not trust client-provided IDs)
  chatNs.use(socketioAuthMiddleware);

  const getRoomType = (roomId) => (roomId.includes(":") ? "dm" : "listing");

  chatNs.on("connection", (socket) => {
    socket.on("join-room", async (roomId) => {
      if (!roomId) {
        socket.emit("error", { message: "Room ID is required" });
        return;
      }

      // if the user is not authenticated, reject
      const user = socket.data.user;
      if (!user) {
        socket.emit("error", { message: "Unauthorized, please log in." });
        return;
      }

      const type = getRoomType(roomId);

      // For DM rooms, validate that both users are participants (they must be connected already)
      if (type === "dm") {
        const [u1, u2] = roomId.split(":");

        // Validate sender is part of the DM room
        if (user.id !== u1 && user.id !== u2) {
          socket.emit("error", { message: "Not a participant in this DM" });
          return;
        }

        if (!user.connections.includes(u1) || !user.connections.includes(u2)) {
          socket.emit("error", {
            message: "Both users must be connected to participate in this DM",
          });
          return;
        }
      } else if (type === "listing") {
        // only allow users that are connected to the original poster to join the listing room:
        const listingId = roomId;
        const listingOwnerId = (
          await Listing.findById(listingId).select("creator")
        ).creator.toString();

        if (
          user.id !== listingOwnerId &&
          !user.connections.map((c) => c.toString()).includes(listingOwnerId)
        ) {
          socket.emit("error", {
            message: "Only connected users can join this listing room",
          });
          return;
        }
      }

      socket.join(roomId);

      // Load and send previous messages in the room
      const messages = await Message.find({ roomId }).populate("sender", "username screenName");
      for (const msg of messages) {
        socket.emit("chat-message", {
          roomId: msg.roomId,
          text: msg.text,
          sender: {
            id: msg.sender._id,
            username: msg.sender.username,
            screenName: msg.sender.screenName,
          },
          ts: msg.createdAt.getTime(),
        });
      }
    });

    // Listen for chat messages; accept {roomId,text}
    socket.on("chat-message", (payload) => {
      const text = payload?.text?.toString()?.trim();
      const roomId = payload?.roomId;
      if (!roomId || !text) {
        socket.emit("error", { message: "roomId and text are required" });
        return;
      }

      const user = socket.data.user;
      if (!user) {
        socket.emit("error", { message: "Unauthorized, please log in." });
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

      // save to database asynchronously
      Message.create({
        roomId,
        text,
        sender: ObjectId.createFromHexString(user.id),
      });
    });

    socket.on("disconnect", () => {
      // No special handling needed for now
    });
  });

  return chatNs;
}
