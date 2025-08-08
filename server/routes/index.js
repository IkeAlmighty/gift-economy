import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import authRouter from "./authRouter.js";
import listingsRouter from "./listingsRouter.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/listings", authMiddleware, listingsRouter);

export default router;
