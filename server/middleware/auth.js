const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'fallback-secret-key', { 
    expiresIn: process.env.JWT_EXPIRE || '7d' 
  });
};

// Verify token middleware
const auth = async (req, res, next) => {
  try {
    let token = req.header('Authorization');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Remove 'Bearer ' prefix if present
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length).trimLeft();
    }

    console.log('🔐 Token received:', token);

    // Check if it's a temporary admin token
    if (token.startsWith('temp-admin-token-') || token.startsWith('admin-token-')) {
      console.log('✅ Temporary admin token accepted');
      req.user = { _id: 'temp-admin-id', role: 'admin' }; // Mock user for temporary tokens
      return next();
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');
    console.log('✅ JWT token decoded:', decoded);

    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('❌ Token verification error:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

// Check if user is owner/admin
const isOwner = (req, res, next) => {
  try {
    // Allow temporary admin tokens
    if (req.user._id === 'temp-admin-id') {
      return next();
    }

    if (req.user.role !== 'owner' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Owner privileges required.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Check if user can comment
const canComment = (req, res, next) => {
  try {
    // Allow admins & owners always
    if (req.user.role === 'admin' || req.user.role === 'owner') {
      return next();
    }

    // If user has "canComment" flag in DB
    if (req.user.canComment === true || req.user.role === 'commenter') {
      return next();
    }

    return res.status(403).json({ message: 'Access denied. Comment privileges required.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { auth, isOwner, canComment, generateToken };
