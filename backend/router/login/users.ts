import { Router, Request, Response } from 'express';
import * as dotenv from 'dotenv';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as jwt from 'jsonwebtoken';
import reissueTk from '../../utils/reIssueTk';
// const accountMiddleware = require('../../middleware/getAccountMw');
import { getKey } from '../../utils/keyManager';

dotenv.config();
const router = Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(cookieParser());

/************************ My Account(마이페이지) 이용자 정보 조회 라우터 **************************/

/**************** 유저 정보 암호화/복호화 키 전송 */
router.get('/get-sk', async (req: Request, res: Response): Promise<Response> => {
  const TK_ACC = req.cookies?.OASID$;
  const TK_REF = req.cookies?.OASID_;
  try {
    if (!req.cookies) {
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

    /** 액세스 토큰이 있는 경우 */
    if (TK_ACC) {
      try {
        const decoded = jwt.decode(TK_ACC) as { userId: string } | null; // 액세스 키 디코딩
        if (!decoded) {
          throw new Error('Failed to decode access token');
        }
        /** 암호화/복호화 키 조회 */
        const Skey = await getKey(decoded.userId); //키 조회
        console.log('Skey_acc: ', Skey);
        return res.send({
          //키 전송
          ok: true,
          payload: Skey,
        });
      } catch (error) {
        console.log('액세스 토큰 디코딩 실패: ', error);
      }
    }
    if (TK_REF) {
      /** 액세스 토큰이 없는 경우 리프레시 토큰 검증 후 재발급 */
      const result = await reissueTk(TK_REF); // 액세스토큰 재발급
      if (!result) {
        return res.send({
          ok: false,
          state: 'fail',
          message: '토큰 검증 실패: 다시 로그인해주세요',
        });
      }
      const { U_ID, newACC_TK } = result;
      const Skey = await getKey(U_ID); //키 조회
      console.log('Skey_ref: ', Skey);

      const oneHourInMilliseconds = 1 * 60 * 60 * 1000; // 1시간
      res.cookie('OASID$', newACC_TK, {
        // 쿠키 저장
        httpOnly: true,
        maxAge: oneHourInMilliseconds,
        secure: req.app.get('env') === 'production' ? false : true,
      });

      return res.send({
        //키 전송
        ok: true,
        payload: Skey,
      });
    }
    return res.send({
      ok: false,
      state: 'fail',
      message: '토큰이 없습니다.',
    });
  } catch (error) {
    console.info('failed to get crypto key from redis', error);
    return res.send({
      ok: false,
      message: '키 조회 실패',
    });
  }
});

export default router;

