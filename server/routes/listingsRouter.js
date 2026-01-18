import express from "express";
import Listing from "../models/Listing.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import Suggestion from "../models/Suggestion.js";
import { upload } from "../middleware/upload.js"; // middleware for parseing files sent to the server

const router = express.Router();

// get listing by id, if the user is permitted to see it
router.get("/", async (req, res) => {
  const { _id } = req.query;

  try {
    let listing = await Listing.findById(_id).populate({
      path: "creator",
      select: "username screenName",
    });
    const me = await User.findById(req.user.id);

    if (
      listing.creator._id.toString() === me._id.toString() ||
      me.connections.includes(listing.creator._id)
    ) {
      // if the listing was created by the user currently logged in, or if the listing creator is in the user's connections,
      // then populate the child listings
      await listing.populate([
        {
          path: "listings",
          populate: { path: "creator", select: "username screenName" },
        },
        {
          path: "parent",
          populate: { path: "creator", select: "username screenName" },
        },
      ]);
    } else {
      return res.status(401).json({
        error: `You are not permitted to view this listing. Send a connection request to '${listing.creator.username}' to view it.`,
      });
    }

    return res.json(listing);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server side error" });
  }
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

// Get suggestions for a listing (both as child and as parent)
router.get("/suggestions", async (req, res) => {
  const { listingId } = req.query;

  try {
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ error: "Listing not found." });
    }

    // Verify user has permission to view this listing's suggestions
    const me = await User.findById(req.user.id);
    if (listing.creator.toString() !== me._id.toString()) {
      return res
        .status(403)
        .json({ error: "You do not have permission to view these suggestions." });
    }

    // Get suggestions where this listing is the parent (suggestions to THIS project)
    const parentSuggestions = await Suggestion.find({ parentListing: listingId })
      .populate("childListing parentListing")
      .populate("suggestedBy", "username");

    // Get suggestions where this listing is the child (suggestions to OTHER projects)
    const childSuggestions = await Suggestion.find({ childListing: listingId })
      .populate("parentListing childListing")
      .populate("suggestedBy", "username");

    res.json({ parentSuggestions, childSuggestions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Side Error" });
  }
});

router.get("/listings-in-network", async (req, res) => {
  try {
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
  } catch (err) {
    console.log(err);
    res.status(500).send("Server side Error");
  }
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

router.delete("/remove-parent", async (req, res) => {
  const { _id } = req.query;
  try {
    const listing = await Listing.findById(_id);
    const parent = await Listing.findById(listing.parent);
    parent.listings.pull(_id);
    await parent.save();

    listing.parent = null;
    await listing.save();

    res.json({ message: "Parent listing removed successfully." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server side error" });
  }
});

router.patch("/suggest", async (req, res) => {
  const { suggest, to } = req.query;
  if (suggest === to) {
    return res.status(400).json({ error: "You cannot suggest a listing to itself." });
  }

  // grab the listings to verify they exist and are compatible
  let childListing, parentListing;
  try {
    childListing = await Listing.findById(suggest);
    parentListing = await Listing.findById(to);

    if (!childListing || !parentListing) {
      return res.status(404).json({ error: "One or both listings not found." });
    }

    // verify that the parent listing accepts suggestions of the child's intent type
    if (!parentListing.allowedSuggestions.includes(childListing.intent)) {
      return res
        .status(400)
        .json({ error: "This listing does not accept suggestions of that type." });
    }

    // if the creator, owner, and suggester are all the same, then directly update
    // the listings object:
    if (
      childListing.creator.toString() === req.user.id &&
      parentListing.creator.toString() === req.user.id
    ) {
      parentListing.listings.addToSet(suggest);
      await parentListing.save();
      return res.json({ message: "Suggestion added directly to listings." });
    }

    // check to see if the suggestion already exists:
    const existingSuggestion = await Suggestion.findOne({
      childListing: suggest,
      parentListing: to,
    });

    if (existingSuggestion) {
      return res.status(409).json({ error: "This suggestion has already been made." });
    }

    // otherwise, create a suggestion doc:
    await new Suggestion({
      childListing: suggest,
      parentListing: to,
      suggestedBy: req.user.id,
    }).save();

    // notify the child listing owner and the parent listing owner:
    const childListingOwnerId = childListing.creator.toString();
    const parentListingOwnerId = parentListing.creator.toString();

    await Notification.create({
      userId: childListingOwnerId,
      message: `Your listing "${childListing.title}" was suggested to the project "${parentListing.title}". Accept or Deny the suggestion.`,
      link: `/listing/${childListing._id}`,
    });

    await Notification.create({
      userId: parentListingOwnerId,
      message: `A new listing "${childListing.title}" was suggested to your project "${parentListing.title}". Accept or Deny the suggestion.`,
      link: `/listing/${parentListing._id}`,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server Side Error" });
  }

  res.json({ message: "Suggestion sent!" });
});

// route for accepting or denying suggestions to a project:
router.patch("/handle-suggestion", async (req, res) => {
  const { suggested, to, action } = req.query;

  try {
    const suggestion = await Suggestion.findOne({
      childListing: suggested,
      parentListing: to,
    }).populate("childListing parentListing");

    if (!suggestion) {
      return res.status(404).json({ error: "Suggestion not found." });
    }

    // if the logged in user is not the owner of one of the listings, then
    // throw an error:
    if (
      suggestion.childListing.creator.toString() !== req.user.id &&
      suggestion.parentListing.creator.toString() !== req.user.id
    ) {
      return res.status(403).json({ error: "You do not have permission to perform this action." });
    }

    // if the logged in user is the owner of the child listing, update their status:
    if (suggestion.childListing.creator.toString() === req.user.id) {
      suggestion.childOwnerStatus = action.toUpperCase();
    }

    // if the logged in user is the owner of the parent listing, update their status:
    if (suggestion.parentListing.creator.toString() === req.user.id) {
      suggestion.parentOwnerStatus = action.toUpperCase();
    }

    await suggestion.save();

    // if both statuses are accepted, then move the suggestion to the listings array:
    if (suggestion.childOwnerStatus === "ACCEPTED" && suggestion.parentOwnerStatus === "ACCEPTED") {
      const parentListing = await Listing.findById(to);
      parentListing.listings.addToSet(suggested);
      await parentListing.save();

      const childListing = await Listing.findById(suggested);
      childListing.parent = parentListing._id;
      await childListing.save();

      // delete the suggestion document:
      await Suggestion.findByIdAndDelete(suggestion._id);

      // notify both parties of the acceptance:
      await Notification.create({
        userId: suggestion.childListing.creator,
        message: `Your suggestion "${suggestion.childListing.title}" was accepted into the project "${suggestion.parentListing.title}".`,
        link: `/listing/${to}`,
      });

      await Notification.create({
        userId: suggestion.parentListing.creator,
        message: `You accepted the suggestion "${suggestion.childListing.title}" into your project "${suggestion.parentListing.title}".`,
        link: `/listing/${to}`,
      });

      return res.json({ message: "Suggestion accepted and added to project listings." });
    }

    // If one party rejected, delete the suggestion
    if (suggestion.childOwnerStatus === "REJECTED" || suggestion.parentOwnerStatus === "REJECTED") {
      await Suggestion.findByIdAndDelete(suggestion._id);
      return res.json({ message: `Suggestion ${action}ed.` });
    }

    // Otherwise, just one party has responded - wait for the other
    return res.json({ message: `Your response has been recorded. Waiting for the other party.` });
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
