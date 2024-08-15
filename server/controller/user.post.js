const db = require('../db');

async function getPosts(userId) {
  try {
    const combinedQuery = `
      SELECT *,
             CASE WHEN author_id = $1 THEN true ELSE false END AS is_user_post
      FROM posts
      WHERE (author_id = $1 AND is_published = true)
         OR (is_private = false AND is_published = true)
      ORDER BY created_at DESC
    `;

    const results = await db.query(combinedQuery, [userId]);

    const userPosts = [];
    const publicPosts = [];

    results.rows.forEach((post) => {
      if (post.is_user_post) {
        userPosts.push(post);
      }
      if (!post.is_private) {
        publicPosts.push(post);
      }
    });

    return {
      userPosts,
      publicPosts,
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
}

module.exports = getPosts;
