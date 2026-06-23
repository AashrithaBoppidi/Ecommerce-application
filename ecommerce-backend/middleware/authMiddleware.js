// const jwt = require('jsonwebtoken');

// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretkey', {
//     expiresIn: '30d',
//   });
// };

// const protect = async (req, res, next) => {
//   let token;
//   if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//     try {
//       token = req.headers.authorization.split(' ')[1];
//       const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey');
//       const User = require('../models/userModel');
//       req.user = await User.findById(decoded.id).select('-password');
//       next();
//     } catch (error) {
//       res.status(401).json({ message: 'Not authorized, token failed' });
//     }
//   } else {
//     res.status(401).json({ message: 'Not authorized, no token' });
//   }
// };

// const admin = (req, res, next) => {
//   if (req.user && req.user.role === 'ADMIN') {
//     next();
//   } else {
//     res.status(401).json({ message: 'Not authorized as an admin' });
//   }
// };

// module.exports = { generateToken, protect, admin };


const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretkey', {
    expiresIn: '30d',
  });
};

// Protect Routes
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey');

      req.user = await User.findById(decoded.id).select('-password');

      return next(); // ✅ IMPORTANT
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' }); // ✅ return added
    }
  }

  return res.status(401).json({ message: 'Not authorized, no token' }); // ✅ return added
};

// Admin Middleware
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    return next(); // ✅ return added
  }

  return res.status(401).json({ message: 'Not authorized as an admin' });
};

module.exports = { generateToken, protect, admin };