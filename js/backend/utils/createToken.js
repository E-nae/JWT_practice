let jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.pvk' });
const fs = require('fs');
const path = require('path');

const env = process.env.NODE_ENV || 'development';
const privateKeyPath = path.join(__dirname, '..', 'private.key');
const privateKey = fs.readFileSync(privateKeyPath, 'utf8');

/** Access Token 생성 */
const makeToken = async (obj) => {
  const token = jwt.sign(obj, privateKey, {
    expiresIn: '1h',
    algorithm: 'RS256',
    // algorithm: 'HS256',
  });
  return token;
};

/** Refresh Token 생성 */
const makeRefreshToken = async (obj) => {
  // const refreshToken = jwt.sign({}, privateKey, {
  const refreshToken = jwt.sign(obj, privateKey, {
    // algorithm: 'HS256',
    algorithm: 'RS256',
    expiresIn: '14d',
  });
  return refreshToken;
};

/** Access Token 만료 */
const expireToken = (obj) => {};
const expireRefreshToken = (obj) => {};

module.exports = { makeToken, makeRefreshToken };
