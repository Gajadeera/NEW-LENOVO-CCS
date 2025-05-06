const httpStatus = require('http-status');
const CustomerSignature = require('../models/CustomerSignature');
const Job = require('../models/Job');
const ApiError = require('../utils/apiError');

const createSignature = async (req, res, next) => {
    try {
        const { job_id } = req.body;

        // Verify job exists
        const job = await Job.findById(job_id);
        if (!job) throw new ApiError(httpStatus.NOT_FOUND, 'Job not found');

        const signature = await CustomerSignature.create(req.body);
        res.status(httpStatus.CREATED).send(signature);
    } catch (error) {
        next(error);
    }
};

const getSignaturesByJob = async (req, res, next) => {
    try {
        const signatures = await CustomerSignature.find({ job_id: req.params.jobId });
        res.send(signatures);
    } catch (error) {
        next(error);
    }
};

const getSignaturesByCustomer = async (req, res, next) => {
    try {
        // First get all jobs for this customer
        const jobs = await Job.find({ customer_id: req.params.customerId });
        const jobIds = jobs.map(job => job._id);

        const signatures = await CustomerSignature.find({ job_id: { $in: jobIds } });
        res.send(signatures);
    } catch (error) {
        next(error);
    }
};

const getSignature = async (req, res, next) => {
    try {
        const signature = await CustomerSignature.findById(req.params.id);
        if (!signature) throw new ApiError(httpStatus.NOT_FOUND, 'Signature not found');
        res.send(signature);
    } catch (error) {
        next(error);
    }
};

const deleteSignature = async (req, res, next) => {
    try {
        const signature = await CustomerSignature.findByIdAndDelete(req.params.id);
        if (!signature) throw new ApiError(httpStatus.NOT_FOUND, 'Signature not found');
        res.send({ message: 'Signature deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createSignature,
    getSignaturesByJob,
    getSignaturesByCustomer,
    getSignature,
    deleteSignature
};