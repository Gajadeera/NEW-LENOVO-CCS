const express = require('express');
const signatureController = require('../controllers/signatureController');
const { auth, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(auth());

router.post('/signatures', authorize(['admin', 'manager', 'technician']), signatureController.createSignature);
router.get('/signatures/job/:jobId', authorize(['admin', 'manager', 'technician']), signatureController.getSignaturesByJob);
router.get('/signatures/customer/:customerId', authorize(['admin', 'manager']), signatureController.getSignaturesByCustomer);
router.get('/signatures/:id', authorize(['admin', 'manager']), signatureController.getSignature);
router.delete('/signatures/:id', authorize(['admin']), signatureController.deleteSignature);

module.exports = router;