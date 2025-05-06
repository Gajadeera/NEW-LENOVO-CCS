const httpStatus = require('http-status');
const Job = require('../models/Job');
const Customer = require('../models/Customer');
const Device = require('../models/Device');
const User = require('../models/User');
const ApiError = require('../utils/apiError');

const getAllJobs = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, search = '', sort = '-created_at', status, status_ne, priority, customer_id, assigned_to } = req.query;
        const query = {};

        if (search) {
            query.$or = [
                { job_number: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }


        if (status_ne) {
            query.status = { $ne: status_ne }; // MongoDB: status != 'Closed'
        }
        // Handle normal status filtering
        else if (status) {
            if (Array.isArray(status)) {
                query.status = { $in: status }; // Multiple statuses
            } else {
                query.status = status; // Single status
            }
        }

        if (priority) query.priority = priority;
        if (customer_id) query.customer_id = customer_id;
        if (assigned_to) query.assigned_to = assigned_to;

        const jobs = await Job.find(query)
            .populate('customer_id', 'name contact_phone email')
            .populate('device_id', 'serial_number device_type')
            .populate('assigned_to', 'name email')
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Job.countDocuments(query);

        res.send({
            jobs,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        next(error);
    }
};

const getJob = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate('customer_id')
            .populate('device_id')
            .populate('assigned_to', 'name ')
            .populate('created_by', 'name');

        if (!job) throw new ApiError(httpStatus.NOT_FOUND, 'Job not found');
        res.send(job);
    } catch (error) {
        next(error);
    }
};

const createJob = async (req, res, next) => {
    try {
        const { customer_id, device_id, description } = req.body;
        if (!customer_id || !device_id || !description) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Customer, device and description are required');
        }

        // Validate references
        const customer = await Customer.findById(customer_id);
        const device = await Device.findById(device_id);
        if (!customer) throw new ApiError(httpStatus.BAD_REQUEST, 'Customer not found');
        if (!device) throw new ApiError(httpStatus.BAD_REQUEST, 'Device not found');

        // Generate job number
        const lastJob = await Job.findOne().sort({ job_number: -1 });
        const nextNumber = lastJob ? parseInt(lastJob.job_number.substring(1)) + 1 : 74500;
        const job_number = `T${nextNumber}`;

        const job = await Job.create({
            job_number,
            ...req.body,
            created_by: req.user._id
        });

        res.send(job);
    } catch (error) {
        next(error);
    }
};

const updateJob = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) throw new ApiError(httpStatus.NOT_FOUND, 'Job not found');

        // Check if only status is being updated
        const isOnlyStatusUpdate = Object.keys(req.body).length === 1 && req.body.status;

        // Validate status transition
        if (req.body.status && !isValidStatusTransition(job.status, req.body.status, isOnlyStatusUpdate)) {
            throw new ApiError(
                httpStatus.BAD_REQUEST,
                `Invalid status transition from ${job.status} to ${req.body.status}`
            );
        }

        Object.assign(job, req.body);
        job.updated_at = new Date();
        await job.save();

        res.send(job);
    } catch (error) {
        next(error);
    }
};

const deleteJob = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) throw new ApiError(httpStatus.NOT_FOUND, 'Job not found');

        if (['In Progress', 'Assigned'].includes(job.status)) {
            throw new ApiError(
                httpStatus.BAD_REQUEST,
                'Cannot delete job that is in progress. Please cancel or complete it first.'
            );
        }

        await job.remove();
        res.send({ message: 'Job deleted successfully' });
    } catch (error) {
        next(error);
    }
};

const assignJob = async (req, res, next) => {
    try {
        const { technicianId } = req.body;
        const job = await Job.findById(req.params.id);
        if (!job) throw new ApiError(httpStatus.NOT_FOUND, 'Job not found');

        const technician = await User.findById(technicianId);
        if (!technician || technician.role !== 'technician') {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid technician');
        }

        job.assigned_to = technicianId;
        job.status = 'Assigned';
        job.updated_at = new Date();
        await job.save();

        const populatedJob = await Job.findById(job._id)
            .populate('assigned_to', 'name email')
            .populate('customer_id', 'name');

        res.send({
            message: 'Job assigned successfully',
            job: populatedJob
        });
    } catch (error) {
        next(error);
    }
};

const getJobsByCustomer = async (req, res, next) => {
    try {
        const { customerId } = req.params;
        const { page = 1, limit = 10, status } = req.query;

        const query = { customer_id: customerId };
        if (status) query.status = status;

        const jobs = await Job.find(query)
            .populate('device_id', 'serial_number device_type')
            .sort('-created_at')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Job.countDocuments(query);

        res.send({
            jobs,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        next(error);
    }
};

const getJobsByStatus = async (req, res, next) => {
    try {
        const { status } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const jobs = await Job.find({ status })
            .populate('customer_id', 'name contact_phone')
            .populate('device_id', 'serial_number')
            .sort('-created_at')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Job.countDocuments({ status });

        res.send({
            jobs,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        next(error);
    }
};

function isValidStatusTransition(currentStatus, newStatus, isOnlyStatusUpdate = false) {
    const validTransitions = {
        'Pending Assignment': ['Assigned', 'On Hold', 'Cancelled'],
        'Assigned': ['In Progress', 'On Hold', 'Device Collected', 'Cancelled'],
        'In Progress': ['On Hold', 'Device Collected', 'Awaiting Workshop Repair', 'Ready to Close', 'Cancelled'],
        'On Hold': ['Assigned', 'In Progress', 'Cancelled'],
        'Device Collected': ['Awaiting Workshop Repair', 'Ready to Close', 'Cancelled'],
        'Awaiting Workshop Repair': ['Ready to Close', 'Cancelled'],
        'Ready to Close': ['Pending Closure', 'Cancelled'],
        'Pending Closure': ['Closed', 'Cancelled'],
        'Closed': ['Reopened'],
        'Reopened': ['Assigned', 'In Progress', 'On Hold', 'Cancelled'],
        'Cancelled': [] // No transitions after cancelled
    };

    // Allow keeping the same status if other fields are being updated
    if (currentStatus === newStatus && !isOnlyStatusUpdate) {
        return true;
    }

    return validTransitions[currentStatus]?.includes(newStatus) || false;
}

module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob,
    assignJob,
    getJobsByCustomer,
    getJobsByStatus
};