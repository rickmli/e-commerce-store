import express from "express";
import { getAllProducts } from "../controllers/productController.js";
import { adminRoute, protectRoute } from "../middlewares/authMiddleware.js";

const router = express();

router.get("/", protectRoute, adminRoute, getAllProducts);

export default router;
