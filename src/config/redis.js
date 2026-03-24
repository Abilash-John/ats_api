const Redis = require("ioredis");
const Redlock = require("redlock").default;
require("dotenv").config();

const redisConfig = {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
    password: process.env.REDIS_PASSWORD || undefined,
    retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
};

const redisClient = new Redis(redisConfig);

redisClient.on("connect", () => {
    console.log("✅ Successfully connected to Redis.");
});

redisClient.on("error", (err) => {
    console.error("❌ Redis Connection Error:", err.message);
});

const redlock = new Redlock(
    [redisClient],
    {
        driftFactor: 0.01,
        retryCount: 10,
        retryDelay: 200,
        retryJitter: 200,
        automaticExtensionThreshold: 500,
    }
);

module.exports = { redisClient, redlock, redisConfig };
