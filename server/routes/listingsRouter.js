import express from "express";
import Contribution from "../models/Contribution.js";
import User from "../models/User.js";
import { upload } from "../middleware/upload.js"; // middleware for parseing files sent to the server

const router = express.Router();

// Get all gifts
router.get("/gifts", async (req, res) => {
  const gifts = await Contribution.find({ owner: req.user.id, intent: "GIFT" }).populate("owner");
  res.json(gifts);
});

// Get all requests
router.get("/requests", async (req, res) => {
  const requests = await Contribution.find({ owner: req.user.id, intent: "REQUEST" }).populate(
    "owner"
  );
  res.json(requests);
});

// Get all contributions (gifts and requests)
router.get("/contributions", async (req, res) => {
  const contributions = await Contribution.find({ owner: req.user.id }).populate("owner");
  res.json(contributions);
});

// Create contribution (gift or request)
router.post("/contributions", upload.single("image"), async (req, res) => {
  // TODO: upload image file to image server:

  const { intent, description, title } = req.body;

  const contribution = await new Contribution({
    title,
    categories: JSON.parse(req.body.categories),
    intent,
    description,
    owner: req.user.id,
  }).save();

  await User.findByIdAndUpdate(req.user.id, { $push: { contributions: contribution._id } });

  res.json(contribution);
});

export default router;
