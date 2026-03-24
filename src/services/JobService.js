const { AppDataSource } = require("../config/data-source");
const { esClient } = require("../config/elasticsearch");
const { redisClient } = require("../config/redis");

class JobService {
  static get jobRepository() {
      return AppDataSource.getRepository("Job");
  }
  static get userRepository() {
      return AppDataSource.getRepository("User");
  }

  static async postJob(jobData, recruiterId) {
    const recruiter = await this.userRepository.findOneBy({ id: recruiterId });
    if (!recruiter) {
      throw new Error("Recruiter not found.");
    }

    const newJob = this.jobRepository.create({
      ...jobData,
      recruiter: recruiter,
    });

    await this.jobRepository.save(newJob);

    const { esIndexerQueue } = require("../queues");
    await esIndexerQueue.add("sync-job-to-es", {
      id: newJob.id,
      document: {
        title: newJob.title,
        description: newJob.description,
        location: newJob.location,
        type: newJob.type,
        department: newJob.department,
        status: newJob.status,
        recruiterId: recruiterId,
      },
    });

    return newJob;
  }

  static async updateJob(id, updateData) {
    const job = await this.jobRepository.findOneBy({ id });
    if (!job) throw new Error("Job not found.");

    Object.assign(job, updateData);
    await this.jobRepository.save(job);

    // Invalidate Cache and Update ES
    await redisClient.del(`job:${id}`);

    const { esIndexerQueue } = require("../queues");
    await esIndexerQueue.add("sync-job-to-es", {
      id: id,
      document: updateData,
    });

    return job;
  }

  static async getJobById(id) {
    // 1. Check Redis Cache
    const cached = await redisClient.get(`job:${id}`);
    if (cached) return JSON.parse(cached);

    // 2. Database Query
    const job = await this.jobRepository.findOneBy({ id });
    if (!job) throw new Error("Job not found.");

    // 3. Store in Cache
    await redisClient.set(`job:${id}`, JSON.stringify(job), "EX", 3600); // 1 hour TTL

    return job;
  }

  static async searchJobs(query) {
    const result = await esClient.search({
      index: "jobs",
      query: {
        multi_match: {
          query: query || "",
          fields: ["title^3", "description", "department", "location"],
        },
      },
    });

    return result.hits.hits.map((hit) => hit._source);
  }
}

module.exports = { JobService };
