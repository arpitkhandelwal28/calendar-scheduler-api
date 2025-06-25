const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes and attach user to req.user
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: '❌ No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: '❌ User not found' });
    }

    req.user = user; // ✅ This allows you to use req.user.email later
    next();
  } catch (err) {
    console.error('❌ JWT Error:', err.message);
    return res.status(401).json({ message: '❌ Invalid or expired token' });
  }
};

module.exports = { protect };
