import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import path from "path";
import { Server } from "socket.io";
import { socketioAuthMiddleware } from "./middleware/authMiddleware.js";

import db from "./db/connection.js";
import apiRoutes from "./routes/index.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from client/dist
app.use(express.static(path.join(__dirname, "../../client", "dist")));

// For any route not handled by API, send index.html
app.get(/^\/(?!api).*/, (_req, res) => {
  res.sendFile(path.join(__dirname, "../../client", "dist", "index.html"));
});

app.use("/api", apiRoutes);

const PORT = process.env.PORT || 3000;

db.once("open", () => {
  console.log("\n\nConnected to database...");

  if (process.env.NODE_ENV !== "test") {
    const server = app.listen(PORT, async () => {
      const address = server.address();
      if (typeof address === "string") {
        console.log(`Express server listening on ${address}\n\n`);
      } else if (address && typeof address === "object") {
        const host = address.address === "::" ? "localhost" : address.address;
        console.log(`Express server listening on http://${host}:${address.port}\n\n`);
      }
    });

    const io = new Server(server, {
      cors: {
        origin: "http://localhost:5173", // Vite dev server
        methods: ["GET", "POST"],
      },
    });

    io.use(socketioAuthMiddleware);

    io.on("connection", (socket) => {
      socket.on("notifications", (userId) => {});

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });

    // Make io available globally if needed
    global.io = io;
  }
});

export default app;
