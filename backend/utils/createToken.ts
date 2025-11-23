import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config({ path: '.env.pvk' });

const env = process.env.NODE_ENV || 'development';
const privateKeyPath = path.join(__dirname, '..', 'private.key');
const privateKey = fs.readFileSync(privateKeyPath, 'utf8');

interface TokenPayload {
  userId: string;
  [key: string]: any;
}

/** Access Token 생성 */
export const makeToken = async (obj: TokenPayload): Promise<string> => {
  const token = jwt.sign(obj, privateKey, {
    expiresIn: '1h',
    algorithm: 'RS256',
    // algorithm: 'HS256',
  });
  return token;
};

/** Refresh Token 생성 */
export const makeRefreshToken = async (obj: TokenPayload): Promise<string> => {
  // const refreshToken = jwt.sign({}, privateKey, {
  const refreshToken = jwt.sign(obj, privateKey, {
    // algorithm: 'HS256',
    algorithm: 'RS256',
    expiresIn: '14d',
  });
  return refreshToken;
};

/** Access Token 만료 */
export const expireToken = (obj: any): void => {};
export const expireRefreshToken = (obj: any): void => {};

