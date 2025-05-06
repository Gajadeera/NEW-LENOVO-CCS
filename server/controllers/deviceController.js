const httpStatus = require('http-status');
const Device = require('../models/Device');
const ApiError = require('../utils/apiError');

const getAllDevices = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, search, sort, device_type } = req.query;
        const query = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { serial_number: { $regex: search, $options: 'i' } }
            ];
        }
        if (device_type) query.device_type = device_type;

        const devices = await Device.find(query)
            .sort(sort || '-created_at')
            .skip((page - 1) * limit)
            .limit(limit);

        const count = await Device.countDocuments(query);
        const totalPages = Math.ceil(count / limit);

        res.send({
            devices,
            count,
            totalPages,
            page: parseInt(page),
            limit: parseInt(limit)
        });
    } catch (error) {
        next(error);
    }
};

const getDevice = async (req, res, next) => {
    try {
        const device = await Device.findById(req.params.id);
        if (!device) throw new ApiError(httpStatus.NOT_FOUND, 'Device not found');
        res.send(device);
    } catch (error) {
        next(error);
    }
};

const getDevicesByType = async (req, res, next) => {
    try {
        const devices = await Device.find({ type: req.params.type });
        res.send(devices);
    } catch (error) {
        next(error);
    }
};

const createDevice = async (req, res, next) => {
    try {
        const device = await Device.create(req.body);
        res.send(device);
    } catch (error) {
        next(error);
    }
};

const updateDevice = async (req, res, next) => {
    try {
        const device = await Device.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!device) throw new ApiError(httpStatus.NOT_FOUND, 'Device not found');
        res.send(device);
    } catch (error) {
        next(error);
    }
};

const deleteDevice = async (req, res, next) => {
    try {
        const device = await Device.findByIdAndDelete(req.params.id);
        if (!device) throw new ApiError(httpStatus.NOT_FOUND, 'Device not found');
        res.send({ message: 'Device deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllDevices,
    getDevice,
    getDevicesByType,
    createDevice,
    updateDevice,
    deleteDevice
};