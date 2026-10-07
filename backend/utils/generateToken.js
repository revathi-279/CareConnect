const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  // Sign the token with the user ID, secret key, and expiration time
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

module.exports = generateToken;