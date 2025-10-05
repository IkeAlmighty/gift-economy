import mongoose from "mongoose";

const contributionSchema = new mongoose.Schema({
  title: String,
  description: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  intent: {
    type: String,
    enum: ["GIFT", "REQUEST"],
  },
  category: {
    type: String,
    enum: ["FOOD", "SHELTER", "LABOR", "TRANSPORTATION", "OTHER"],
    default: "OTHER",
  },
  labels: [String],
  suggestedProjects: [{ type: mongoose.Types.ObjectId, ref: "Project" }],
});

export default mongoose.model("Contribution", contributionSchema);
