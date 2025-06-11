const crypto = require('crypto');

exports.verifySignup = async (req, res) => {
  const { org_name, email, password, gmail_app_password, otp } = req.body;
  try {
    // 1. Check OTP
    const result = await pool.query(
      'SELECT * FROM email_otps WHERE email = $1 AND otp = $2 AND expires_at > NOW()',
      [email, otp]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // 2. Hash passwords
    const hashedPassword = await bcrypt.hash(password, 10);
    const encryptedAppPassword = crypto.createCipher('aes-256-ctr', process.env.JWT_SECRET).update(gmail_app_password, 'utf8', 'hex');

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '2h' });

    // 3. Store in organizations
    await pool.query(`
      INSERT INTO organizations (org_name, email, password, gmail_app_password, token, is_verified, created_at)
      VALUES ($1, $2, $3, $4, $5, true, NOW())
    `, [org_name, email, hashedPassword, encryptedAppPassword, token]);

    // 4. Clean up OTP entry
    await pool.query('DELETE FROM email_otps WHERE email = $1', [email]);

    res.status(201).json({ message: 'Signup successful', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Signup failed', error: err.message });
  }
};
