const jwt = require('jsonwebtoken');

function requireAuth(request, response, next) {
  const header = request.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return response.status(401).json({ message: 'Missing or invalid auth token' });
  }

  const token = header.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    request.user = payload;
    return next();
  } catch (error) {
    return response.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = { requireAuth };
