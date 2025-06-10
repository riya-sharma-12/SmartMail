const express = require('express');
const router = express.Router();
const { getAllEmails, getAllEmailsBySubjs, botChat } = require('../controller/adminController');

router.get('/getAllEmails', getAllEmails);

router.post('/getAllEmailsBySubjs', getAllEmailsBySubjs)

//new
router.post('/botChat', botChat)


module.exports = router;
