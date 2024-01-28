// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) 
    {console.log(err)
      return res.status(403).json({ message: 'Forbidden' })};
  
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };
