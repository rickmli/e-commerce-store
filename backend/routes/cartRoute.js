import express from "express";
import { protectRoute } from "../middlewares/authMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  addToCart,
  getCartItems,
  removeFromCart,
  removeAllFromCart,
  updateQuantity,
} from "../controllers/cartController.js";

const router = express();

router.get("/", protectRoute, getCartItems);
router.post("/:id", protectRoute, asyncHandler(addToCart));
router.delete("/:id", protectRoute, asyncHandler(removeFromCart));
router.delete("/", protectRoute, asyncHandler(removeAllFromCart));
router.patch("/:id", protectRoute, asyncHandler(updateQuantity));

export default router;
