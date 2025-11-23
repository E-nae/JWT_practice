import { Router, Request, Response } from 'express';
import * as bodyParser from 'body-parser';
import axios from 'axios';
import * as requestIp from 'request-ip';
import * as cookieParser from 'cookie-parser';
import authMiddleware from '../middleware/authMiddleware';
import sendDataHandler from '../middleware/sendDataHandler';
import { getFpKey } from '../utils/keyManager';
import generateTUID from '../utils/generateTuid';

// header 함수 타입 정의 (config/header가 없으므로 임시로 정의)
declare function header(method: string, userId: string | null, tuid: string, fp?: string, fpSkey?: string, clientIp?: string): any;

const router = Router();

router.use(requestIp.mw());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(cookieParser());

/****************************** 토큰 로그인 ***************************/

/**************** 토큰 검증 *****************/
router.get('/auth/tk', authMiddleware, sendDataHandler);

/***************** 프로필 조회 **************/
// profileMiddleware가 없으므로 임시로 주석 처리
// router.post('/auth/profile', profileMiddleware);

/**************** 핑거프린트 암호화/복호화 키 전송 */
router.get('/fp/get-sk', async (req: Request, res: Response): Promise<Response> => {
  try {
    const key = await getFpKey();
    return res.send({ ok: true, payload: key });
  } catch (error) {
    console.log('지문 암호화 키 조회 실패: ', error);
    return res.send({
      ok: false,
      message: '지문 암호화 키 조회 실패: ',
      error,
    });
  }
});

/*************** 핑거 프린트 전송 ************/
router.post('/auth/fp', async (req: Request, res: Response): Promise<Response> => {
  try {
    if (!req.headers?.authorization) {
      console.log('유저 지문 없음');
      return res.status(401).send({
        ok: false,
        state: 'fail',
        message: '유저 지문 없음',
      });
    }
    if (!req.body) {
      return res.status(401).send({
        ok: false,
        state: 'fail',
        message: '유저 아이디 없음',
      });
    }

    const userId = req.body.data;
    const fp = req.headers['authorization'];
    /** 핑거프린트(지문) 암호화 키 */
    const fpSkey = await getFpKey();
    const clientIp = req.clientIp;
    const tuid = generateTUID();
    /** api 요청 공통 헤더 */
    const headers = header('POST', userId, tuid, fp, fpSkey || undefined, clientIp);
    const DATA = {
      LANG: 'KR',
      DEBUG: 'N',
      ID: userId,
      FGPR: fp,
      UUIP: clientIp,
      SKEY: fpSkey,
    };
    const API_URL = process.env.SEND_FP;
    if (!API_URL) {
      throw new Error('SEND_FP is not defined');
    }
    const response = await axios.post(`${API_URL}`, DATA, { headers });

    if (response.data.validity !== 'true') {
      return res.status(500).send({ ok: false, message: 'Failed to send FP: ' + response?.data?.error });
    }
    return res.send({ ok: true });
  } catch (error: any) {
    console.log('failed to send FP: ', error.message);
    return res.send({ ok: false, message: error.message });
  }
});

export default router;

