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
  let output = "";
  feedbacks.forEach((fb) => {
    output += `Type: ${fb.type}\nMessage: ${fb.message}\nEmail: ${fb.email || "N/A"}\nUser: ${fb.user ? fb.user._id : "Anonymous"}\nCreated: ${fb.createdAt}\n---\n`;
  });
  fs.writeFileSync("feedback.txt", output);
  console.log("Exported feedback to feedback.txt");
  mongoose.disconnect();
}

exportFeedback();
