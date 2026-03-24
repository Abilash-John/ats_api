const { AppDataSource } = require("../config/data-source");
const { resumeQueue, emailQueue } = require("../queues");
const { redisClient } = require("../config/redis");

class CandidateService {
    static get candidateRepository() {
        return AppDataSource.getRepository("Candidate");
    }

    static async registerCandidate(candidateData, resumeFile) {
        const newCandidate = this.candidateRepository.create(candidateData);
        await this.candidateRepository.save(newCandidate);

        if (resumeFile) {
            await resumeQueue.add("parse-resume", { 
                candidateId: newCandidate.id, 
                resumeUrl: resumeFile.url 
            });
        }

        await emailQueue.add("welcome-candidate", {
            email: newCandidate.email,
            candidateName: `${newCandidate.firstName} ${newCandidate.lastName}`,
            template: "WELCOME_TEMPLATE"
        });

        await redisClient.del("list_all_candidates"); 

        return newCandidate;
    }

    static async getCandidateById(id) {
        const candidate = await this.candidateRepository.findOne({
            where: { id },
            relations: ["applications"]
        });
        if (!candidate) throw new Error("Candidate not found.");
        return candidate;
    }

    static async getAllCandidates() {
        const cached = await redisClient.get("list_all_candidates");
        if (cached) return JSON.parse(cached);

        const candidates = await this.candidateRepository.find();
        await redisClient.set("list_all_candidates", JSON.stringify(candidates), "EX", 300);
        
        return candidates;
    }
}

module.exports = { CandidateService };
