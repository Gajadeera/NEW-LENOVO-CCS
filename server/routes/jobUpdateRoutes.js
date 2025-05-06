const express = require('express');
const jobUpdateController = require('../controllers/jobUpdateController');
const { auth, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(auth());

router.post('/job-updates', authorize(['admin', 'manager', 'technician']), jobUpdateController.createJobUpdate);
router.get('/job-updates/job/:jobId', authorize(['admin', 'manager', 'technician']), jobUpdateController.getUpdatesByJob);
router.get('/job-updates/:id', authorize(['admin', 'manager', 'technician']), jobUpdateController.getJobUpdate);
router.delete('/job-updates/:id', authorize(['admin', 'manager']), jobUpdateController.deleteJobUpdate);

module.exports = router;