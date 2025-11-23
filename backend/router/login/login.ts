import { Router, Request, Response } from 'express';
import * as dotenv from 'dotenv';
import * as bodyParser from 'body-parser';
import axios from 'axios';
import * as cookieParser from 'cookie-parser';
import { makeToken, makeRefreshToken } from '../../utils/createToken';
import generateTUID from '../../utils/generateTuid';
import { storeKey, delKey } from '../../utils/keyManager';

// header 함수 타입 정의 (config/header가 없으므로 임시로 정의)
declare function header(method: string, userId: string | null, tuid: string): any;

dotenv.config({ path: '.env' });

const router = Router();

router.use(cookieParser());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

interface LoginInfo {
  id: string;
  password: string;
}

/****************************** 아아디/비밀번호 로그인 ***************************/

router.post('/submit', async (req: Request, res: Response): Promise<Response> => {
  const loginInfo: LoginInfo = req.body;
  const givenID = loginInfo.id;
  const givenPwd = loginInfo.password;

  try {
    if (!loginInfo) {
      console.log('아이디 & 비밀번호 입력값 없음');
      return res.status(401).send({
        ok: false,
        state: 'fail',
        message: '아이디와 비밀번호를 입력해주세요',
      });
    }

    const tuid1 = generateTUID();

    /** api 요청(아이디/비밀번호 로그인) */
    const getProfile = async () => {
      try {
        const headers = header(process.env.HEADERS_METHOD || 'POST', givenID, tuid1);
        const pf_data = {
          // 프로필
          LANG: 'KR',
          VIEW: 0,
          METHOD: 'GET',
          ID: givenID,
          PW: givenPwd,
          TuId: '',
        };
        const pos_data = {
          // 부서,직급,직책
          LANG: 'KR',
          VIEW: 'N',
          CATE: 'POSITION',
          DATA: null,
          TuId: tuid1,
        };
        const API_URL = process.env.LOGIN_API;
        const API_URL2 = process.env.USER_STATUS_API;
        if (!API_URL || !API_URL2) {
          throw new Error('API URLs are not defined');
        }
        const [profileRes, posRes] = await Promise.all([
          await axios.post(`${API_URL}`, pf_data, { headers }),
          await axios.post(`${API_URL2}`, pos_data, { headers }),
        ]);
        const position = posRes?.data?.data?.DATA.find(
          (pos: any) => pos.ID === profileRes?.data?.data?.DATA?.POSITION
        );
        console.log(`profileRes.data.data: `);
        console.log(profileRes.data.data);
        profileRes.data.data.DATA.POSITION = position;
        // console.log(profileRes.data.data.DATA);
        return profileRes;
      } catch (error) {
        console.log('Failed to get Profile and Department data: ', error);
        return null;
      }
    };

    const responses = await getProfile();

    // console.log(results);
    if (responses?.data?.validity !== 'true') {
      /** 기존 유저DB에 일치하는 이용자가 없으면 */
      console.log('failed to find user: ');
      console.log(responses?.data);
      // console.log(`에러 코드 ${response.data.data.ERROR.code}: `, response.data.data.ERROR.message);
      return res.send({
        ok: false,
        state: 'fail',
        message: '회원 정보를 찾을 수 없습니다.',
      }); // 로그인 불가 전송
    }
    /** 유저DB에 일치하는 이용자가 있으면 */
    const STATUS = responses.data.data.DATA.STATUS;
    const position = responses.data.data.DATA.POSITION;

    /** position 코드가 0 (관리자 승인 대기 상태)인 경우 로그인 차단*/
    if (STATUS === 'NEW') {
      return res.send({
        ok: false,
        state: 'pending',
        message: '승인 대기',
        position: position,
      });
    }

    /** position 코드가 -1 (퇴사 상태)인 경우 로그인 차단 */
    if (STATUS === 'RESIGNATION') {
      return res.send({
        ok: false,
        state: 'resignation',
        message: '퇴사 상태',
        position: position,
      });
    }

    const TK_ACC = await makeToken({ userId: givenID }); // access token 생성
    const TK_REF = await makeRefreshToken({ userId: givenID }); // refresh token 생성
    console.log(`refreshToken: `);
    console.log(TK_REF);
    //req.session.uid = givenID;

    /** api 요청(리프레시 토큰 DB 저장) */
    console.log('tuid: ', generateTUID());
    const tuid2 = generateTUID();
    const headers = header('POST', givenID, tuid2);
    const data = {
      LANG: 'KR',
      VIEW: 'Y',
      METHOD: 'POST',
      ID: givenID,
      TOKEN: TK_REF,
      TUID: tuid2,
    };
    const API_URL = process.env.TOKEN_SAVE_API;
    if (!API_URL) {
      throw new Error('TOKEN_SAVE_API is not defined');
    }
    const saveRes = await axios.post(`${API_URL}`, data, { headers });

    if (saveRes?.data?.validity !== 'true') {
      /** 리프레시 토큰 DB 저장 실패 */
      console.log('failed to save token in DB: ', saveRes.data.error);
      return res.send({
        ok: false,
        state: 'Retry logging in',
        message: '시스템 에러-DB api 에러',
      });
    }
    console.log(`tokens: `);
    console.log(process.env.CURRENT_ENV);
    try {
      /** 암호화/복호화 키 저장 */
      await storeKey(givenID);
      /** 클라이언트로 쿠키 전송*/
      // res.setHeader('Set-Cookie', `connect.id=${privateKey}; path=/`);//시크릿키 쿠키에 저장
      const oneHourInMilliseconds = 1 * 60 * 60 * 1000; // 1시간
      const twoWeeksInMilliseconds = 14 * 24 * 60 * 60 * 1000; // 14일
      res.cookie('OASID$', TK_ACC, {
        httpOnly: true, // 자바스크립트로 읽기 방지, 클라이언트에서 자동으로 헤더에 추가 전송
        maxAge: oneHourInMilliseconds,
        // secure: req.app.get('env') === 'production' ? false : true,
        secure: process.env.CURRENT_ENV === 'production' ? true : false,
      });
      res.cookie('OASID_', TK_REF, {
        httpOnly: true, // 자바스크립트로 읽기 방지
        maxAge: twoWeeksInMilliseconds,
        // expires: new Date(Date.now() + twoWeeksInMilliseconds),
        secure: process.env.CURRENT_ENV === 'production' ? true : false,
      });
      return res.send({
        ok: true,
        state: 'pass',
        message: '로그인 성공',
        method: 'pw',
        payload: responses.data.data.DATA,
      });
    } catch (error) {
      console.log('failed to save cookie: ', error);
      return res.send({ ok: false, state: 'fail', message: '쿠키 저장 실패 ' });
    }
  } catch (error) {
    console.log('Failed to run login work: ', error);
    return res
      .status(500)
      .send({ ok: false, state: 'fail', message: '시스템 에러' });
  }
});

/** 로그아웃 시 */
router.post('/logout', async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const id = req.body.id;
    /** 암호화/복호화 키 삭제 */
    if (id) await delKey(id);

    // 클라이언트로부터 disconnected 메세지를 받은 상태에서 쿠키가 저장되어 있으면(req.headers.cookie
    res.clearCookie('OASID$', {
      httpOnly: true,
      secure: req.app.get('env') === 'production' ? false : true,
    });
    res.clearCookie('OASID_', {
      httpOnly: true,
      secure: req.app.get('env') === 'production' ? false : true,
    });

    // console.log(`req.cookies: `);
    // console.log(req.cookies);
    // console.log(req.headers.cookie);
    if (process.env.NODE_ENV === 'production') res.redirect('/login');
    if (process.env.NODE_ENV === 'development') return res.send({ ok: true });
  } catch (error) {
    console.log(`failed to logout: `, error);
    return res
      .status(500)
      .send({ ok: false, state: 'fail', message: '시스템 에러' });
  }
});

router.get('/pending', (req: Request, res: Response): Response => {
  return res.send('waiting area for new users');
});

export default router;

