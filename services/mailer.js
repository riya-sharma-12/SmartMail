const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
  password: process.env.EMAIL_PASS
  },
});

async function sendMail({ to, subject, text }) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });
    console.log(`Email sent to ${to}`);
    alert(`Email sent to ${to}`);
  } catch (error) {
    console.error('Error sending mail:', error);
    throw error;
  }
}

module.exports = { sendMail };