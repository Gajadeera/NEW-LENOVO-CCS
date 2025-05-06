const express = require('express');
const notificationController = require('../controllers/notificationController');
const { auth } = require('../middlewares/auth');

const router = express.Router();

router.use(auth());

router.get('/notifications', notificationController.getUserNotifications);
router.get('/notifications/unread', notificationController.getUnreadNotifications);
router.patch('/notifications/:id/mark-read', notificationController.markNotificationAsRead);
router.delete('/notifications/:id', notificationController.deleteNotification);

module.exports = router;