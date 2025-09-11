import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
  title: String,
  description: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  listingType: {
    type: String,
    enum: ["Food", "Shelter", "Labor", "Transportation", "Other"],
    default: "Other",
  },
  subtypes: [String],
  completed: Boolean,
});

export default mongoose.model("Request", requestSchema);
