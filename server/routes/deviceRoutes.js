const express = require('express');
const deviceController = require('../controllers/deviceController');
const { auth, authorize } = require('../middlewares/auth');

const router = express.Router();

// Public routes
router.get('/', deviceController.getAllDevices);
router.get('/type/:type', deviceController.getDevicesByType);
router.get('/:id', deviceController.getDevice);

// Protected routes
router.use(auth());

router.post('/', authorize(['admin', 'manager']), deviceController.createDevice);
router.put('/:id', authorize(['admin', 'manager']), deviceController.updateDevice);
router.delete('/:id', authorize(['admin', 'manager']), deviceController.deleteDevice);

module.exports = router;