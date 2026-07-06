const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error();
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded._id, isActive: true })
      .select('-password');
    
    if (!user) {
      throw new Error();
    }
    
    req.token = token;
    req.user = user;
    req.userId = user._id;
    
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate' });
  }
};

// Admin authorization
const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      console.log('No token provided for admin auth');
      throw new Error();
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ 
      _id: decoded._id, 
      role: 'admin',
      isActive: true 
    }).select('-password');
    
    if (!user) {
      console.log(`Admin auth failed: User ${decoded._id} is not an admin or inactive`);
      throw new Error();
    }
    
    console.log(`Admin auth successful for user: ${user.email} (${user.name})`);
    
    req.token = token;
    req.user = user;
    req.userId = user._id;
    req.isAdmin = true;
    
    next();
  } catch (error) {
    console.error('Admin auth error:', error.message);
    res.status(403).json({ error: 'Admin access required' });
  }
};

// Optional auth (for public routes that may have authenticated users)
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findOne({ _id: decoded._id, isActive: true })
        .select('-password');
      
      if (user) {
        req.user = user;
        req.userId = user._id;
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { _id: userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Verify email token
const verifyEmailToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
};

module.exports = {
  auth,
  adminAuth,
  optionalAuth,
  generateToken,
  verifyEmailToken
};
