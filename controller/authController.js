// controller/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const pool = new Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
});

// exports.signup = async (req, res) => {
//   const { org_name, email, password } = req.body;
//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '2h' });

//     const query = `
//       INSERT INTO organizations (org_name, email, password, token, created_at)
//       VALUES ($1, $2, $3, $4, NOW()) RETURNING *;
//     `;
//     const values = [org_name, email, hashedPassword, token];
//     const result = await pool.query(query, values);
//     res.status(201).json({ message: 'User created', data: result.rows[0] });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Signup failed', error: err.message });
//   }
// };

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const query = "SELECT * FROM organizations WHERE email = $1";
    const result = await pool.query(query, [email]);

    if (result.rows.length === 0)
      return res.status(404).json({ message: "User not found" });

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });
    await pool.query("UPDATE organizations SET token = $1 WHERE email = $2", [
      token,
      email,
    ]);

    // res.json({ message: "Login successful", token });
    console.log("LOGIN SUCCESS RESPONSE:", {
  message: "Login successful",
  token,
  org_id: user.org_id
});
res.json({
  message: "Login successful",
  token,
  org_id: user.org_id
});


  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
};

exports.requestSignup = async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    // Save OTP to DB with 10-min expiry
    await pool.query(
      `
      INSERT INTO email_otps (email, otp, expires_at)
      VALUES ($1, $2, NOW() + interval '10 minutes')
      ON CONFLICT (email)
      DO UPDATE SET otp = $2, expires_at = NOW() + interval '10 minutes';
    `,
      [email, otp]
    );

    // Send OTP to email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // your admin Gmail App Password
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP for SmartMail Signup",
      text: `Your OTP is ${otp}. It expires in 10 minutes.`,
    });
    // console.log("Sending OTP to:", email);

    res.status(200).json({ message: "OTP sent to email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send OTP", error: err.message });
  }
};

exports.verifySignup = async (req, res) => {
  const { email, password, gmail_app_password, otp } = req.body;
  try {
    // 1. Check OTP
    const result = await pool.query(
      "SELECT * FROM email_otps WHERE email = $1 AND otp = $2 AND expires_at > NOW()",
      [email, otp]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // 2. Hash passwords
    // 2. Hash passwords
    const hashedPassword = await bcrypt.hash(password, 10);

    // Derive a 32-byte key from the secret
    const key = crypto
      .createHash("sha256")
      .update(process.env.JWT_SECRET)
      .digest();

    // Generate a random 16-byte IV
    // const iv = crypto.randomBytes(16);

    // // Encrypt the Gmail app password
    // const cipher = crypto.createCipheriv("aes-256-ctr", key, iv);
    // let encrypted = cipher.update(gmail_app_password, "utf8", "hex");
    // encrypted += cipher.final("hex");

    // // Store both IV and encrypted string (joined with ':')
    // const encryptedAppPassword = iv.toString("hex") + ":" + encrypted;

    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    // 3. Store in organizations
    await pool.query(
      `
      INSERT INTO organizations (email, password, gmail_app_password, token, is_verified, created_at)
      VALUES ($1, $2, $3, $4, true, NOW())
    `,
      [ email, hashedPassword, gmail_app_password, token]
    );

    // 4. Clean up OTP entry
    await pool.query("DELETE FROM email_otps WHERE email = $1", [email]);

    res.status(201).json({ message: "Signup successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
};
