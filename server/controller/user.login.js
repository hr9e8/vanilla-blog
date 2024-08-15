const db = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    // check if email and password is given
    if (!email || !password) {
      return res.status(400).json({
        message: 'Missing email or password.',
      });
    }

    const userQuery = 'SELECT * from users WHERE email = $1';
    const userValues = [email];

    const results = await db.query(userQuery, userValues);

    // check if email exists
    if (results.rows.length === 0) {
      return res.status(400).json({
        message: 'Account not found. Please register.',
      });
    }

    const user = results.rows[0];

    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    // check if password is valid
    if (!isValidPassword) {
      return res.status(400).json({
        message: 'Invalid credentials.',
      });
    }
    // assign token when user is authenticated
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '900000' }
    );
    // create cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 90000000,
    });

    return res.status(200).json({
      message: 'Login successful',
      redirect: '/posts',
    });
  } catch (error) {
    console.error(error);
  }
}

module.exports = loginUser;
