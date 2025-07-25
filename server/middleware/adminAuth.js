const jwt = require('jsonwebtoken');

const adminAuth = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided, admin access denied' });
    }
    
    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if the token belongs to admin
    if (decoded.id !== 'admin' || decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
    
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token, admin access denied' });
  }
};

module.exports = adminAuth;
