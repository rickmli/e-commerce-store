export const generateCouponCode = (prefix = "GIFT") => {
  return prefix + Math.random().toString(36).substring(2, 8).toUpperCase();
};
