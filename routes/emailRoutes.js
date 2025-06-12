const express = require('express');
const { emailController } = require('../controller/emailController');

const router = express.Router();

router.get('/fetch-emails', async (req, res) => {
    const org_id = req.headers.org_id;

  if (!org_id) {
    return res.status(400).json({ message: "org_id missing" });
  }
  try {// Wait for it to complete
    res.send('Fetching new emails...');
  } catch (err) {
    console.error('Error in emailController:', err);
    res.status(500).send('Failed to fetch emails.');
  }
});
module.exports = router;
