import express from "express";
import { signup, signout, signin } from "../controllers/authController.js";

const router = express();

router.post("/signup", signup);
router.post("/signout", signout);
router.post("/signin", signin);

export default router;
