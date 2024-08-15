const express = require('express');
const router = express.Router();
const loginUser = require('../controller/user.login');
const path = require('path');

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'client', 'login.html'));
});

router.post('/', loginUser);

module.exports = router;
