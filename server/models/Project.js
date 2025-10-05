import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  contributions: [{ type: mongoose.Types.ObjectId, ref: "Contribution" }],
  contributionSuggestions: [{ type: mongoose.Types.ObjectId, ref: "Contribution" }],
  openToRequestSuggesions: Boolean,
  openToGiftSuggestions: Boolean,
  category: {
    type: String,
    enum: ["Food", "Shelter", "Labor", "Transportation", "Other"],
    default: "Other",
  },
  labels: [String],
});

export default mongoose.model("Project", projectSchema);
