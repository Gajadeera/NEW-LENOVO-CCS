const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const ApiError = require('../utils/apiError');
const config = require('../config/config');
const User = require('../models/User');

const auth = () => async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            console.log('No token provided');
        }

        if (!token) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required and here hit the error');
        }

        const decoded = jwt.verify(token, config.jwt.secret);
        const user = await User.findById(decoded.id);

        if (!user) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'User not found');
        }

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};

const authorize = (roles) => async (req, res, next) => {
    try {
        if (!roles.includes(req.user.role)) {
            return next(new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to access this resource'));
        }
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    auth,
    authorize
};