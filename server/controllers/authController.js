const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/apiError');
const config = require('../config/config');

const signup = async (req, res, next) => {
    try {
        if (await User.isEmailTaken(req.body.email)) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
        }
        const user = await User.create(req.body);
        const authResponse = generateAuthResponse(user);
        res.status(httpStatus.CREATED).send(authResponse);
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.isPasswordMatch(password))) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
        }

        user.last_login = new Date();
        await user.save();

        const authResponse = generateAuthResponse(user);
        res.send(authResponse);
    } catch (error) {
        next(error);
    }
};

const generateAuthResponse = (user) => {
    const token = jwt.sign(
        { id: user._id, role: user.role, name: user.name },
        config.jwt.secret,
        { expiresIn: config.jwt.accessExpirationMinutes * 60 }
    );
    return {
        user: user.toObject({ virtuals: true, versionKey: false }),
        token
    };
};

module.exports = {
    signup,
    login
};