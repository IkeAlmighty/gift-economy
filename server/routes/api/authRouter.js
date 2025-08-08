import User from "../../models/User.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await new User({ username, password }).save();
    res.json({ message: "User created" });
  } catch (err) {
    res.status(400).json({ error: "User creation failed" });
  }
});

router.post("/signin", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await user.comparePassword(password)))
    return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  res.cookie("token", token, { httpOnly: true }).json({ message: "Signed in" });
});

router.post("/signout", (req, res) => {
  res.clearCookie("token").json({ message: "Signed out" });
});

export default router;
