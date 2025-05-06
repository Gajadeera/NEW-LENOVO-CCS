const httpStatus = require('http-status');
const Counter = require('../models/Counter');
const ApiError = require('../utils/apiError');

const getCounter = async (req, res, next) => {
    try {
        const counter = await Counter.findById(req.params.id);
        if (!counter) throw new ApiError(httpStatus.NOT_FOUND, 'Counter not found');
        res.send(counter);
    } catch (error) {
        next(error);
    }
};

const incrementCounter = async (req, res, next) => {
    try {
        const counter = await Counter.findByIdAndUpdate(
            req.params.id,
            { $inc: { sequence_value: 1 } },
            { new: true }
        );
        if (!counter) throw new ApiError(httpStatus.NOT_FOUND, 'Counter not found');
        res.send(counter);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getCounter,
    incrementCounter
};