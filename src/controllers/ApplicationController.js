const { ApplicationService } = require("../services/ApplicationService");

class ApplicationController {
    static async apply(req, res) {
        try {
            const { candidateId, jobId, notes } = req.body;
            // Link directly if possible OR ensure consistency
            const application = await ApplicationService.applyToJob(candidateId, jobId, notes);
            res.status(201).json({ 
                success: true, 
                message: "Application submitted and recruiter notified.", 
                data: application 
            });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    static async updateStatus(req, res) {
        try {
            const { status, notes } = req.body;
            const domainApplication = await ApplicationService.updateStatus(req.params.id, status, notes);
            res.status(200).json({ 
                success: true, 
                message: `Status updated to ${status}. Candidate is being notified.`, 
                data: domainApplication 
            });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    static async getAll(req, res) {
        try {
            const filter = {
                jobId: req.query.job_id,
                candidateId: req.query.candidate_id
            };
            const applications = await ApplicationService.listApplications(filter);
            res.status(200).json({ success: true, count: applications.length, data: applications });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}

module.exports = { ApplicationController };
