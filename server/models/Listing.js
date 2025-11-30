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
    listingsSuggestions: [{ type: mongoose.Types.ObjectId, ref: "Listing" }],
    tags: [String],
  },
  { timestamps: true }
);

export default mongoose.model("Listing", ListingSchema);
