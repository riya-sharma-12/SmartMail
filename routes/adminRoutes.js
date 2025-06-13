const express = require('express');
const router = express.Router();
const { getAllEmails, getAllEmailsBySubjs, botChat } = require('../controller/adminController');
const {authenticateToken} = require('../middlewares/auth');

router.get('/getAllEmails', authenticateToken, getAllEmails);

router.post('/getAllEmailsBySubjs', authenticateToken, getAllEmailsBySubjs);


//new
router.post('/botChat', botChat)


module.exports = router;
