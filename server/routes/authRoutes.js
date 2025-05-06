const express = require('express');
const authController = require('../controllers/authController');
const { auth, authorize } = require('../middlewares/auth');

const router = express.Router();

router.post('/signup', auth(), authorize(['admin', 'manager']), authController.signup);
router.post('/login', authController.login);

module.exports = router;