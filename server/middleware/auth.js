const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findByPk(decoded.id);
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token invalid' });
  }
};

// Only admin
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Admin access required' });
  }
};

// Only police
const policeOnly = (req, res, next) => {
  if (req.user && req.user.role === 'police') {
    next();
  } else {
    return res.status(403).json({ message: 'Police access required' });
  }
};

// Police or admin
const policeOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'police' || req.user.role === 'admin')) {
    next();
  } else {
    return res.status(403).json({ message: 'Police or Admin access required' });
  }
};

module.exports = { protect, adminOnly, policeOnly, policeOrAdmin };
