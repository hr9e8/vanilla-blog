const db = require('../db');

async function createPost(req, res) {
  try {
    const { title, content, isPublished, isPrivate } = req.body;
    const userID = req.user.userId;

    console.log('Parsed values:', {
      title,
      content,
      isPublished,
      isPrivate,
      userID,
    });

    if (!title || !content) {
      return res.status(400).json({
        message: 'All fields are required',
      });
    }

    const createPostQuery = `
    INSERT INTO posts (title, content, is_published, is_private, author_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id; 
    `;
    const postValues = [title, content, isPublished, isPrivate, userID];

    const results = await db.query(createPostQuery, postValues);

    if (results.rows[0] && results.rows[0].id) {
      return res.status(201).json({
        message: 'Post created successfully.',
        postId: results.rows[0].id,
        redirect: '/posts',
      });
    } else {
      throw new Error('Failed to create post');
    }
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({
      message: 'An error occured while creating the post.',
    });
  }
}

module.exports = createPost;
