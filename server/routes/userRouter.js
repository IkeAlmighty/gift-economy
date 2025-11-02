import User from "../models/User.js";
import express from "express";

const router = express.Router();

router.get("/me", async (req, res) => {
  const { id } = req.user;
  const user = await User.findById(id).select("-password").populate("connections").lean();
  res.json(user);
});

router.post("/connections", async (req, res) => {
  const { id } = req.user;
  const { username } = req.body;
  const connection = await User.findOne({ username }).populate("connections");

  if (!connection) {
    return res.status(404).json({ error: `User does not exist` });
  }

  let me = await User.findById(id);

  if (me.connections.includes(connection._id)) {
    return res.status(400).json({ error: `${username} is already one of your connections.` });
  }

  await me.populate("connections");

  // if the connection has already requested from me, then
  // move the requests to the connection array for both docs:
  if (me.connectionRequests.includes(connection.id)) {
    me.connections.addToSet(connection);
    connection.connections.addToSet(me);

    me.connectionRequests.remove(connection);
    connection.connectionRequests.remove(me);

    connection.save();
    me.save();

    res.json({ message: "Connection made!", connectionMade: true });
  } else {
    connection.connectionRequests.addToSet(me);
    connection.save();

    res.json({ message: "Connection request made!", connectionMade: false });
  }
});

router.delete("/connections", async (req, res) => {
  const { username } = req.query;
  const connectionToRemove = await User.findOne({ username });

  const me = await User.findById(req.user.id);
  me.connections.remove(connectionToRemove);
  me.save();

  if (connectionToRemove) {
    connectionToRemove.connections.remove(me);
    connectionToRemove.save();
  }

  res.json({ message: `${username} has been removed from your connections` });
});

export default router;
