const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const createNewUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validate the request body is not empty
    if (!email || !password) {
      return res.status(400).json({
        message: 'Missing email or password.',
      });
    }

    //validate email string
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    const isValidEmail = emailRegex.test(email);

    if (!isValidEmail) {
      return res.status(400).json({
        message: 'Invalid Email',
      });
    }

    //validate password string
    // we want it to be minimum 8 characters, must have special numbers, capital letter, number
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
    const isValidPassword = passwordRegex.test(password);

    if (!isValidPassword) {
      return res.status(400).json({
        message:
          'Password requires minimum 8 characters, must have at least one special character, number and capital letter.',
      });
    }

    // check if email already exists
    const checkUserQuery = 'SELECT * FROM users WHERE email =$1';
    const checkUserValues = [email];
    const result = await db.query(checkUserQuery, checkUserValues);

    if (result.rows.length > 0) {
      return res.status(400).json({
        message: 'Email already exists.',
      });
    }

    //create hashedPassword
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const insertUserQuery =
      'INSERT INTO users(email, password_hash) VALUES ($1, $2) RETURNING *';
    const insertResult = await db.query(insertUserQuery, [
      email,
      hashedPassword,
    ]);

    const newUser = insertResult.rows[0];

    //create and assign token when user logs in
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '900000' } // in seconds
    );

    // set the token in an HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 90000000, // 15 min in ms
    });

    res.status(201).json({
      message: 'User created successfully.',
      redirect: '/posts',
      user: { id: newUser.id, email: newUser.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};

module.exports = createNewUser;
