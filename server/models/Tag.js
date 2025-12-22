import mongoose from "mongoose";

const TagSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true, required: true, lowercase: true, trim: true },
    emoji: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model("Tag", TagSchema);
