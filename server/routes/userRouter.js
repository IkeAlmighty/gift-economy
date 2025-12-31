import User from "../models/User.js";
import Notification from "../models/Notification.js";
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
    try {
      // Notify both users that the connection was made
      await new Notification({
        userId: connection._id,
        message: `${me.screenName} and you are now connected!`,
        link: "/connections",
      }).save();

      await new Notification({
        userId: me._id,
        message: `You are now connected with ${connection.screenName}!`,
        link: "/connections",
      }).save();
    } catch (e) {
      // Do not block the response on notification failures
    }

    res.json({ message: "Connection made!", connectionMade: true });
  } else {
    connection.connectionRequests.addToSet(me);
    connection.save();
    try {
      // Notify the target user about a new connection request
      await new Notification({
        userId: connection._id,
        message: `${me.screenName} sent you a connection request`,
        link: "/connections",
      }).save();
    } catch (e) {}

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
    try {
      await new Notification({
        userId: connectionToRemove._id,
        message: `${me.screenName} removed you from their connections`,
        link: "/connections",
      }).save();
    } catch (e) {}
  }

  res.json({ message: `${username} has been removed from your connections` });
});

router.get("/connections", async (req, res) => {
  const { _id } = req.query;
  const me = await User.findById(req.user.id).select("connections");

  // Allow if requesting own data or if connected
  if (me._id.toString() === _id || me.connections.map((c) => c.toString()).includes(_id)) {
    try {
      const connection = await User.findById(_id);

      return res.json({ username: connection.username, listings: connection.listings });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "server side error" });
    }
  }

  res.status(403).json({ error: "Not connected with this user" });
});

export default router;
