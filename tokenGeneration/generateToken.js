const jwt = require("jsonwebtoken");

require("dotenv").config();

module.exports.createSecretToken = (user) => {
  const { _id, role } = user; // Assuming your user model has a 'role' field

  return jwt.sign({ userId: _id, role }, process.env.TOKEN_KEY, {
    expiresIn: 60 * 60, // 1 hour expiration
  });
};

module.exports.createRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.REFRESH_TOKEN_KEY, { expiresIn: '7d' });
};
