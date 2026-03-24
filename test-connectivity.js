const { connectDB, AppDataSource } = require("./src/config/data-source");
const { redisClient } = require("./src/config/redis");
const { checkESConnection } = require("./src/config/elasticsearch");

const testFlow = async () => {
    try {
        console.log("🔍 End-to-End Infrastructure Check...");
        
        // 1. Database
        console.log("Checking MySQL...");
        await connectDB();
        
        // 2. Redis
        console.log("Checking Redis...");
        const pong = await redisClient.ping();
        console.log("Redis Response:", pong);
        
        // 3. Elasticsearch
        console.log("Checking Elasticsearch...");
        await checkESConnection();
        
        console.log("✅ All systems are reachable. Ready for E2E Flow test.");
        process.exit(0);
    } catch (error) {
        console.error("❌ E2E Connectivity failed:", error.message);
        process.exit(1);
    }
};

testFlow();
