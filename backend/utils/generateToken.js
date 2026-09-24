const jwt = require('jsonwebtoken');

const generateTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });

  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie('token', token, {
    httpOnly: true,
    secure: isProduction, // Required for sameSite: 'none'
    sameSite: isProduction ? 'none' : 'lax', // 'none' allows cross-domain cookies (Vercel -> Render)
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  return token;
};

module.exports = generateTokenAndSetCookie;