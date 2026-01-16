import { redis } from "../libs/redis.js";
import { serviceErrorHandler } from "../utils/handler.js";

const _storeRefreshTokenToRedis = async (userId, refreshToken) => {
  await redis.set(
    `refresh_token:${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60
  );
};

const _getRefreshTokenFromRedis = async (userId) => {
  const token = await redis.get(`refresh_token:${userId}`);

  if (!token) {
    throw new Error(`Refresh token not found for user ${userId}`);
  }

  return token;
};

const _deleteRefreshTokenFromRedis = async (userId) => {
  await redis.del(`refresh_token:${userId}`);
};

const _getFeaturedProductsFromRedis = async () => {
  return await redis.get("featured_products");
};

const _storeFeaturedProductsToRedis = async (featuredProducts) => {
  return await redis.set("featured_products", featuredProducts);
};

// 导出包装后的函数
export const storeRefreshTokenToRedis = serviceErrorHandler(
  _storeRefreshTokenToRedis,
  "Redis",
  "Store Refresh Token"
);
export const getRefreshTokenFromRedis = serviceErrorHandler(
  _getRefreshTokenFromRedis,
  "Redis",
  "Get Refresh Token"
);
export const deleteRefreshTokenFromRedis = serviceErrorHandler(
  _deleteRefreshTokenFromRedis,
  "Redis",
  "Delete Refresh Token"
);
export const getFeaturedProductsFromRedis = serviceErrorHandler(
  _getFeaturedProductsFromRedis,
  "Redis",
  "Get Featured Products"
);
export const storeFeaturedProductsToRedis = serviceErrorHandler(
  _storeFeaturedProductsToRedis,
  "Redis",
  "Store Featured Products"
);
