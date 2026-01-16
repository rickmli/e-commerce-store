import express from "express";
import { protectRoute } from "../middlewares/authMiddleware.js";
import {
  signup,
  signout,
  signin,
  refreshAccessToken,
  getProfile,
} from "../controllers/authController.js";
import { asyncHandler } from "../utils/handler.js";

const router = express();

router.post("/signup", asyncHandler(signup));
router.post("/signout", asyncHandler(signout));
router.post("/signin", asyncHandler(signin));
router.post("/refresh-access-token", asyncHandler(refreshAccessToken));
router.get("/profile", protectRoute, getProfile);

export default router;
