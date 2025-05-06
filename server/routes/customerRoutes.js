const express = require('express');
const customerController = require('../controllers/customerController');
const { auth, authorize } = require('../middlewares/auth');

const router = express.Router();

// Public routes
router.get('/', customerController.getAllCustomers);
router.get('/location/:location', customerController.getCustomersByLocation);
router.get('/:customerId', customerController.getCustomer);

// Protected routes
router.use(auth());

router.post('/', authorize(['admin', 'manager']), customerController.createCustomer);
router.put('/:customerId', authorize(['admin', 'manager']), customerController.updateCustomer);
router.delete('/:customerId', authorize(['admin', 'manager']), customerController.deleteCustomer);

module.exports = router