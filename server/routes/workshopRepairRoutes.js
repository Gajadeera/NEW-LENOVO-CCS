const express = require('express');
const workshopRepairController = require('../controllers/workshopRepairController');
const { auth, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(auth());

router.post('/', authorize(['admin', 'manager', 'technician']), workshopRepairController.createWorkshopRepair);
router.get('/', authorize(['admin', 'manager']), workshopRepairController.getAllWorkshopRepairs);
router.get('/job/:jobId', authorize(['admin', 'manager', 'technician']), workshopRepairController.getRepairByJob);
router.get('/status/:status', authorize(['admin', 'manager']), workshopRepairController.getRepairsByStatus);
router.get('/:id', authorize(['admin', 'manager', 'technician']), workshopRepairController.getWorkshopRepair);
router.put('/:id', authorize(['admin', 'manager']), workshopRepairController.updateWorkshopRepair);
router.patch('/:id/status', authorize(['admin', 'manager']), workshopRepairController.updateRepairStatus);
router.delete('/:id', authorize(['admin']), workshopRepairController.deleteWorkshopRepair);

module.exports = router;