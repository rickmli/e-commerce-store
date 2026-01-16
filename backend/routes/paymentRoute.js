import express from "express";
import { protectRoute } from "../middlewares/authMiddleware.js";
import { asyncHandler } from "../utils/handler.js";
import {
  createCheckoutSession,
  checkoutSuccess,
} from "../controllers/paymentController.js";

const router = express();

router.post(
  "/create-checkout-session",
  protectRoute,
  asyncHandler(createCheckoutSession)
);
router.post("/checkout-success", protectRoute, asyncHandler(checkoutSuccess));

export default router;
