const jwt = require('jsonwebtoken');

function requireAuth(request, response, next) {
  const header = request.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return response.status(401).json({ message: 'Missing or invalid auth token' });
  }

  const token = header.replace('Bearer ', '');
  try {
    request.user = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    return next();
  } catch (error) {
    return response.status(401).json({ message: 'Invalid token' });
  }
}

function requireAdmin(request, response, next) {
  if (request.user?.role !== 'admin') {
    return response.status(403).json({ message: 'Admin access required' });
  }
  return next();
}

module.exports = { requireAuth, requireAdmin };
