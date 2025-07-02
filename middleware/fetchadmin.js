const jwt = require('jsonwebtoken');
const JWT_SECRET = 'ashar.2day@karachi';

const fetchAdmin = (req, res, next) => {
  const token = req.header('auth-token');
  if (!token) {
    return res.status(401).json({ error: "No auth token, access denied" });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token, access denied" });
  }
};

module.exports = fetchAdmin;