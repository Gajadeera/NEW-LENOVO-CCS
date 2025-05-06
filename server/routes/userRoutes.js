const express = require('express');
const userController = require('../controllers/userController');
const { auth, authorize } = require('../middlewares/auth');

const router = express.Router();

// Public routes
router.post('/users/forgot-password', userController.forgotPassword);
router.post('/users/reset-password/:token', userController.resetPassword);

// Protected routes
router.use(auth());

// Profile routes
router.get('/users/me', userController.getProfile);
router.put('/users/me', userController.updateProfile);
router.patch('/users/me/change-password', userController.changePassword);

// User management routes
router.get('/', authorize(['admin', 'manager', 'coordinator', 'technician']), userController.getAllUsers);
router.post('/', authorize(['admin']), userController.createUser);
router.get('/:id', authorize(['admin', 'manager']), userController.getUserById);
router.put('/:id', authorize(['admin', 'manager']), userController.updateUser);
router.delete('/:id', authorize(['admin', 'manager']), userController.deleteUser);

// Role-based routes
router.get('/role/:role', authorize(['admin', 'manager']), userController.getUsersByRole);

// Skill management
router.post('/:id/skills', authorize(['admin', 'manager', 'technician']), userController.addUserSkill);
router.delete('/:id/skills/:skill', authorize(['admin', 'manager', 'technician']), userController.removeUserSkill);

module.exports = router;