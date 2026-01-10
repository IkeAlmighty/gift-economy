import express from "express";
import Listing from "../models/Listing.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import { upload } from "../middleware/upload.js"; // middleware for parseing files sent to the server

const router = express.Router();

// get listing by id, if the user is permitted to see it
router.get("/", async (req, res) => {
  const { _id } = req.query;

  try {
    let listing = await Listing.findById(_id);
    const me = await User.findById(req.user.id);

    if (listing.creator.toString() === me._id.toString()) {
      // if the listing was created by the user currently logged in, populate everything
      listing = await Listing.findById(_id).populate("listings listingsSuggestions");
    } else if (me.connections.includes(listing.creator)) {
      // else if the listing was created by a connection, the deselect listingsSuggestions
      listing = await Listing.findById(_id).select("-listingsSuggestions").populate("listings");
    } else {
      return res.status(401).json({ error: "You are not permitted to view this listing." });
    }

    return res.json(listing);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server side error" });
  }
});

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
    const listings = await Listing.find({ creator: req.user.id }).populate(
      "creator",
      "username screenName"
    );
    res.json(listings);
  } catch (err) {
    console.log(err);
  }
});

router.get("/saved-listings", async (req, res) => {
  try {
    const me = await User.findById(req.user.id).populate({
      path: "savedProjects",
      populate: { path: "creator", select: "username screenName" },
    });
    return res.json(me.savedProjects);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server Side Error" });
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
    await me.save();

    // Notify the listing creator that their listing was saved
    try {
      const listing = await Listing.findById(_id).select("creator title");
      if (listing && listing.creator.toString() !== me._id.toString()) {
        const saver = await User.findById(me._id).select("username");
        await new Notification({
          userId: listing.creator,
          message: `${saver.username} saved your listing "${listing.title}"`,
          link: `/listing/${_id}`,
        }).save();
      }
    } catch (e) {}
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server Side Error" });
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
        select: "username screenName",
      },
    });

    listingsInNetwork = [...listingsInNetwork, ...connection?.listings];
  }

  // return list
  res.json(listingsInNetwork);
});

// Create listing (gift or request)
router.post("/my-listings", upload.single("image"), async (req, res) => {
  // TODO: upload image file to image server:

  const { intent, description, title } = req.body;

  const allowedSuggestions = [];

  if (req.body.allowGiftSuggestions === "true") allowedSuggestions.push("GIFT");
  if (req.body.allowRequestSuggestions === "true") allowedSuggestions.push("REQUEST");
  if (req.body.allowProjectSuggestions === "true") allowedSuggestions.push("PROJECT");

  const listing = await new Listing({
    title,
    tags: JSON.parse(req.body.tags),
    intent,
    allowedSuggestions,
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

router.delete("/saved-listings", async (req, res) => {
  const { _id } = req.query;
  try {
    const me = await User.findById(req.user.id);
    await me.savedProjects.pull(_id);
    await me.save();
    res.json({ message: "Removed from saved listings!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Side Error" });
  }
});

router.patch("/suggest", async (req, res) => {
  const { suggest, to } = req.query;
  if (suggest === to) {
    return res.status(400).json({ error: "You cannot suggest a listing to itself." });
  }

  try {
    const listingTo = await Listing.findById(to);
    const listingSuggest = await Listing.findById(suggest);

    if (!listingTo.allowedSuggestions.includes(listingSuggest.intent)) {
      return res.status(400).json({
        error: `Suggestions of type ${listingSuggest.intent} are not allowed for this project.`,
      });
    }

    listingTo.listingsSuggestions.addToSet(suggest);
    await listingTo.save();

    // Notify the owner of the target listing about the suggestion
    try {
      const suggester = await User.findById(req.user.id).select("username");
      const suggested = await Listing.findById(suggest).select("title");
      await new Notification({
        userId: listingTo.creator,
        message: `${suggester.username} suggested: "${suggested?.title ?? "a listing"}" to your project`,
        link: `/listing/${to}`,
      }).save();
    } catch (e) {}
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server Side Error" });
  }

  res.json({ message: "Suggestion sent!" });
});

// route for accepting or denying suggestions to a project:
router.patch("/handle-suggestion", async (req, res) => {
  const { listingId, suggestionId, action } = req.query;

  try {
    const listing = await Listing.findById(listingId);
    const suggestion = await Listing.findById(suggestionId);

    // default behavior always removes the suggestion from the project's suggestions list
    // accepting suggestion just adds an additional step:

    if (action === "accept") {
      listing.listings.addToSet(suggestionId);
      await Notification.create({
        userId: suggestion.creator,
        message: `Your suggestion "${suggestion.title}" was accepted!`,
        link: `/listing/${listingId}`,
      });
    }

    listing.listingsSuggestions.pull(suggestionId);
    await listing.save();
    return res.json({ message: `Suggestion ${action}ed successfully.` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server Side Error" });
  }
});

router.patch("/remove-confirmed-suggestion", async (req, res) => {
  const { listingId, suggestionId } = req.query;
  try {
    const suggestionCreator = await Listing.findById(suggestionId).populate("creator");
    const listing = await Listing.findById(listingId);
    listing.listings.pull(suggestionId);
    await listing.save();

    await Notification.create({
      userId: suggestionCreator._id,
      message: `Your confirmed suggestion was removed from the project.`,
      link: `/listing/${listingId}`,
    });

    return res.json({ message: "Confirmed suggestion removed successfully." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server Side Error" });
  }
});

export default router;
