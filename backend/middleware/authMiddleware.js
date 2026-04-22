const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @desc    Protect routes - verify JWT token
// @access  Private
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// @desc    Authorize admin access
// @access  Private/Admin
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin only.' });
  }
};

// @desc    Authorize tutor access
// @access  Private/Tutor
const tutor = (req, res, next) => {
  if (req.user && req.user.role === 'tutor') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Tutor only.' });
  }
};

// @desc    Authorize student access
// @access  Private/Student
const student = (req, res, next) => {
  if (req.user && req.user.role === 'student') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Student only.' });
  }
};

// @desc    Authorize parent access
// @access  Private/Parent
const parent = (req, res, next) => {
  if (req.user && req.user.role === 'parent') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Parent only.' });
  }
};

// Export all middleware functions
module.exports = { protect, admin, tutor, student, parent };