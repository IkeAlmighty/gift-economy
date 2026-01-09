import User from "../models/User.js";
import express from "express";
import jwt from "jsonwebtoken";

const development = process.env.NODE_ENV === "development";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { username, screenName, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res.status(400).json({ error: "That username is taken." });
      return;
    }

    const user = await new User({ username, screenName, password }).save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: development ? "lax" : "none",
        secure: development ? false : true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ message: "User created" });
  } catch (err) {
    console.error(err);
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
    .cookie("token", token, {
      httpOnly: true,
      sameSite: development ? "lax" : "none",
      secure: development ? false : true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json({ message: "Signed in" });
});

router.post("/logout", (req, res) => {
  res.clearCookie("token").json({ message: "Signed out" });
});

export default router;
