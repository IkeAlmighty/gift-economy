import express from "express";
import Tag from "../models/Tag.js";

const router = express.Router();

function isOnlyEmojis(str) {
  const emojiRegex = /^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)+$/u;
  return emojiRegex.test(str.trim());
}

// Get all tags
router.get("/", async (_req, res) => {
  try {
    const tags = await Tag.find().sort({ name: 1 });
    res.json(tags);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Create or update a tag
router.post("/", async (req, res) => {
  const { name, emoji } = req.body;
  if (!name || !emoji) {
    return res.status(400).json({ error: "name and emoji are required" });
  }

  if (!isOnlyEmojis(emoji)) {
    return res.status(400).json({ error: "The emoji field must contain only emojis" });
  }

  try {
    const normalized = name.trim().toLowerCase();

    // Check if tag already exists
    const existingTag = await Tag.findOne({ name: normalized });
    if (existingTag) {
      return res.status(409).json({ error: `The tag '${existingTag.name}' already exists` });
    }

    const tag = await Tag.create({ name: normalized, emoji: emoji.trim() });
    res.json(tag);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
