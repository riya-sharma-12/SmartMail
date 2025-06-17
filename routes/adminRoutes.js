const express = require('express');
const router = express.Router();
const { getallEmails, getallEmailsBySubjs, botChat } = require('../controller/adminController');
const {authenticateToken} = require('../middlewares/auth');

router.get('/getallEmails', authenticateToken, getallEmails);

router.post('/getallEmailsBySubjs', authenticateToken, getallEmailsBySubjs);


//new
router.post('/botChat', botChat)


module.exports = router;
