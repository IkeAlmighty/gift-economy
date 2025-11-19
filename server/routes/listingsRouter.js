import express from "express";
import Listing from "../models/Listing.js";
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

router.post("/saved-listings", async (req, res) => {
  const { _id } = req.body;
  try {
    const me = await User.findById(req.user.id);

    if (me.savedProjects.includes(_id)) {
      return res
        .status(409)
        .json({ error: "Listing has already been added to your saved listings." });
    }

    await me.savedProjects.addToSet(_id);
  } catch (err) {
    console.error(err);
    return res.json({ error: "Server Side Error" });
  }

  res.json({ message: "Listing saved!" });
});

router.get("/listings-in-network", async (req, res) => {
  // get all connections
  const me = await User.findById(req.user.id);

  // for each connection, append all the connection's listings to return list
  let listingsInNetwork = [];
  for (let id of me.connections) {
    const connection = await User.findById(id).populate({
      path: "listings",
      model: Listing,
      populate: {
        path: "creator",
        select: "username",
      },
    });
    listingsInNetwork = [...listingsInNetwork, ...connection.listings];
  }

  // return list
  res.json(listingsInNetwork);
});

// Create listing (gift or request)
router.post("/my-listings", upload.single("image"), async (req, res) => {
  // TODO: upload image file to image server:

  const { intent, description, title } = req.body;

  const listing = await new Listing({
    title,
    tags: JSON.parse(req.body.tags),
    intent,
    description,
    creator: req.user.id,
  }).save();

  await User.findByIdAndUpdate(req.user.id, { $push: { listings: listing._id } });

  res.json(listing);
});

router.delete("/", async (req, res) => {
  const { _id } = req.query;
  await Listing.findByIdAndDelete(_id);
  res.json({ message: "Deleted Listing!" });
});

router.patch("/suggest", (req, res) => {});

export default router;
