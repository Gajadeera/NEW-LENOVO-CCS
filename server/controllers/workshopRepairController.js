const httpStatus = require('http-status');
const WorkshopRepair = require('../models/WorkshopRepair');
const Job = require('../models/Job');
const Device = require('../models/Device');
const User = require('../models/User');
const ApiError = require('../utils/apiError');

const createWorkshopRepair = async (req, res, next) => {
    try {
        const { job_id, device_id } = req.body;

        // Validate references
        const job = await Job.findById(job_id);
        const device = await Device.findById(device_id);

        if (!job) throw new ApiError(httpStatus.NOT_FOUND, 'Job not found');
        if (!device) throw new ApiError(httpStatus.NOT_FOUND, 'Device not found');

        // Check if repair already exists for this job
        const existingRepair = await WorkshopRepair.findOne({ job_id });
        if (existingRepair) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Repair already exists for this job');
        }

        const repair = await WorkshopRepair.create(req.body);
        res.status(httpStatus.CREATED).send(repair);
    } catch (error) {
        next(error);
    }
};

const getAllWorkshopRepairs = async (req, res, next) => {
    try {
        const repairs = await WorkshopRepair.find()
            .populate('job_id', 'job_number')
            .populate('device_id', 'serial_number')
            .populate('diagnosed_by', 'name')
            .sort('-received_date');
        res.send(repairs);
    } catch (error) {
        next(error);
    }
};

const getRepairByJob = async (req, res, next) => {
    try {
        const repair = await WorkshopRepair.findOne({ job_id: req.params.jobId })
            .populate('device_id', 'serial_number')
            .populate('diagnosed_by', 'name');
        if (!repair) throw new ApiError(httpStatus.NOT_FOUND, 'Repair not found');
        res.send(repair);
    } catch (error) {
        next(error);
    }
};

const getRepairsByStatus = async (req, res, next) => {
    try {
        const repairs = await WorkshopRepair.find({ status: req.params.status })
            .populate('job_id', 'job_number')
            .populate('device_id', 'serial_number')
            .sort('-received_date');
        res.send(repairs);
    } catch (error) {
        next(error);
    }
};

const getWorkshopRepair = async (req, res, next) => {
    try {
        const repair = await WorkshopRepair.findById(req.params.id)
            .populate('job_id', 'job_number')
            .populate('device_id', 'serial_number')
            .populate('diagnosed_by', 'name');
        if (!repair) throw new ApiError(httpStatus.NOT_FOUND, 'Repair not found');
        res.send(repair);
    } catch (error) {
        next(error);
    }
};

const updateWorkshopRepair = async (req, res, next) => {
    try {
        const repair = await WorkshopRepair.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!repair) throw new ApiError(httpStatus.NOT_FOUND, 'Repair not found');
        res.send(repair);
    } catch (error) {
        next(error);
    }
};

const updateRepairStatus = async (req, res, next) => {
    try {
        const { status, diagnosed_by } = req.body;
        const validStatuses = ["Received", "In Diagnosis", "In Repair", "Quality Check", "Ready for Return", "Returned"];

        if (!validStatuses.includes(status)) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid status');
        }

        const repair = await WorkshopRepair.findById(req.params.id);
        if (!repair) throw new ApiError(httpStatus.NOT_FOUND, 'Repair not found');

        // If moving to diagnosis, require technician
        if (status === "In Diagnosis" && !diagnosed_by) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Diagnosed by is required for diagnosis status');
        }

        // Validate technician if provided
        if (diagnosed_by) {
            const technician = await User.findById(diagnosed_by);
            if (!technician) throw new ApiError(httpStatus.NOT_FOUND, 'Technician not found');
            repair.diagnosed_by = diagnosed_by;
        }

        repair.status = status;
        await repair.save();
        res.send(repair);
    } catch (error) {
        next(error);
    }
};

const deleteWorkshopRepair = async (req, res, next) => {
    try {
        const repair = await WorkshopRepair.findByIdAndDelete(req.params.id);
        if (!repair) throw new ApiError(httpStatus.NOT_FOUND, 'Repair not found');
        res.send({ message: 'Repair deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createWorkshopRepair,
    getAllWorkshopRepairs,
    getRepairByJob,
    getRepairsByStatus,
    getWorkshopRepair,
    updateWorkshopRepair,
    updateRepairStatus,
    deleteWorkshopRepair
};