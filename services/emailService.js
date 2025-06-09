const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');
const Email = require('../models/email');
const Reply = require('../models/reply');

async function saveEmailToDB(emailData) {
  let {
    from_email,
    subject,
    body,
    category,
    status,
    created_at,
    received_at,
    email_message_id
  } = emailData;

  const resp_id = uuidv4();
  const org_id = '11111111-1111-1111-1111-111111111111';
  
  const emailMatch = from_email?.match(/<([^>]+)>/);
  if (emailMatch && emailMatch[1]) {
    from_email = emailMatch[1]; // Set to just the email address
  } else {
    // Case 2: Remove quotes if email does not have < >
    from_email = from_email?.replace(/['"]+/g, '');
  }

  try {
  await Email.create({
  resp_id: resp_id,
  org_id: org_id,
  from_email: from_email,
  subject: subject,
  body: body,
  category: category,
  status: status,
  created_at: created_at,
  received_at: received_at,
  email_message_id:email_message_id
});
console.log('Email saved to DB with ID:', resp_id);
  } catch (err) {
    console.error('Error saving email to DB:', err);
  }
}

module.exports = {
  saveEmailToDB
};