import express from "express";
import authMiddleware from "../../middleware/authMiddleware";
import authRouter from "./authRouter";
import listingsRouter from "./listingsRouter";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/listings", authMiddleware, listingsRouter);

export default router;
