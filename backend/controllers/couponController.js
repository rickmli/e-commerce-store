import Coupon from "../models/Coupon.js";

export const getCoupon = async (req, res) => {
  const user = req.user;
  const coupon = await Coupon.findOne({ userId: user._id, isActive: true });
  res.status(200).json(coupon || null);
};

export const validateCoupon = async (req, res) => {
  const { code } = req.body;
  const user = req.user;
  const coupon = await Coupon.findOne({
    code,
    userId: user._id,
    isActive: true,
  });

  if (!coupon) {
    const error = new Error("Coupon not found");
    error.status = 404;
    throw error;
  }

  if (coupon.expirationDate < new Date()) {
    coupon.isActive = false;
    await coupon.save();

    const error = new Error("Coupon expired");
    error.status = 404;
    throw error;
  }

  res.status(200).json({
    message: "Coupon is valid",
    code: coupon.code,
    discountPercentage: coupon.discountPercentage,
  });
};
