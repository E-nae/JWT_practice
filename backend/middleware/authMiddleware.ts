import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';
import * as path from 'path';
import { Request, Response, NextFunction } from 'express';
import { makeToken, makeRefreshToken } from '../utils/createToken';
import { storeKey } from '../utils/keyManager';
import axios from 'axios';
import generateTUID from '../utils/generateTuid';

// header 함수 타입 정의 (config/header가 없으므로 임시로 정의)
declare function header(method: string, userId: string | null, tuid: string, fp?: string, fpSkey?: string, clientIp?: string): any;

dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.pvk' });
const publicKeyPath = path.join(__dirname, '..', 'public.key');
const publicKey = fs.readFileSync(publicKeyPath, 'utf8');

/****************************** 토큰 유효성 검사 미들 웨어 ***************************/

interface DecodedToken {
  userId: string;
  exp?: number;
  [key: string]: any;
}

/** 리프레시 토큰의 유효기간이 임박한 경우 자동 재발급(액세스 토큰의 유효기간보다 짧은 경우) */
const autoIssueRefTk = async (
  exp_Ac_Tk: number | undefined,
  exp_Ref_Tk: number | undefined,
  userId: string,
  tuid: string
): Promise<string | null> => {
  if (exp_Ac_Tk && exp_Ref_Tk && exp_Ac_Tk > exp_Ref_Tk) {
    try {
      const TK_REF = await makeRefreshToken({ userId }); // refresh token 생성
      /** api 요청(리프레시 토큰 DB 저장) */

      const headers = header('POST', userId, tuid);
      const data = {
        LANG: 'KR',
        VIEW: 'Y',
        METHOD: 'POST',
        ID: userId,
        TOKEN: TK_REF,
        TUID: tuid,
      };
      const API_URL = process.env.TOKEN_SAVE_API;
      if (!API_URL) {
        throw new Error('TOKEN_SAVE_API is not defined');
      }
      const saveRes = await axios.post(`${API_URL}`, data, { headers });
      if (saveRes?.data.validity === 'true') {
        /** 암호화/복호화 키 redis 저장 */
        await storeKey(userId);

        return TK_REF;
      } else {
        throw new Error(
          'An error occured during the process of saving the token to the DB ' +
          saveRes?.data.error
        );
      }
    } catch (error) {
      /** 리프레시 토큰 DB 저장 실패 */
      console.log(
        'aTk verify: An error occured during the process of reissuing a refresh token and saving the token to the DB: ',
        error
      );
      return null;
    }
  }
  return null;
};

/********************* 토큰 유효성 검사 **************************/
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  const TK_ACC = req.cookies?.OASID$;
  const TK_REF = req.cookies?.OASID_;
  const tuid = generateTUID();
  req.tuid = tuid;

  if (!req.cookies) {
    // Access 토큰과 Refresh 토큰이 모두 없는 경우
    return res.send({
      ok: false,
      state: 'fail',
      message: '토큰 검증 실패: 다시 로그인해주세요',
    });
  }
  /** 다른 기기에서 로그인하여 DB와 토큰이 다르거나, 오류로 리프레시 토큰이 정상이 아닌 경우 */
  if (!TK_REF || TK_REF === 'undefined') {
    return res.send({
      ok: false,
      state: 'fail',
      message: '토큰 검증 실패: 다시 로그인해주세요',
    });
  }

  /********** 액세스 토큰 유효성 검사 **********/
  if (TK_ACC) {
    try {
      req.ref_TK = null;
      const decoded = jwt.verify(TK_ACC, publicKey) as DecodedToken;
      console.log('Two access token match');
      /** 다음 미들웨어에 아이디 전달 */
      req.userId = decoded.userId;

      const decoded_Ref = jwt.decode(TK_REF) as DecodedToken | null;
      /** 곧 만료되는 리프레시 토큰 업데이트 */
      const ref_TK = await autoIssueRefTk(
        decoded?.exp,
        decoded_Ref?.exp,
        decoded?.userId,
        tuid
      );
      req.ref_TK = ref_TK;
      console.log('***************액세스 토큰 검증 성공**************');

      /** 토큰 검사 종료, 다음 미들웨어 실행 */
      next();
    } catch (error) {
      console.log('Access token is invalid: ', error);
    }
  }

  /************ 리프레시 토큰 유효성 검사(액세스 토큰이 없거나 만료된 경우) */
  if (!TK_ACC && TK_REF) {
    try {
      req.acc_Tk = null;
      req.ref_TK = null;
      /** api 요청(이용자 아이디 조회) */
      const headers = header('GET', null, tuid);
      const data = {
        LANG: 'KR',
        VIEW: 'N',
        METHOD: 'GET',
        TOKEN: TK_REF,
        TUID: tuid,
      };
      const API_URL = process.env.GET_ID_API;
      if (!API_URL) {
        throw new Error('GET_ID_API is not defined');
      }
      const response = await axios.post(`${API_URL}`, data, { headers });
      console.log(`리프레시토큰_아이디조회: `);
      console.log(response.data);
      if (response?.data?.validity !== 'true') {
        return res.send({
          ok: false,
          state: 'fail',
          message: '토큰 검증 실패: 다시 로그인해주세요',
        });
      }
      const userId = response.data.data.DATA.ID;
      const decoded_ref = jwt.verify(TK_REF, publicKey) as DecodedToken;

      if (!userId || userId !== decoded_ref.userId) {
        console.log('리프레시 토큰 정보 불일치');

        return res.send({
          ok: false,
          state: 'fail',
          message: '토큰 검증 실패: 다시 로그인해주세요',
        });
      }

      /** 다음 미들웨어에 아이디 전달 */
      req.userId = decoded_ref.userId;

      /** 액세스 토큰 재발급 */
      const new_TK_ACC = await makeToken({ userId });
      const decodedAcc = jwt.decode(new_TK_ACC) as DecodedToken | null;

      console.log('***************액세스 토큰 재발급 성공**************');

      /** 곧 만료되는 리프레시 토큰 업데이트 */
      const ref_TK = await autoIssueRefTk(
        decodedAcc?.exp,
        decoded_ref.exp,
        decoded_ref.userId,
        tuid
      );

      req.acc_Tk = new_TK_ACC;
      req.ref_TK = ref_TK;

      next();
    } catch (error: any) {
      console.log('Refresh token is invalid');
      return next(new Error('토큰 검증 실패: ' + error.message));
    }
  }
};

export default authMiddleware;

