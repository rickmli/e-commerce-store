import { redis } from "../libs/redis.js";

export const storeRefreshTokenToRedis = async (userId, refreshToken) => {
  await redis.set(
    `refresh_token:${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60
  );
};

export const getRefreshTokenFromRedis = async (userId) => {
  const token = await redis.get(`refresh_token:${userId}`);

  if (!token) {
    throw new Error(`Refresh token not found for user ${userId}`);
  }

  return token;
};

export const deleteRefreshTokenFromRedis = async (userId) => {
  await redis.del(`refresh_token:${userId}`);
};

export const getFeaturedProductsFromRedis = async () => {
  return await redis.get("featured_products");
};

export const storeFeaturedProductsToRedis = async (featuredProducts) => {
  return await redis.set("featured_products", featuredProducts);
};
