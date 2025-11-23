import * as jwt from 'jsonwebtoken';
import { makeToken } from './createToken';
import * as fs from 'fs';
import * as path from 'path';

const publicKeyPath = path.join(__dirname, '..', 'public.key');
const publicKey = fs.readFileSync(publicKeyPath, 'utf8');

interface DecodedToken {
  userId: string;
  [key: string]: any;
}

interface ReissueResult {
  U_ID: string;
  newACC_TK: string;
}

/** 액세스 토큰이 없는 경우 리프레시 토큰 검증 후 재발급 */
export const reissueTk = async (refTK: string): Promise<ReissueResult | null> => {
  try {
    let U_ID: string | null = null;
    const decoded = jwt.verify(refTK, publicKey) as DecodedToken;
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

export default reissueTk;

