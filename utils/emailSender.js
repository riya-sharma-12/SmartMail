const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,     // your gmail email
    pass: process.env.GMAIL_PASS      // your gmail app password
  }
});

async function sendMail(to, subject, text) {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject,
    text
  };
  return transporter.sendMail(mailOptions);
}

module.exports = { sendMail };
