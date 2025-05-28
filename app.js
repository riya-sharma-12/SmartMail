const express = require('express');
const dotenv = require('dotenv');
const emailRoutes = require('./routes/emailRoutes');
const { emailController } = require('./controller/emailController');
const { processReplies } = require('./services/replyProcessor');
dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/emails', emailRoutes);

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000 --');

  // Step 1: Start email fetching
  // emailController();
  console.log("Done");
  processReplies();
  console.log("Replies generated");
});