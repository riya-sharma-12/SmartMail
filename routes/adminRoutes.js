const express = require('express');
const router = express.Router();
const { getAllEmails, getAllEmailsBySubjs } = require('../controller/adminController');

router.get('/getAllEmails', getAllEmails);

router.post('/getAllEmailsBySubjs', getAllEmailsBySubjs)

module.exports = router;
