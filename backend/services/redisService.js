import { redis } from "../libs/redis.js";

export const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(
    `refresh_token:${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60
  );
};

export const getRefreshToken = async (userId) => {
  const token = await redis.get(`refresh_token:${userId}`);

  if (!token) {
    throw new Error(`Refresh token not found for user ${userId}`);
  }

  return token;
};

export const deleteRefreshToken = async (userId) => {
  await redis.del(`refresh_token:${userId}`);
};
