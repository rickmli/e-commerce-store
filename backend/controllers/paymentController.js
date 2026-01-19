import Coupon from "../models/Coupon.js";
import Order from "../models/Order.js";
import {
  createStripeSession,
  getStripeSession,
} from "../services/stripeService.js";
import { createCoupon } from "./couponController.js";

export const createCheckoutSession = async (req, res) => {
  const { products, couponCode } = req.body;
  const user = req.user;

  if (!Array.isArray(products) || products.length === 0) {
    const error = new Error("Invalid or empty products array");
    error.status = 400;
    throw error;
  }

  let totalAmount = 0;

  let coupon = null;
  if (couponCode) {
    coupon = await Coupon.findOne({
      code: couponCode,
      userId: user._id,
      isActive: true,
    });
    if (!coupon) {
      const error = new Error("Coupon not found");
      error.status = 404;
      throw error;
    }
    totalAmount -= Math.round((totalAmount * coupon.discountPercentage) / 100);
  }

  const session = await createStripeSession(products, coupon, user._id);

  if (totalAmount >= 20000) {
    await createCoupon(user._id);
  }
  res.status(200).json({ id: session.id, totalAmount: totalAmount / 100 });
};

export const checkoutSuccess = async (req, res) => {
  const { sessionId } = req.body;
  const session = await getStripeSession(sessionId);

  if (session.payment_status !== "paid") {
    const error = new Error("Session is not paid yet");
    error.status = 404;
    throw error;
  }

  if (session.metadata.couponCode) {
    await Coupon.findOneAndUpdate(
      {
        code: session.metadata.couponCode,
        userId: session.metadata.userId,
      },
      {
        isActive: false,
      }
    );
  }

  // create a new Order
  const products = JSON.parse(session.metadata.products);
  const newOrder = new Order({
    user: session.metadata.userId,
    products: products.map((product) => ({
      product: product.id,
      quantity: product.quantity,
      price: product.price,
    })),
    totalAmount: session.amount_total / 100, // convert from cents to dollars,
    stripeSessionId: sessionId,
  });

  await newOrder.save();

  res.status(200).json({
    success: true,
    message:
      "Payment successful, order created, and coupon deactivated if used.",
    orderId: newOrder._id,
  });
};
