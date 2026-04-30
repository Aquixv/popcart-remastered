const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.API_SECRET, {
    expiresIn: '2d',
  });
};

module.exports = generateToken;