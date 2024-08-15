require('dotenv').config();
const db = require('./db');
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const authMiddleware = require('./middleware/auth');
const registerRoute = require('./routes/register');
const loginRoute = require('./routes/login');
const postRoute = require('./routes/posts');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(
  cors({
    origin: 'http://localhost:8000',
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '..', 'client')));

app.use('/', registerRoute);
app.use('/login', loginRoute);
app.use('/posts', authMiddleware, postRoute);

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, '..', 'client', '404.html'));
});

app.listen(PORT, () => {
  console.log(`App is connected to PORT: ${PORT}`);
  db.testConnection();
});
