const express = require('express');
const feedbackController = require('../controllers/feedbackController');
const { auth, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(auth());

router.post('/feedbacks', authorize(['admin', 'manager', 'technician']), feedbackController.createFeedback);
router.get('/feedbacks/job/:jobId', authorize(['admin', 'manager', 'technician']), feedbackController.getFeedbackByJob);
router.get('/feedbacks/customer/:customerId', authorize(['admin', 'manager']), feedbackController.getFeedbacksByCustomer);
router.put('/feedbacks/:id', authorize(['admin', 'manager']), feedbackController.updateFeedback);
router.delete('/feedbacks/:id', authorize(['admin']), feedbackController.deleteFeedback);

module.exports = router;