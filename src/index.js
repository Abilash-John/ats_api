const app = require("./app");
const { connectDB } = require("./config/data-source");
const { redisClient } = require("./config/redis");
const { checkESConnection } = require("./config/elasticsearch");
const { initWorkers } = require("./queues");

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        console.log("🛠️  Init ATS API Infrastructure (Node.js)...");

        // 1. Connect to Database (MySQL via TypeORM)
        await connectDB();

        // 2. Redis/Cache Readiness Check
        await redisClient.ping();
        console.log("✅ Redis is ready for operations.");

        // 3. Search Engine (Elasticsearch) Readiness Check
        await checkESConnection();

        // 4. Background Job Workers (BullMQ) Boot
        initWorkers();

        // 5. Start Express API Server
        app.listen(PORT, () => {
            console.log(`🚀 ATS API Server is running on port ${PORT}`);
            console.log(`🌐 API Endpoint: http://localhost:${PORT}/api`);
        });

    } catch (error) {
        console.error("❌ Critical server startup failed:", error.message);
        process.exit(1);
    }
};

startServer();
