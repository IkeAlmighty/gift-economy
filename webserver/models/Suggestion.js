import mongoose from "mongoose";

const SuggestionSchema = new mongoose.Schema(
  {
    parentListing: { type: mongoose.Schema.Types.ObjectId, ref: "Listing" },
    childListing: { type: mongoose.Schema.Types.ObjectId, ref: "Listing" },
    suggestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    childOwnerStatus: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "REJECTED"],
      default: "PENDING",
    },
    parentOwnerStatus: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "REJECTED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Suggestion", SuggestionSchema);
