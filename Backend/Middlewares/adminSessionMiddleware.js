const jwt = require('jsonwebtoken');
require('dotenv').config();

const adminSessionMiddleware = (req, res, next) => {
  if (req.path === '/admin-signin') {
    return next();
  }

  const sessionToken = req.cookies.access_token;

  if (!sessionToken) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized - Admin session or token not found.",
      statusCode: 401,
    });
  }

  try {
    jwt.verify(sessionToken, process.env.JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized - Invalid token.",
      statusCode: 401,
    });
  }
};

module.exports = adminSessionMiddleware;
