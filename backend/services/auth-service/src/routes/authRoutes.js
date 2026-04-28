const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/register', async (request, response) => {
  console.log('[register] body:', JSON.stringify(request.body));
  const { name, email, password, role } = request.body;
  if (!name || !email || !password) {
    console.warn('[register] missing fields');
    return response.status(400).json({ message: 'name, email, and password are required' });
  }

  try {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.warn('[register] email already in use:', email);
      return response.status(409).json({ message: 'Email already in use' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash, role: role || 'student' });
    console.log('[register] user created:', user.email, user.role);
    return response.status(201).json({
      message: 'User created',
      data: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('[register] error:', error.message);
    return response.status(500).json({ message: error.message });
  }
});

router.post('/login', async (request, response) => {
  console.log('[login] attempt for:', request.body?.email);
  const { email, password } = request.body;
  if (!email || !password) {
    console.warn('[login] missing email or password');
    return response.status(400).json({ message: 'email and password are required' });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.warn('[login] user not found:', email);
      return response.status(401).json({ message: 'Invalid credentials' });
    }
    console.log('[login] user found:', user.email, '| role:', user.role, '| has passwordHash:', !!user.passwordHash);

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    console.log('[login] password match:', isMatch);
    if (!isMatch) {
      return response.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET || 'dev_secret',
      { expiresIn: '2h' }
    );

    console.log('[login] success for:', user.email);
    return response.json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('[login] error:', error.message);
    return response.status(500).json({ message: error.message });
  }
});

router.get('/me', requireAuth, async (request, response) => {
  console.log('[me] userId:', request.user?.id);
  try {
    const user = await User.findById(request.user.id).select('-passwordHash');
    if (!user) {
      console.warn('[me] user not found:', request.user.id);
      return response.status(404).json({ message: 'User not found' });
    }
    return response.json({ data: user });
  } catch (error) {
    console.error('[me] error:', error.message);
    return response.status(500).json({ message: error.message });
  }
});

module.exports = router;
