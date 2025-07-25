const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided, access denied' });
    }
    
    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Handle both regular users and admin
    if (decoded.id === 'admin') {
      req.userId = 'admin';
      req.userRole = 'admin';
    } else {
      req.userId = decoded.id;
    }
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token, access denied' });
  }
};

module.exports = auth;