import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

export const redis = new Redis(process.env.UPSTASH_REDIS_URL);

// Handle connection errors
redis.on("error", (err) => {
  console.error("Redis connection error:", err.message);
});

// Optional: Handle successful connection
redis.on("connect", () => {
  console.log("Connected to Redis");
});
