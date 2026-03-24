const { AppDataSource } = require("../config/data-source");
const { redlock } = require("../config/redis");
const { emailQueue } = require("../queues");

class ApplicationService {
    static get applicationRepository() {
        return AppDataSource.getRepository("Application");
    }
    static get candidateRepository() {
        return AppDataSource.getRepository("Candidate");
    }
    static get jobRepository() {
        return AppDataSource.getRepository("Job");
    }

    static async applyToJob(candidateId, jobId, notes) {
        const resource = `locks:application:${candidateId}:${jobId}`;
        const timeout = 5000;

        const lock = await redlock.acquire([resource], timeout);
        try {
            const existing = await this.applicationRepository.findOne({
                where: { 
                    candidate: { id: candidateId },
                    job: { id: jobId }
                }
            });

            if (existing) {
                throw new Error("Candidate already applied to this job.");
            }

            const candidate = await this.candidateRepository.findOneBy({ id: candidateId });
            const job = await this.jobRepository.findOneBy({ id: jobId });

            if (!candidate || !job) {
                throw new Error("Candidate or Job not found.");
            }

            const application = this.applicationRepository.create({
                candidate,
                job,
                notes,
                status: "Applied"
            });

            await this.applicationRepository.save(application);

            await emailQueue.add("recruiter-notification", {
                jobId: job.id,
                jobTitle: job.title,
                candidateName: `${candidate.firstName} ${candidate.lastName}`,
                recruiterEmail: "recruiter@company.com"
            });

            return application;

        } finally {
            await lock.release();
        }
    }

    static async updateStatus(applicationId, status, notes) {
        const application = await this.applicationRepository.findOne({
            where: { id: applicationId },
            relations: ["candidate", "job"]
        });

        if (!application) throw new Error("Application not found.");

        application.status = status;
        if (notes) application.notes = notes;
        await this.applicationRepository.save(application);

        await emailQueue.add("status-update-candidate", {
            email: application.candidate.email,
            candidateName: application.candidate.firstName,
            jobTitle: application.job.title,
            newStatus: status
        });

        return application;
    }

    static async listApplications(filter = {}) {
        const whereClause = {};
        if (filter.jobId) whereClause.job = { id: filter.jobId };
        if (filter.candidateId) whereClause.candidate = { id: filter.candidateId };

        return await this.applicationRepository.find({
            where: whereClause,
            relations: ["candidate", "job"]
        });
    }
}

module.exports = { ApplicationService };
