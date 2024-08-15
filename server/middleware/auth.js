const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: 'No token. Authorization denied.',
      authRequired: true,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.clearCookie('token');
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      if (error instanceof jwt.TokenExpiredError) {
        res.clearCookie('token'); // clear expired cookies
        return res.status(401).json({
          message: 'Your session has expired. Please login again.',
          authRequired: true,
        });
      }
    }

    res.status(401).json({
      message: 'Token is not valid. Please log in again.',
      authRequired: true,
    });
  }
};

module.exports = authMiddleware;
