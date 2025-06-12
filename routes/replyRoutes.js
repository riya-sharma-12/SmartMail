const express = require('express');
const router = express.Router();
const { saveReply, sendReplyEmail } = require('../controller/replyController');
const {authenticateToken} = require('../middlewares/auth');
router.post('/saveReply', saveReply);
router.post('/sendReplyEmail',authenticateToken, sendReplyEmail);

module.exports = router;