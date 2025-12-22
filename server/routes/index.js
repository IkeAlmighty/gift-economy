import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import authRouter from "./authRouter.js";
import listingsRouter from "./listingsRouter.js";
import userRouter from "./userRouter.js";
import notificationsRouter from "./notificationsRouter.js";
import tagsRouter from "./tagsRouter.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/listings", authMiddleware, listingsRouter);
router.use("/user", authMiddleware, userRouter);
router.use("/notifications", authMiddleware, notificationsRouter);
router.use("/tags", authMiddleware, tagsRouter);

export default router;
