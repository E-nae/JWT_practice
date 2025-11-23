import * as crypto from 'crypto';

// 데이터 암호화 함수
export const encryptData = (data: any, key: Buffer): { encryptedData: string; iv: string } => {
  const iv = crypto.randomBytes(16); // 초기화 벡터 생성
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(JSON.stringify(data), 'utf-8', 'hex');
  encrypted += cipher.final('hex');
  return { encryptedData: encrypted, iv: iv.toString('hex') };
};

