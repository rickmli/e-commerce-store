import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getFeaturedProducts,
  getProductsByCategory,
  getRecommendedProducts,
  toggleFeaturedProduct,
} from "../controllers/productController.js";
import { adminRoute, protectRoute } from "../middlewares/authMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express();

router.get("/", protectRoute, adminRoute, asyncHandler(getAllProducts));
router.get("/featured", asyncHandler(getFeaturedProducts));
router.get("/recommendations", asyncHandler(getRecommendedProducts));
router.get("/category/:category", asyncHandler(getProductsByCategory));
router.post("/", protectRoute, adminRoute, asyncHandler(createProduct));
router.patch(
  "/:id",
  protectRoute,
  adminRoute,
  asyncHandler(toggleFeaturedProduct)
);
router.delete("/:id", protectRoute, adminRoute, asyncHandler(deleteProduct));

export default router;
