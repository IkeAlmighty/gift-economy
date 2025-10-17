import express from "express";
import Contribution from "../models/Contribution.js";
import User from "../models/User.js";
import { upload } from "../middleware/upload.js"; // middleware for parseing files sent to the server

const router = express.Router();

// Get all gifts
router.get("/gifts", async (req, res) => {
  const gifts = await Contribution.find({ creator: req.user.id, intent: "GIFT" }).populate(
    "creator"
  );
  res.json(gifts);
});

// Get all requests
router.get("/my-requests", async (req, res) => {
  const requests = await Contribution.find({ creator: req.user.id, intent: "REQUEST" }).populate(
    "creator"
  );
  res.json(requests);
});

// Get all listings created by the loggged in user (gifts, requests, and projects)
router.get("/my-listings", async (req, res) => {
  const listings = await Contribution.find({ creator: req.user.id }).populate("creator");
  res.json(listings);
});

router.get("/listings-in-network", async (req, res) => {
  // TODO:
});

// Create contribution (gift or request)
router.post("/my-listings", upload.single("image"), async (req, res) => {
  // TODO: upload image file to image server:

  const { intent, description, title } = req.body;

  const contribution = await new Contribution({
    title,
    categories: JSON.parse(req.body.categories),
    intent,
    description,
    creator: req.user.id,
  }).save();

  await User.findByIdAndUpdate(req.user.id, { $push: { contributions: contribution._id } });

  res.json(contribution);
});

router.get("/saved-projects", async (req, res) => {
  // TODO: get the projects user has saved to their savedProjects field
});

export default router;
