const crypto = require('crypto');

// 데이터 암호화 함수
const encryptData = (data, key) => {
  const iv = crypto.randomBytes(16); // 초기화 벡터 생성
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(JSON.stringify(data), 'utf-8', 'hex');
  encrypted += cipher.final('hex');
  return { encryptedData: encrypted, iv: iv.toString('hex') };
};

module.exports = encryptData;
