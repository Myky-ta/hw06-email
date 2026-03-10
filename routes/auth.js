const express = require('express');
const { register, login, verifyEmail, resendVerification } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify/:verificationToken', verifyEmail);
router.post('/verify', resendVerification);

module.exports = router;
