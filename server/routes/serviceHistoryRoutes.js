const express = require('express');
const serviceHistoryController = require('../controllers/serviceHistoryController');
const { auth, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(auth());

router.post('/service-history', authorize(['admin', 'manager', 'technician']), serviceHistoryController.createServiceHistory);
router.get('/service-history/device/:deviceId', authorize(['admin', 'manager', 'technician']), serviceHistoryController.getHistoryByDevice);
router.get('/service-history/job/:jobId', authorize(['admin', 'manager', 'technician']), serviceHistoryController.getHistoryByJob);
router.get('/service-history/:id', authorize(['admin', 'manager']), serviceHistoryController.getServiceHistory);
router.put('/service-history/:id', authorize(['admin', 'manager']), serviceHistoryController.updateServiceHistory);
router.delete('/service-history/:id', authorize(['admin']), serviceHistoryController.deleteServiceHistory);

module.exports = router;