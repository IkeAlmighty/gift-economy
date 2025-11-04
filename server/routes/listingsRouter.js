import express from "express";
import Listing from "../models/listing.js";
import User from "../models/User.js";
import { upload } from "../middleware/upload.js"; // middleware for parseing files sent to the server

const router = express.Router();

// Get all gifts
router.get("/gifts", async (req, res) => {
  const gifts = await Listing.find({ creator: req.user.id, intent: "GIFT" });
  res.json(gifts);
});

// Get all requests
router.get("/my-requests", async (req, res) => {
  const requests = await Listing.find({ creator: req.user.id, intent: "REQUEST" });
  res.json(requests);
});

// Get all listings created by the loggged in user (gifts, requests, and projects)
router.get("/my-listings", async (req, res) => {
  try {
    const listings = await Listing.find({ creator: req.user.id });
    res.json(listings);
  } catch (err) {
    console.log(err);
  }
});

router.get("/listings-in-network", async (req, res) => {
  //TODO for now, return nothing
  res.json([]);
});

// Create listing (gift or request)
router.post("/my-listings", upload.single("image"), async (req, res) => {
  // TODO: upload image file to image server:

  const { intent, description, title } = req.body;

  const listing = await new Listing({
    title,
    categories: JSON.parse(req.body.categories),
    intent,
    description,
    creator: req.user.id,
  }).save();

  await User.findByIdAndUpdate(req.user.id, { $push: { listings: listing._id } });

  res.json(listing);
});

router.get("/saved-projects", async (req, res) => {
  // TODO: get the projects user has saved to their savedProjects field
});

export default router;
