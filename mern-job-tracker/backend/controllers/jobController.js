const Job = require('../models/Job');

// @desc Get all jobs for logged in user
// @route GET /api/jobs
exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc Create new job application
// @route POST /api/jobs
exports.createJob = async (req, res) => {
  try {
    const { company, position, status, salary, appliedDate } = req.body;

    const job = await Job.create({
      company,
      position,
      status: status || 'Applied',
      salary,
      appliedDate,
      createdBy: req.user.id,
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc Update job application status or details
// @route PUT /api/jobs/:id
exports.updateJob = async (req, res) => {
  try {
    const { id } = req.params;

    let job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Ensure user owns job
    if (job.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    job = await Job.findByIdAndUpdate(id, req.body, { new: true });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc Delete job application
// @route DELETE /api/jobs/:id
exports.deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Ensure user owns job
    if (job.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await job.deleteOne();
    res.json({ message: 'Job removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
