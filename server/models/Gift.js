import mongoose from "mongoose";

const giftSchema = new mongoose.Schema({
  title: String,
  description: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  listingType: {
    type: String,
    enum: ["Food", "Shelter", "Labor", "Transportation", "Other"],
    default: "Other",
  },
  subtypes: [String],
  suggestedProjects: [{ type: mongoose.Types.ObjectId, ref: "Project" }],
});

export default mongoose.model("Gift", giftSchema);
