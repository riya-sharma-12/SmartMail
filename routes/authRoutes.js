// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { requestSignup, verifySignup, login } = require('../controller/authController');

router.post('/request-signup', requestSignup);   // Step 1: Send OTP
router.post('/verify-signup', verifySignup);     // Step 2: Signup with OTP
router.post('/login', login);

module.exports = router;
