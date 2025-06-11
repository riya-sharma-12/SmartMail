// controller/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE
});

exports.signup = async (req, res) => {
  const { org_name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '2h' });

    const query = `
      INSERT INTO organizations (org_name, email, password, token, created_at)
      VALUES ($1, $2, $3, $4, NOW()) RETURNING *;
    `;
    const values = [org_name, email, hashedPassword, token];
    const result = await pool.query(query, values);
    res.status(201).json({ message: 'User created', data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Signup failed', error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const query = 'SELECT * FROM organizations WHERE email = $1';
    const result = await pool.query(query, [email]);

    if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '2h' });
    await pool.query('UPDATE organizations SET token = $1 WHERE email = $2', [token, email]);

    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Login failed' });
  }
};
