import express from "express";
import {
  signup,
  signout,
  signin,
  refreshAccessToken,
  getProfile,
} from "../controllers/authController.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express();

router.post("/signup", asyncHandler(signup));
router.post("/signout", asyncHandler(signout));
router.post("/signin", asyncHandler(signin));
router.post("/refresh-access-token", asyncHandler(refreshAccessToken));

// todo implement protectRoute
// router.get("/profile", protectRoute, getProfile)

export default router;
