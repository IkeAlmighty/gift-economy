import express from "express";
import Gift from "../models/Gift.js";
import Request from "../models/Request.js";

const router = express.Router();

// Get all gifts
router.get("/gifts", async (req, res) => {
  const gifts = await Gift.find().populate("owner", "username");
  res.json(gifts);
});

// Get all requests
router.get("/requests", async (req, res) => {
  const requests = await Request.find().populate("requester", "username");
  res.json(requests);
});

// Create gift
router.post("/gifts", async (req, res) => {
  const gift = await new Gift({ ...req.body, owner: req.user.id }).save();
  await User.findByIdAndUpdate(req.user.id, { $push: { gifts: gift._id } });
  res.json(gift);
});

// Create request
router.post("/requests", async (req, res) => {
  const request = await new Request({
    ...req.body,
    requester: req.user.id,
  }).save();
  await User.findByIdAndUpdate(req.user.id, {
    $push: { requests: request._id },
  });
  res.json(request);
});

export default router;
