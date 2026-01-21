import { createRewardCoupon } from "../controllers/couponController.js";
import { stripe } from "../libs/stripe.js";
import Coupon from "../models/Coupon.js";
import { serviceErrorHandler } from "../utils/handler.js";

export const _createStripeCoupon = async (discountPercentage) => {
  const coupon = await stripe.coupons.create({
    percent_off: discountPercentage,
    duration: "once",
  });

  return coupon.id;
};

export const _createStripeSession = async (products, couponCode, userId) => {
  const lineItems = products.map((product) => {
    const amount = Math.round(product.price * 100); // stripe wants u to send in the format of cents

    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: product.name,
          images: [product.image],
        },
        unit_amount: amount,
      },
      quantity: product.quantity || 1,
    };
  });

  let coupon = null;
  if (couponCode) {
    coupon = await Coupon.findOne({
      code: couponCode,
      userId: userId,
      isActive: true,
    });
    if (!coupon) {
      const error = new Error("Coupon not found");
      error.status = 404;
      throw error;
    }
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
    discounts: coupon
      ? [
          {
            coupon: await _createStripeCoupon(coupon.discountPercentage),
          },
        ]
      : [],
    metadata: {
      userId: userId.toString(),
      couponCode: coupon?.code || "",
      products: JSON.stringify(
        products.map((p) => ({
          id: p._id,
          quantity: p.quantity,
          price: p.price,
        }))
      ),
    },
  });

  return session;
};

export const _getStripeSession = async (sessionId) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  return session;
};

export const createStripeCoupon = serviceErrorHandler(
  _createStripeCoupon,
  "Stripe",
  "Create Coupon"
);
export const createStripeSession = serviceErrorHandler(
  _createStripeSession,
  "Stripe",
  "Create Session"
);
export const getStripeSession = serviceErrorHandler(
  _getStripeSession,
  "Stripe",
  "Get Session"
);
