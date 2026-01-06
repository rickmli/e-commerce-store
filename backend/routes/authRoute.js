import express from "express";
import {
  signup,
  signout,
  signin,
  refreshAccessToken,
  getProfile,
} from "../controllers/authController.js";

const router = express();

router.post("/signup", signup);
router.post("/signout", signout);
router.post("/signin", signin);
router.post("/refresh-access-token", refreshAccessToken);

// todo implement protectRoute
// router.get("/profile", protectRoute, getProfile)

export default router;
