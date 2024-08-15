const express = require('express');
const router = express.Router();
const createNewUser = require('../controller/user.create');
const path = require('path');

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'client', 'index.html'));
});

router.post('/', createNewUser);

module.exports = router;
