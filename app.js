const express = require('express');
const dotenv = require('dotenv');
const emailRoutes = require('./routes/emailRoutes');
const authRoutes = require('./routes/authRoutes');
const { fetchAllMails } = require('./controller/emailController');
// const { processReplies } = require('./services/replyProcessor');
const adminRoutes = require('./routes/adminRoutes');
const CORS = require('cors');
const replyRoutes = require('./routes/replyRoutes');
const { startCronJobs } = require('./scheduler');
dotenv.config();

const app = express();
app.use(express.json());
app.use(CORS());
app.use('/api/emails', emailRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reply', replyRoutes);
app.use('/api/auth', authRoutes); 

app.listen(5000, async () => {
  console.log('Server running on http://localhost:5000 --');
  // await fetchAllMails();
  // processReplies();
});

startCronJobs();