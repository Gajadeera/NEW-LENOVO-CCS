const express = require('express');
const jobController = require('../controllers/jobController');
const { auth, authorize } = require('../middlewares/auth');

const router = express.Router();

// Protected routes
router.use(auth());

// Job management
router.get('/', authorize(['admin', 'manager', 'technician', 'coordinator']), jobController.getAllJobs);
router.post('/', authorize(['admin', 'manager', 'technician', 'coordinator']), jobController.createJob);
router.get('/:id', authorize(['admin', 'manager', 'technician', 'coordinator']), jobController.getJob);
router.put('/:id', authorize(['admin', 'manager', 'coordinator']), jobController.updateJob);
router.delete('/:id', authorize(['manager']), jobController.deleteJob);

// Job assignment
router.put('/:id/assign', authorize(['admin', 'manager']), jobController.assignJob);

// Filtered job routes
router.get('/customer/:customerId', authorize(['admin', 'manager', 'technician']), jobController.getJobsByCustomer);
router.get('/status/:status', authorize(['admin', 'manager', 'technician']), jobController.getJobsByStatus);

module.exports = router;