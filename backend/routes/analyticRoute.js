import express from "express";
import { adminRoute, protectRoute } from "../middlewares/authMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";
import { getAnalyticData } from "../controllers/analyticController.js";

const router = express();

router.get("/", protectRoute, adminRoute, asyncHandler(getAnalyticData));

export default router;
