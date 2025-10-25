import User from "../models/User.js";
import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  try {
    await new User({ username, password }).save();
    res.json({ message: "User created" });
  } catch (err) {
    res.status(400).json({ error: "User creation failed" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await user.comparePassword(password)))
    return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res
    .cookie("token", token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 100 })
    .json({ message: "Signed in" });
});

router.post("/logout", (req, res) => {
  res.clearCookie("token").json({ message: "Signed out" });
});

export default router;
