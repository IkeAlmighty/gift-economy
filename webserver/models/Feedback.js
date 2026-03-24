import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["feedback", "bug"], required: true },
    message: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    email: { type: String },
  },
  { collection: "feedback", timestamps: true }
);

export default mongoose.model("Feedback", FeedbackSchema);
