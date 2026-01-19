import express from "express";
import { asyncHandler } from "../utils/handler.js";
import {
  createCoupon,
  getCoupon,
  validateCoupon,
} from "../controllers/couponController.js";
import { adminRoute, protectRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protectRoute, asyncHandler(getCoupon));
router.post("/validate", protectRoute, asyncHandler(validateCoupon));
router.post("/:id", protectRoute, adminRoute, asyncHandler(createCoupon));

export default router;
