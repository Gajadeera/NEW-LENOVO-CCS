const express = require('express');
const inventoryController = require('../controllers/inventoryController');
const { auth, authorize } = require('../middlewares/auth');

const router = express.Router();

router.get('/', inventoryController.getAllInventory);
router.get('/low-stock', auth(), authorize(['admin', 'manager']), inventoryController.getLowStockItems);
router.get('/:id', inventoryController.getInventoryItem);

router.use(auth());

router.post('/', authorize(['admin', 'manager']), inventoryController.createInventoryItem);
router.put('/:id', authorize(['admin', 'manager']), inventoryController.updateInventoryItem);
router.patch('/:id/stock', authorize(['admin', 'manager']), inventoryController.updateStockLevel);
router.delete('/:id', authorize(['admin']), inventoryController.deleteInventoryItem);

module.exports = router;