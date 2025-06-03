const express = require('express');
const router = express.Router();
const { saveReply, sendReplyEmail } = require('../controller/replyController');

router.post('/saveReply', saveReply);
router.post('/sendReplyEmail', sendReplyEmail);

module.exports = router;
