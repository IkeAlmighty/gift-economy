import express from "express";
import Notification from "../models/Notification.js";

const router = express.Router();

// Get all notifications for the logged-in user
router.get("/", async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .lean();
    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server side error" });
  }
});

// Mark a specific notification as read
router.patch("/:id/read", async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findOne({ _id: id, userId: req.user.id });

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    notification.isRead = true;
    await notification.save();

    res.json({ message: "Notification marked as read", notification });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server side error" });
  }
});

// Mark all notifications as read for the logged-in user
router.patch("/read-all", async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user.id, isRead: false }, { isRead: true });
    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server side error" });
  }
});
// Delete a specific notification
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Notification.findOneAndDelete({ _id: id, userId: req.user.id });

    if (!result) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.json({ message: "Notification deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server side error" });
  }
});

// Delete all notifications for the logged-in user
router.delete("/", async (req, res) => {
  try {
    console.log("deleting notifications for user:", req.user.id);
    await Notification.deleteMany({ userId: req.user.id });
    res.json({ message: "All notifications cleared" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server side error" });
  }
});

export default router;
