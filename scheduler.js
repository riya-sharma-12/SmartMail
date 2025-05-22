const cron = require('node-cron');
const { exec } = require('child_process');

// Run every day at 12:00 AM and 6:00 PM
cron.schedule('0 0,18 * * *', () => {
  console.log(`[${new Date().toLocaleString()}] Running email fetcher...`);
  exec('node fetchEmails.js');
});
