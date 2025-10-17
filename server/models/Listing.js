import mongoose from "mongoose";

const LListingSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    intent: {
      type: String,
      enum: ["GIFT", "REQUEST", "PROJECT"],
    },
    contributions: [{ type: mongoose.Types.ObjectId, ref: "Listing" }],
    contributionSuggestions: [{ type: mongoose.Types.ObjectId, ref: "Listing" }],
    tags: [String],
    suggestedProjects: [{ type: mongoose.Types.ObjectId, ref: "Listing" }],
  },
  { timestamps: true }
);

export default mongoose.model("Listing", LListingSchema);
