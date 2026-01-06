import express from "express";
import { signup, signout } from "../controllers/authController.js";

const router = express();

router.post("/signup", signup);
router.post("/signout", signout);

export default router;
