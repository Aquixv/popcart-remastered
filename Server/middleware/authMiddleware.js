const jwt = require('jsonwebtoken');
const User = require('../models/Schema');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      const decoded = jwt.verify(token, process.env.API_SECRET);

      req.user = await User.findById(decoded.id).select('-password');

      return next(); 

    } catch (error) {
      console.error("BOUNCER ERROR:", error.message); 
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
   return res.status(401).json({ message: 'Not authorized, no token' });
  }
};
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next(); 
  } else {
    res.status(403).json({ message: "Access denied. Admin only." });
  }
};
const isSeller = (req, res, next) => {
  if (req.user && (req.user.role === 'seller' || req.user.role === 'admin')) {
    next(); 
  } else {
    res.status(403).json({ message: "Access denied. Seller only." });
  }
};

module.exports = { protect, isAdmin, isSeller };