import mongoose from "mongoose";

const ListingSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    intent: {
      type: String,
      enum: ["GIFT", "REQUEST", "PROJECT"],
    },
    listings: [{ type: mongoose.Types.ObjectId, ref: "Listing" }],
    parent: { type: mongoose.Types.ObjectId, ref: "Listing" },
    allowedSuggestions: [String],
    tags: [String],
    messages: [{ type: mongoose.Types.ObjectId, ref: "Message" }],
  },
  { timestamps: true }
);

export default mongoose.model("Listing", ListingSchema);
