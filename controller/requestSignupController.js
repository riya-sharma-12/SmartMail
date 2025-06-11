const crypto = require('crypto');
const nodemailer = require('nodemailer');

exports.requestSignup = async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    // Save OTP to DB with 10-min expiry
    await pool.query(`
      INSERT INTO email_otps (email, otp, expires_at)
      VALUES ($1, $2, NOW() + interval '10 minutes')
      ON CONFLICT (email)
      DO UPDATE SET otp = $2, expires_at = NOW() + interval '10 minutes';
    `, [email, otp]);

    // Send OTP to email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS // your admin Gmail App Password
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP for SmartMail Signup',
      text: `Your OTP is ${otp}. It expires in 10 minutes.`
    });

    res.status(200).json({ message: 'OTP sent to email' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to send OTP', error: err.message });
  }
};
