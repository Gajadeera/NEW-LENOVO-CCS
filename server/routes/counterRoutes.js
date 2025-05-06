const express = require('express');
const counterController = require('../controllers/counterController');
const { auth, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(auth());

router.get('/counters/:id', authorize(['admin']), counterController.getCounter);
router.put('/counters/:id/increment', authorize(['admin']), counterController.incrementCounter);

module.exports = router;