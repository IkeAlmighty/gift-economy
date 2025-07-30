const express = require("express");
const auth = require("../middleware/auth");
const Gift = require("../models/Gift");
const Request = require("../models/Request");
const User = require("../models/User");

const router = express.Router();

// Get all gifts
router.get("/gifts", auth, async (req, res) => {
  const gifts = await Gift.find().populate("owner", "username");
  res.json(gifts);
});

// Get all requests
router.get("/requests", auth, async (req, res) => {
  const requests = await Request.find().populate("requester", "username");
  res.json(requests);
});

// Create gift
router.post("/gifts", auth, async (req, res) => {
  const gift = await new Gift({ ...req.body, owner: req.user.id }).save();
  await User.findByIdAndUpdate(req.user.id, { $push: { gifts: gift._id } });
  res.json(gift);
});

// Create request
router.post("/requests", auth, async (req, res) => {
  const request = await new Request({
    ...req.body,
    requester: req.user.id,
  }).save();
  await User.findByIdAndUpdate(req.user.id, {
    $push: { requests: request._id },
  });
  res.json(request);
});

module.exports = router;
