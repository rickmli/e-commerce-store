import Coupon from "../models/Coupon.js";
import { generateCouponCode } from "../utils/coupon.js";

export const getCoupon = async (req, res) => {
  const user = req.user;
  const coupon = await Coupon.find({ userId: user._id, isActive: true });
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

  res.status(200).json(coupon);
};

export const createCoupon = async (req, res) => {
  const { id: userId } = req.params;
  const { discountPercentage, expiryDays } = req.body;
  try {
    const coupon = await createRewardCoupon(userId, {
      discountPercentage,
      expiryDays,
    });
    res.status(201).json(coupon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createRewardCoupon = async (userId, options = {}) => {
  const {
    discountPercentage = 10,
    expiryDays = 30,
    codePrefix = "REWARD",
  } = options;

  const coupon = new Coupon({
    code: generateCouponCode(codePrefix),
    discountPercentage,
    expirationDate: new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000),
    userId,
    // metadata: {
    //   reason: "spending_reward",
    //   createdAt: new Date(),
    // },
  });

  await coupon.save();
  return coupon;
};

// 工具函数
