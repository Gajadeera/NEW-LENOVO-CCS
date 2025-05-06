const httpStatus = require('http-status');
const CustomerFeedback = require('../models/CustomerFeedback');
const Job = require('../models/Job');
const ApiError = require('../utils/apiError');

const createFeedback = async (req, res, next) => {
    try {
        const { job_id } = req.body;

        // Check if job exists
        const job = await Job.findById(job_id);
        if (!job) throw new ApiError(httpStatus.NOT_FOUND, 'Job not found');

        // Check if feedback already exists for this job
        const existingFeedback = await CustomerFeedback.findOne({ job_id });
        if (existingFeedback) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Feedback already exists for this job');
        }

        const feedback = await CustomerFeedback.create(req.body);
        res.status(httpStatus.CREATED).send(feedback);
    } catch (error) {
        next(error);
    }
};

const getFeedbackByJob = async (req, res, next) => {
    try {
        const feedback = await CustomerFeedback.findOne({ job_id: req.params.jobId });
        if (!feedback) throw new ApiError(httpStatus.NOT_FOUND, 'Feedback not found');
        res.send(feedback);
    } catch (error) {
        next(error);
    }
};

const getFeedbacksByCustomer = async (req, res, next) => {
    try {
        // First get all jobs for this customer
        const jobs = await Job.find({ customer_id: req.params.customerId });
        const jobIds = jobs.map(job => job._id);

        const feedbacks = await CustomerFeedback.find({ job_id: { $in: jobIds } });
        res.send(feedbacks);
    } catch (error) {
        next(error);
    }
};

const updateFeedback = async (req, res, next) => {
    try {
        const feedback = await CustomerFeedback.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!feedback) throw new ApiError(httpStatus.NOT_FOUND, 'Feedback not found');
        res.send(feedback);
    } catch (error) {
        next(error);
    }
};

const deleteFeedback = async (req, res, next) => {
    try {
        const feedback = await CustomerFeedback.findByIdAndDelete(req.params.id);
        if (!feedback) throw new ApiError(httpStatus.NOT_FOUND, 'Feedback not found');
        res.send({ message: 'Feedback deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createFeedback,
    getFeedbackByJob,
    getFeedbacksByCustomer,
    updateFeedback,
    deleteFeedback
};