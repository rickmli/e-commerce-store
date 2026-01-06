import express from "express";

const router = express();

router.get("/signup", (req, res) => {
  res.status(200).json({ message: "Sign up route called" });
});

export default router;
