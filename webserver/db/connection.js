import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

if (process.env.NODE_ENV !== "test") {
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/gift-economy";
  mongoose.connect(uri);
}

export default mongoose.connection;
