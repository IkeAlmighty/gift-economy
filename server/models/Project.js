import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    contributions: [{ type: mongoose.Types.ObjectId, ref: "Contribution" }],
    contributionSuggestions: [{ type: mongoose.Types.ObjectId, ref: "Contribution" }],
    openToRequestSuggesions: Boolean,
    openToGiftSuggestions: Boolean,
    categories: [String],
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
