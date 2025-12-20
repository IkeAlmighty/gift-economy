import jwt from "jsonwebtoken";

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

    const user = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = user;
    socket.join(`user:${user.id}`);
    next();
  } catch (err) {
    next(new Error("Unauthorized"));
  }
}
