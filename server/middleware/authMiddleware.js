import jwt from "jsonwebtoken";

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
  const token = socket.request.headers.cookie;
  console.log(token);
  next();
}
