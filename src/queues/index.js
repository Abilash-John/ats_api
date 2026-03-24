const { Queue, Worker } = require("bullmq");
const { redisConfig } = require("../config/redis");
const { esClient } = require("../config/elasticsearch");

const connection = {
  host: redisConfig.host,
  port: redisConfig.port,
  password: redisConfig.password,
};

const emailQueue = new Queue("emailQueue", { connection });
const resumeQueue = new Queue("resumeQueue", { connection });
const esIndexerQueue = new Queue("esIndexerQueue", { connection });

const initWorkers = () => {
    // 1. Email Worker
    const emailWorker = new Worker("emailQueue", async (job) => {
        console.log(`✉️ Sending email to: ${job.data.email}`);
        await new Promise(res => setTimeout(res, 1000));
    }, { connection });

    // 2. Resume Worker
    const resumeWorker = new Worker("resumeQueue", async (job) => {
        console.log(`📄 Parsing resume for Candidate: ${job.data.candidateId}`);
        await new Promise(res => setTimeout(res, 5000));
    }, { connection, concurrency: parseInt(process.env.QUEUE_CONCURRENCY || "5") });

    // 3. ES Indexer Worker
    const esWorker = new Worker("esIndexerQueue", async (job) => {
        console.log(`🔍 Indexing Job into Elasticsearch: ${job.data.id}`);
        try {
            await esClient.update({
                index: "jobs",
                id: job.data.id.toString(),
                doc: job.data.document,
                doc_as_upsert: true,
            });
        } catch (err) {
            console.error(`❌ ES Indexing failed for job ${job.data.id}:`, err.message);
            throw err; // Trigger retry
        }
    }, { 
        connection, 
        settings: {
            backoff: { type: 'exponential', delay: 1000 }
        }
    });

    emailWorker.on("completed", (job) => console.log(`✅ Email Job ${job.id} finished.`));
    resumeWorker.on("completed", (job) => console.log(`✅ Resume Job ${job.id} finished.`));
    esWorker.on("completed", (job) => console.log(`✅ ES Indexing Job ${job.id} finished.`));

    console.log("👷 Background Workers Initialized.");
};

module.exports = { emailQueue, resumeQueue, esIndexerQueue, initWorkers };
