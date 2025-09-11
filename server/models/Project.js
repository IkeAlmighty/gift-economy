import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  requests: [{ type: mongoose.Types.ObjectId, ref: "Request" }],
  requestSuggestions: [{ type: mongoose.Types.ObjectId, ref: "Request" }],
  openToRequestSuggesions: Boolean,
  giftSuggestions: [{ type: mongoose.Types.ObjectId, ref: "Gift" }],
  openToGiftSuggestions: Boolean,
  listingType: {
    type: String,
    enum: ["Food", "Shelter", "Labor", "Transportation", "Other"],
    default: "Other",
  },
  subtypes: [String],
});

export default mongoose.model("Project", projectSchema);
