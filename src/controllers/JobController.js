const { JobService } = require("../services/JobService");

class JobController {
  static async postJob(req, res) {
    try {
      // Access req.user.id from protect middleware
      const job = await JobService.postJob(req.body, req.user.id);
      res.status(201).json({ 
          success: true, 
          message: "Job posted and indexed for search.", 
          data: job 
      });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  static async updateJob(req, res) {
    try {
      const job = await JobService.updateJob(req.params.id, req.body);
      res.status(200).json({ success: true, data: job });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const job = await JobService.getJobById(req.params.id);
      res.status(200).json({ success: true, data: job });
    } catch (error) {
      res.status(404).json({ success: false, error: error.message });
    }
  }

  static async search(req, res) {
    try {
      const query = req.query.keyword || req.query.q;
      const hits = await JobService.searchJobs(query);
      res.status(200).json({ success: true, count: hits.length, data: hits });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

module.exports = { JobController };
