const express = require('express');
const partsRequestController = require('../controllers/partsRequestController');
const { auth, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(auth());

router.post('/', authorize(['admin', 'manager', 'technician']), partsRequestController.createPartsRequest);
router.get('/', authorize(['admin', 'manager', 'coordinator', 'technician', 'parts_team']), partsRequestController.getAllPartsRequests);
router.get('/job/:jobId', authorize(['admin', 'manager', 'technician']), partsRequestController.getRequestsByJob);
router.get('/:id', authorize(['admin', 'manager', 'technician']), partsRequestController.getPartsRequest);
router.put('/:id/approve', authorize(['admin', 'manager']), partsRequestController.approvePartsRequest);
router.put('/:id/reject', authorize(['admin', 'manager']), partsRequestController.rejectPartsRequest);
router.put('/:id/fulfill', authorize(['admin', 'manager']), partsRequestController.fulfillPartsRequest);
router.delete('/:id', authorize(['admin']), partsRequestController.deletePartsRequest);

module.exports = router;