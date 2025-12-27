import jwt from "jsonwebtoken";
import User from "../models/User.js";

function parseCookie(header) {
  if (!header) return {};
  return Object.fromEntries(
    header
      .split(";")
      .map((pair) => pair.trim())
      .filter(Boolean)
      .map((kv) => {
        const idx = kv.indexOf("=");
        const key = idx >= 0 ? kv.slice(0, idx) : kv;
        const val = idx >= 0 ? decodeURIComponent(kv.slice(idx + 1)) : "";
        return [key, val];
      })
  );
}

export default function (req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

export async function socketioAuthMiddleware(socket, next) {
  try {
    const cookies = parseCookie(socket.request.headers.cookie || "");
    const token = cookies.token;
    if (!token) return next(new Error("Unauthorized"));

    const tokenPayload = jwt.verify(token, process.env.JWT_SECRET);
    // Fetch minimal user info once per connection
    const dbUser = await User.findById(tokenPayload.id).select("username screenName");
    if (!dbUser) return next(new Error("Unauthorized"));

    const user = { id: tokenPayload.id, username: dbUser.username, screenName: dbUser.screenName };

    // Prefer socket.data for per-socket state
    socket.data.user = user;
    // Back-compat if any code reads socket.user
    socket.user = user;

    // Join personal room for notifications
    socket.join(`user:${user.id}`);
    next();
  } catch (err) {
    next(new Error("Unauthorized"));
  }
}
