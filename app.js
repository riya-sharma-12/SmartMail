const express = require('express');
const dotenv = require('dotenv');
const emailRoutes = require('./routes/emailRoutes');
const { emailController } = require('./controller/emailController');
const { processReplies } = require('./services/replyProcessor');
const adminRoutes = require('./routes/adminRoutes');
const CORS = require('cors')

dotenv.config();

const app = express();
app.use(express.json());
app.use(CORS());
app.use('/api/emails', emailRoutes);
app.use('/api/admin', adminRoutes);

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000 --');

  // Step 1: Start email fetching
  // emailController();
  // console.log("Done");
  processReplies();
  // console.log("Replies generated");
});