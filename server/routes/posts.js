const express = require('express');
const router = express.Router();
const path = require('path');
const getPosts = require('../controller/user.post');
const createPosts = require('../controller/user.post.new');

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'client', 'posts.html'));
});

router.get('/data', async (req, res) => {
  try {
    const posts = await getPosts(req.user.userId);
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'An error occured while fetching posts',
    });
  }
});

router.get('/new', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'client', 'new.html'));
});

router.post('/new', createPosts);

module.exports = router;
