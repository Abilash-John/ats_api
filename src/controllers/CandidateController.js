const { CandidateService } = require("../services/CandidateService");

class CandidateController {
    static async register(req, res) {
        try {
            const domainCandidate = await CandidateService.registerCandidate(req.body, req.body.resume);
            res.status(201).json({
                success: true,
                message: "Candidate registered successfully. Resume is being parsed asynchronously.",
                data: domainCandidate
            });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    static async getById(req, res) {
        try {
            const candidate = await CandidateService.getCandidateById(req.params.id);
            res.status(200).json({ success: true, data: candidate });
        } catch (error) {
            res.status(404).json({ success: false, error: error.message });
        }
    }

    static async getAll(req, res) {
        try {
            const candidates = await CandidateService.getAllCandidates();
            res.status(200).json({ success: true, count: candidates.length, data: candidates });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}

module.exports = { CandidateController };
