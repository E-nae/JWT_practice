import { Router, Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';
import { makeToken } from '../../utils/createToken';
// const { tokenVerify, refreshVerify } = require('../../util/verifyToken');
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import axios from 'axios';

const router = Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(cookieParser());
const privateKey = fs.readFileSync('private.key', 'utf8');

// verifyToken 유틸리티가 없으므로 임시로 타입 정의
interface VerifyResult {
  state: boolean;
}

declare function tokenVerify(token: string): Promise<VerifyResult>;
declare function refreshVerify(refreshToken: string, userId: string): Promise<boolean>;

router.post('/token', async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const token = req.cookies?.OASID$;
    const refreshToken = req.cookies?.OASID_;

    /** 브라우저 쿠키에 access token과 refresh token이 모두 있을 때 */
    if (token && refreshToken) {

      return res.status(200).send({ ok: true, state: 'pass' });
    } else {
      // 브라우저 쿠키에 access token 또는 refresh token이 없을 때
      return res.send({
        ok: false,
        state: 'fail',
        message: '토큰 또는 리프레시 토큰이 필요합니다. 다시 로그인 해주세요',
      });
    }
  } catch (error) {
    console.log(`failed to verify token: `, error);
    return res
      .status(500)
      .send({ ok: false, state: 'fail', message: '시스템 에러' });
  }
});

router.post('/token/kakao', async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const ACCESS_TOKEN = req.cookies?.OASID$;
    if (!ACCESS_TOKEN) {
      return res.status(401).send({ ok: false, message: 'Token is missing' });
    }
    const verifyRes = await axios.get(
      'https://kapi.kakao.com/v1/user/access_token_info',
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      }
    );

    return res.status(200).send({ ok: true, message: 'Token is valid' });
  } catch (error) {
    console.log(`failed to verify kakao token: `, error);
    return res.status(401).send({ ok: false, message: 'Token is invalid' });
  }
});

router.post('/token/google', async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    if (!req.body) {
      console.log('uid값 없음');
      return res
        .status(401)
        .send({ ok: false, state: 'fail', message: 'uid값' });
    }
    const UID = req.body.uid;

    console.log(`UID`);
    console.log(UID);

    /** api 요청 */
    const headers = {
      Authorization: process.env.HEADERS_AUTH,
      'Content-Type': 'application/json',
      Code: process.env.HEADERS_CODE,
      Ver: process.env.HEADERS_VER,
      Method: process.env.HEADERS_METHOD,
    };
    const data = {
      LANG: 'KR',
      VIEW: 0,
      METHOD: 'GET',
      ID: UID,
      TUID: '',
    };
    const API_URL = process.env.LOGIN_API;
    if (!API_URL) {
      throw new Error('LOGIN_API is not defined');
    }
    const response = await axios.post(`${API_URL}`, data, { headers });

    console.log('response.data: ');
    console.log(response.data);

    if (!response || response.data.length === 0) {
      console.log('GUID에 해당하는 이용자 없음');
      return res
        .status(200)
        .send({ ok: false, message: '해당하는 이용자 없음' });
    }

    return res
      .status(200)
      .send({ ok: true, message: 'Token is valid', payload: response.data });
  } catch (error) {
    console.log(`failed to verify google token: `, error);
    return res
      .status(500)
      .send({ ok: false, state: 'fail', message: '시스템 에러' });
  }
});

export default router;

