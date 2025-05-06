const httpStatus = require('http-status');
const DeviceServiceHistory = require('../models/DeviceServiceHistory');
const Device = require('../models/Device');
const Job = require('../models/Job');
const User = require('../models/User');
const ApiError = require('../utils/apiError');

const createServiceHistory = async (req, res, next) => {
    try {
        const { device_id, job_id, technician_id } = req.body;

        // Validate references
        const device = await Device.findById(device_id);
        const job = await Job.findById(job_id);
        const technician = await User.findById(technician_id);

        if (!device) throw new ApiError(httpStatus.NOT_FOUND, 'Device not found');
        if (!job) throw new ApiError(httpStatus.NOT_FOUND, 'Job not found');
        if (!technician) throw new ApiError(httpStatus.NOT_FOUND, 'Technician not found');

        const history = await DeviceServiceHistory.create(req.body);
        res.status(httpStatus.CREATED).send(history);
    } catch (error) {
        next(error);
    }
};

const getHistoryByDevice = async (req, res, next) => {
    try {
        const histories = await DeviceServiceHistory.find({ device_id: req.params.deviceId })
            .sort('-service_date')
            .populate('technician_id', 'name');
        res.send(histories);
    } catch (error) {
        next(error);
    }
};

const getHistoryByJob = async (req, res, next) => {
    try {
        const history = await DeviceServiceHistory.findOne({ job_id: req.params.jobId })
            .populate('technician_id', 'name');
        if (!history) throw new ApiError(httpStatus.NOT_FOUND, 'Service history not found');
        res.send(history);
    } catch (error) {
        next(error);
    }
};

const getServiceHistory = async (req, res, next) => {
    try {
        const history = await DeviceServiceHistory.findById(req.params.id)
            .populate('technician_id', 'name');
        if (!history) throw new ApiError(httpStatus.NOT_FOUND, 'Service history not found');
        res.send(history);
    } catch (error) {
        next(error);
    }
};

const updateServiceHistory = async (req, res, next) => {
    try {
        const history = await DeviceServiceHistory.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!history) throw new ApiError(httpStatus.NOT_FOUND, 'Service history not found');
        res.send(history);
    } catch (error) {
        next(error);
    }
};

const deleteServiceHistory = async (req, res, next) => {
    try {
        const history = await DeviceServiceHistory.findByIdAndDelete(req.params.id);
        if (!history) throw new ApiError(httpStatus.NOT_FOUND, 'Service history not found');
        res.send({ message: 'Service history deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createServiceHistory,
    getHistoryByDevice,
    getHistoryByJob,
    getServiceHistory,
    updateServiceHistory,
    deleteServiceHistory
};