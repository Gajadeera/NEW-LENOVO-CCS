const httpStatus = require('http-status');
const Notification = require('../models/Notification');
const ApiError = require('../utils/apiError');

const getUserNotifications = async (req, res, next) => {
    try {
        const notifications = await Notification.find({ user_id: req.user._id })
            .sort('-created_at');
        res.send(notifications);
    } catch (error) {
        next(error);
    }
};

const getUnreadNotifications = async (req, res, next) => {
    try {
        const notifications = await Notification.find({
            user_id: req.user._id,
            is_read: false
        }).sort('-created_at');
        res.send(notifications);
    } catch (error) {
        next(error);
    }
};

const markNotificationAsRead = async (req, res, next) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, user_id: req.user._id },
            { is_read: true },
            { new: true }
        );
        if (!notification) throw new ApiError(httpStatus.NOT_FOUND, 'Notification not found');
        res.send(notification);
    } catch (error) {
        next(error);
    }
};

const deleteNotification = async (req, res, next) => {
    try {
        const notification = await Notification.findOneAndDelete({
            _id: req.params.id,
            user_id: req.user._id
        });
        if (!notification) throw new ApiError(httpStatus.NOT_FOUND, 'Notification not found');
        res.send({ message: 'Notification deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getUserNotifications,
    getUnreadNotifications,
    markNotificationAsRead,
    deleteNotification
};