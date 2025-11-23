const jwt = require('jsonwebtoken');
const { makeToken } = require('../util/createToken');
const fs = require('fs');
const path = require('path');
const publicKeyPath = path.join(__dirname, '..', 'public.key');
const publicKey = fs.readFileSync(publicKeyPath, 'utf8');

/** 액세스 토큰이 없는 경우 리프레시 토큰 검증 후 재발급 */
const reissueTk = async (refTK) => {
  try {
    let U_ID = null;
    const decoded = jwt.verify(refTK, publicKey);
    U_ID = decoded.userId;
    const newACC_TK = await makeToken({ userId: U_ID }); // 액세스 토큰 재발급
    return { U_ID, newACC_TK };
  } catch (error) {
    console.log(
      'Failed to verify the refresh token and re-issue an access token: ',
      error
    );
    return null;
  }
};

module.exports = reissueTk;

