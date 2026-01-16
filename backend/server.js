import "./utils/dotenv.js";
import express from "express";
import cookieParser from "cookie-parser";
// import path from "path";

import authRoutes from "./routes/authRoute.js";
import productRoutes from "./routes/productRoute.js";
import cartRoutes from "./routes/cartRoute.js";
import couponRoutes from "./routes/couponRoute.js";
import paymentRoutes from "./routes/paymentRoute.js";
import analyticRoutes from "./routes/analyticRoute.js";

import { connectDB } from "./libs/db.js";

const app = express();
const PORT = process.env.PORT || 5002;
// const __dirname = path.resolve();

app.use(express.json({ limit: "20mb" })); // allows you to parse the body of the request
app.use(cookieParser());

import errorHandler from "./middlewares/errorHandler.js";

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// if (process.env.NODE_ENV === "production") {
// 	app.use(express.static(path.join(__dirname, "/frontend/dist")));

// 	app.get("*", (req, res) => {
// 		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
// 	});
// }

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log("Server is running on http://localhost:" + PORT);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
