const cron = require('node-cron');
const { fetchAllMails } = require('./controller/emailController');

function startCronJobs() {
  cron.schedule('0 10 * * *', async () => {
    console.log('Running scheduled job: 10 AM mail fetch');
    await fetchAllMails();
  });

  // every minute for testing
  // cron.schedule('* * * * *', async () => {
  //   console.log('⏰ Running test job: Fetching emails + processing replies...');
  //   await fetchAllMails();
  // });
  cron.schedule('0 18 * * *', async () => {
    console.log('Running scheduled job: 6 PM mail fetch');
    await fetchAllMails();
  });
}

module.exports = { startCronJobs };
