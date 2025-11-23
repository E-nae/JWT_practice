const router = require('express').Router();
let jwt = require('jsonwebtoken');
const fs = require('fs');
const { makeToken } = require('../../util/createToken');
const { tokenVerify, refreshVerify } = require('../../util/verifyToken');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const axios = require('axios');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(cookieParser());
const privateKey = fs.readFileSync('private.key', 'utf8');

router.post('/token', async (req, res, next) => {
  try {
    // console.log('refreshToken: ', refreshToken);
    const token = req.cookies.OASID$;
    const refreshToken = req.cookies.OASID_;

    /** 브라우저 쿠키에 access token과 refresh token이 모두 있을 때 */
    if (token && refreshToken) {

      const verifyResult = await tokenVerify(token);
      const decodedInfo = jwt.decode(token);
      const refreshResult = await refreshVerify(
        refreshToken,
        decodedInfo.userId
      );
      console.log('verifyResult.state1: ');
      console.log(verifyResult.state);
      console.log('refreshResult: ');
      console.log(refreshResult);

      /** access token과 refresh token이 모두 유효하면 pass*/
      if (verifyResult.state && refreshResult) {
        res.status(200).send({ ok: true, state: 'pass' });
      } else if (!verifyResult.state && refreshResult) {
      /** refresh token은 유효하지만 access token이 유효하지 않으면 access token 새로 발급 */
        const newAccessToken = makeToken({ userId: decodedInfo.userId });
        console.log('new access token is created');

        const twoWeeksInMilliseconds = 14 * 24 * 60 * 60 * 1000; // 14일
        res.cookie('OASID$', newAccessToken, {
          httpOnly: true, // 자바스크립트로 읽기 방지, 클라이언트에서 자동으로 헤더에 추가 전송
          maxAge: twoWeeksInMilliseconds,
          // expires: new Date(Date.now() + twoWeeksInMilliseconds),
          secure: req.app.get('env') === 'production' ? false : true,
        });

        res.status(200).send({ ok: true, state: 'pass' });
      } else if (!refreshResult) {
      /** 둘다 유효하지 않으면 재로그인 요청 */
        res.status(401).send({
          ok: false,
          state: 'fail',
          message: '인증 만료: 다시 로그인해주세요',
        });
      }
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

router.post('/token/kakao', async (req, res, next) => {
  try {
    const ACCESS_TOKEN = req.cookies.OASID$;
    const verifyRes = await axios.get(
      'https://kapi.kakao.com/v1/user/access_token_info',
      {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      }
    );

    res.status(200).send({ ok: true, message: 'Token is valid' });
  } catch (error) {
    console.log(`failed to verify kakao token: `, error);
  }
});

router.post('/token/google', async (req, res, next) => {
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
    const response = await axios.post(`${API_URL}`, data, { headers });

    console.log('response.data: ');
    console.log(response.data);

    if (!response || response.length === 0) {
      console.log('GUID에 해당하는 이용자 없음');
      return res
        .status(200)
        .send({ ok: false, message: '해당하는 이용자 없음' });
    }

    return res
      .status(200)
      .send({ ok: true, message: 'Token is valid', payload: results });
  } catch (error) {
    console.log(`failed to verify kakao token: `, error);
    return res
      .status(500)
      .send({ ok: false, state: 'fail', message: '시스템 에러' });
  }
});

module.exports = router;
