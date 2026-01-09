import express from "express";
import Feedback from "../models/Feedback.js";

const router = express.Router();

// POST /api/feedback
router.post("/", async (req, res) => {
  try {
    const { type, message, email } = req.body;
    console.log(req.body);

    if (!type || !message) {
      return res.status(400).json({ error: "Type and message are required." });
    }
    await Feedback.create({ type, message, email, user: req.user.id });
    res.status(201).json({ message: "Feedback submitted. Thank you!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to submit feedback." });
  }
});

export default router;
