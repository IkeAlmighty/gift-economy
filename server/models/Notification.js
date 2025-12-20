import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    link: { type: String },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Emit to the user's socket room when a notification is created
notificationSchema.post("save", function (doc) {
  try {
    if (global.io && doc && doc.userId) {
      const payload = {
        id: doc._id,
        userId: doc.userId,
        message: doc.message,
        link: doc.link,
        isRead: doc.isRead,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      };
      global.io.to(`user:${doc.userId.toString()}`).emit("notification", payload);
    }
  } catch (err) {
    // fail silently; notifications should not crash writes
  }
});

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
