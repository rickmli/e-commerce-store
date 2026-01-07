import Redis from "ioredis";

export const redis = new Redis(process.env.UPSTASH_REDIS_URL);

// Handle connection errors
redis.on("error", (err) => {
  console.error("Redis connection error:", err);
});

// Optional: Handle successful connection
redis.on("connect", () => {
  console.log("Connected to Redis");
});

// Optional: Handle ready event
redis.on("ready", () => {
  console.log("Redis is ready");
});
