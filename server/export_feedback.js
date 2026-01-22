import mongoose from "mongoose";
import Feedback from "./models/Feedback.js";
import User from "./models/User.js";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();
const uri = process.env.MONGO_URI || "mongodb://localhost:27017/gift-economy";

async function exportFeedback() {
  await mongoose.connect(uri);
  const feedbacks = await Feedback.find().populate("user");
  let output = "# Feedback Export\n\n";
  feedbacks.forEach((fb, idx) => {
    output += `## Feedback ${idx + 1}\n`;
    output += `**Type:** ${fb.type}\n\n`;
    output += `**Message:**\n> ${fb.message.replace(/\n/g, "\n> ")}\n\n`;
    output += `**Email:** ${fb.email || "N/A"}\n\n`;
    output += `**User:** ${fb.user ? fb.user._id : "Anonymous"}\n\n`;
    output += `**Created:** ${fb.createdAt}\n\n`;
    output += `---\n\n`;
  });
  fs.writeFileSync("feedback.md", output);
  console.log("Exported feedback to feedback.md");
  mongoose.disconnect();
}

exportFeedback();
