const { Client } = require("@elastic/elasticsearch");
require("dotenv").config();

const esClient = new Client({
  node: process.env.ES_NODE || "http://localhost:9200",
  auth: {
    username: process.env.ES_USERNAME || "elastic",
    password: process.env.ES_PASSWORD || "changeme",
  },
  tls: {
    rejectUnauthorized: process.env.NODE_ENV === "production",
  },
});

const checkESConnection = async () => {
  try {
    const health = await esClient.cluster.health({});
    console.log(`✅ Elasticsearch Cluster is healthy: ${health.status}`);
  } catch (error) {
    console.warn("⚠️ Elasticsearch is not reachable:", error.message);
  }
};

module.exports = { esClient, checkESConnection };
