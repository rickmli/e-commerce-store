import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { getCoupon, validateCoupon } from "../controllers/couponController.js";
import { protectRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protectRoute, asyncHandler(getCoupon));
router.post("/validate", protectRoute, asyncHandler(validateCoupon));

export default router;
