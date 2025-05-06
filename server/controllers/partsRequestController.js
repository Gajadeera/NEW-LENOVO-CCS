const httpStatus = require('http-status');
const PartsRequest = require('../models/PartsRequest');
const Job = require('../models/Job');
const Inventory = require('../models/Inventory');
const User = require('../models/User');
const ApiError = require('../utils/apiError');

const createPartsRequest = async (req, res, next) => {
    try {
        const { job_id, part_id, requested_by } = req.body;

        // Validate references
        const job = await Job.findById(job_id);
        const part = await Inventory.findById(part_id);
        const user = await User.findById(requested_by);

        if (!job) throw new ApiError(httpStatus.NOT_FOUND, 'Job not found');
        if (!part) throw new ApiError(httpStatus.NOT_FOUND, 'Part not found');
        if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');

        const request = await PartsRequest.create(req.body);
        res.status(httpStatus.CREATED).send(request);
    } catch (error) {
        next(error);
    }
};

const getAllPartsRequests = async (req, res, next) => {
    try {
        const { status } = req.query;
        const query = status ? { status } : {};

        const requests = await PartsRequest.find(query)
            .populate('job_id', 'job_number')
            .populate('part_id', 'part_number description')
            .populate('requested_by', 'name')
            .populate('approved_by', 'name')
            .sort('-requested_at');
        res.send(requests);
    } catch (error) {
        next(error);
    }
};

const getRequestsByJob = async (req, res, next) => {
    try {
        const requests = await PartsRequest.find({ job_id: req.params.jobId })
            .populate('part_id', 'part_number description')
            .sort('-requested_at');
        res.send(requests);
    } catch (error) {
        next(error);
    }
};

const getPartsRequest = async (req, res, next) => {
    try {
        const request = await PartsRequest.findById(req.params.id)
            .populate('job_id', 'job_number')
            .populate('part_id', 'part_number description')
            .populate('requested_by', 'name')
            .populate('approved_by', 'name');
        if (!request) throw new ApiError(httpStatus.NOT_FOUND, 'Parts request not found');
        res.send(request);
    } catch (error) {
        next(error);
    }
};

const approvePartsRequest = async (req, res, next) => {
    try {
        const request = await PartsRequest.findById(req.params.id);
        if (!request) throw new ApiError(httpStatus.NOT_FOUND, 'Parts request not found');

        if (request.status !== 'Pending') {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Only pending requests can be approved');
        }

        request.status = 'Approved';
        request.approved_by = req.user._id;
        request.approved_at = new Date();
        await request.save();

        res.send(request);
    } catch (error) {
        next(error);
    }
};

const rejectPartsRequest = async (req, res, next) => {
    try {
        const { rejection_reason } = req.body;
        if (!rejection_reason) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Rejection reason is required');
        }

        const request = await PartsRequest.findById(req.params.id);
        if (!request) throw new ApiError(httpStatus.NOT_FOUND, 'Parts request not found');

        if (request.status !== 'Pending') {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Only pending requests can be rejected');
        }

        request.status = 'Rejected';
        request.rejection_reason = rejection_reason;
        request.approved_by = req.user._id;
        request.approved_at = new Date();
        await request.save();

        res.send(request);
    } catch (error) {
        next(error);
    }
};

const fulfillPartsRequest = async (req, res, next) => {
    try {
        const request = await PartsRequest.findById(req.params.id)
            .populate('part_id');
        if (!request) throw new ApiError(httpStatus.NOT_FOUND, 'Parts request not found');

        if (request.status !== 'Approved') {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Only approved requests can be fulfilled');
        }

        // Check if part has sufficient stock
        if (request.part_id.current_quantity < request.quantity) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Insufficient stock to fulfill request');
        }

        // Update part stock
        request.part_id.current_quantity -= request.quantity;
        await request.part_id.save();

        request.status = 'Fulfilled';
        request.fulfillment_date = new Date();
        await request.save();

        res.send(request);
    } catch (error) {
        next(error);
    }
};

const deletePartsRequest = async (req, res, next) => {
    try {
        const request = await PartsRequest.findByIdAndDelete(req.params.id);
        if (!request) throw new ApiError(httpStatus.NOT_FOUND, 'Parts request not found');
        res.send({ message: 'Parts request deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createPartsRequest,
    getAllPartsRequests,
    getRequestsByJob,
    getPartsRequest,
    approvePartsRequest,
    rejectPartsRequest,
    fulfillPartsRequest,
    deletePartsRequest
};