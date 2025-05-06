const httpStatus = require('http-status');
const User = require('../models/User');
const ApiError = require('../utils/apiError');

const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
        res.send(user);
    } catch (error) {
        next(error);
    }
};

const updateProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');

        if (req.body.email && await User.isEmailTaken(req.body.email, req.user._id)) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
        }

        Object.assign(user, req.body);
        await user.save();
        res.send(user);
    } catch (error) {
        next(error);
    }
};

const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id).select('+password');

        if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
        if (!(await user.isPasswordMatch(currentPassword))) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Current password is incorrect');
        }

        user.password = newPassword;
        await user.save();
        res.send({ message: 'Password changed successfully' });
    } catch (error) {
        next(error);
    }
};

const createUser = async (req, res, next) => {
    try {
        if (await User.isEmailTaken(req.body.email)) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
        }
        const user = await User.create(req.body);
        res.status(201).send(user);

    } catch (error) {
        next(error);
    }
};

const getAllUsers = async (req, res, next) => {
    try {
        const { role } = req.query;
        const query = role ? { role } : {};
        const users = await User.find(query);

        // If WebSocket connection exists, set up real-time updates
        if (req.app.locals.activeConnections && req.app.locals.activeConnections.size > 0) {
            // Notify all connected clients about user list update
            const message = {
                type: 'USERS_UPDATED',
                data: users,
                timestamp: new Date()
            };

            // Broadcast to all connected clients
            req.app.locals.wss.clients.forEach(client => {
                if (client.readyState === client.OPEN) {
                    client.send(JSON.stringify(message));
                }
            });
        }

        res.send(users);
    } catch (error) {
        next(error);
    }
};

const getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');

        // If WebSocket connection exists, notify specific user about profile view
        if (req.app.locals.activeConnections) {
            const ws = req.app.locals.activeConnections.get(user._id.toString());
            if (ws && ws.readyState === ws.OPEN) {
                const message = {
                    type: 'PROFILE_VIEWED',
                    data: {
                        viewerId: req.user?._id,
                        timestamp: new Date()
                    }
                };
                ws.send(JSON.stringify(message));
            }
        }

        res.send(user);
    } catch (error) {
        next(error);
    }
};
const updateUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');

        if (req.body.email && await User.isEmailTaken(req.body.email, req.params.id)) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
        }

        Object.assign(user, req.body);
        await user.save();
        res.send(user);
    } catch (error) {
        next(error);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
        res.send({ message: 'User deleted successfully' });
    } catch (error) {
        next(error);
    }
};

const getUsersByRole = async (req, res, next) => {
    try {
        const users = await User.find({ role: req.params.role });
        res.send(users);
    } catch (error) {
        next(error);
    }
};

const addUserSkill = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');

        if (!user.skills.includes(req.body.skill)) {
            user.skills.push(req.body.skill);
            await user.save();
        }

        res.send(user);
    } catch (error) {
        next(error);
    }
};

const removeUserSkill = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');

        user.skills = user.skills.filter(skill => skill !== req.params.skill);
        await user.save();

        res.send(user);
    } catch (error) {
        next(error);
    }
};

const forgotPassword = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'No user found with this email');

        const resetToken = user.createPasswordResetToken();
        await user.save();
        res.send({ resetToken });
    } catch (error) {
        next(error);
    }
};

const resetPassword = async (req, res, next) => {
    try {
        const user = await User.findOne({
            passwordResetToken: req.params.token,
            passwordResetExpires: { $gt: Date.now() }
        });
        if (!user) throw new ApiError(httpStatus.BAD_REQUEST, 'Token is invalid or has expired');

        user.password = req.body.newPassword;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        res.send({ message: 'Password has been reset' });
    } catch (error) {
        next(error);
    }
};

const notifyUser = (id, message, req) => {
    if (!req.app.locals.activeConnections) return false;

    const ws = req.app.locals.activeConnections.get(id.toString());
    if (ws && ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify(message));
        return true;
    }
    return false;
};

// Helper function to broadcast to all users
const broadcastToAll = (message, req) => {
    if (!req.app.locals.wss) return 0;

    let count = 0;
    req.app.locals.wss.clients.forEach(client => {
        if (client.readyState === client.OPEN) {
            client.send(JSON.stringify(message));
            count++;
        }
    });
    return count;
};

module.exports = {
    getProfile,
    updateProfile,
    changePassword,
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getUsersByRole,
    addUserSkill,
    removeUserSkill,
    forgotPassword,
    resetPassword,
    notifyUser, // Optional: export if needed elsewhere
    broadcastToAll // Optional: export if needed elsewhere
};