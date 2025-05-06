const httpStatus = require('http-status');
const JobUpdate = require('../models/JobUpdate');
const Job = require('../models/Job');
const User = require('../models/User');
const ApiError = require('../utils/apiError');

const createJobUpdate = async (req, res, next) => {
    try {
        const { job_id, updated_by } = req.body;

        // Validate references
        const job = await Job.findById(job_id);
        const user = await User.findById(updated_by);

        if (!job) throw new ApiError(httpStatus.NOT_FOUND, 'Job not found');
        if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');

        const update = await JobUpdate.create({
            ...req.body,
            update_timestamp: new Date()
        });
        res.status(httpStatus.CREATED).send(update);
    } catch (error) {
        next(error);
    }
};

const getUpdatesByJob = async (req, res, next) => {
    try {
        const updates = await JobUpdate.find({ job_id: req.params.jobId })
            .sort('-update_timestamp')
            .populate('updated_by', 'name');
        res.send(updates);
    } catch (error) {
        next(error);
    }
};

const getJobUpdate = async (req, res, next) => {
    try {
        const update = await JobUpdate.findById(req.params.id)
            .populate('updated_by', 'name');
        if (!update) throw new ApiError(httpStatus.NOT_FOUND, 'Job update not found');
        res.send(update);
    } catch (error) {
        next(error);
    }
};

const deleteJobUpdate = async (req, res, next) => {
    try {
        const update = await JobUpdate.findByIdAndDelete(req.params.id);
        if (!update) throw new ApiError(httpStatus.NOT_FOUND, 'Job update not found');
        res.send({ message: 'Job update deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createJobUpdate,
    getUpdatesByJob,
    getJobUpdate,
    deleteJobUpdate
};