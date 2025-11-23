const router = require('express').Router();
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const reissueTk = require('../../util/reIssueTk');
const accountMiddleware = require('../../middleware/getAccountMw');
// const cron = require('node-cron');
const { getKey } = require('../../util/keyManager');

dotenv.config();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(cookieParser());

/************************ My Account(마이페이지) 이용자 정보 조회 라우터 **************************/
router.get('/account/detail', accountMiddleware);

/**************** 유저 정보 암호화/복호화 키 전송 */
router.get('/get-sk', async (req, res) => {
  const TK_ACC = req.cookies.OASID$;
  const TK_REF = req.cookies.OASID_;
  try {
    if (!req.cookies) {
      // Access 토큰과 Refresh 토큰이 모두 없는 경우
      // return res.status(401).json({ message: '인증 필요' });
      // return res.status(401).send({
      //   ok: false,
      //   state: 'fail',
      //   message: '토큰 검증 실패: 다시 로그인해주세요',
      // });
      return res.send({
        ok: false,
        state: 'fail',
        message: '토큰 검증 실패: 다시 로그인해주세요',
      });
    }
    /** 다른 기기에서 로그인하여 DB와 토큰이 다르거나, 오류로 리프레시 토큰이 정상이 아닌 경우 */
    if (!TK_REF || TK_REF === 'undefined') {
      // return res.status(401).send({
      //   ok: false,
      //   state: 'fail',
      //   message: '토큰 검증 실패: 다시 로그인해주세요',
      // });
      return res.send({
        ok: false,
        state: 'fail',
        message: '토큰 검증 실패: 다시 로그인해주세요',
      });
    }

    /** 액세스 토큰이 있는 경우 */
    if (TK_ACC) {
      try {
        const decoded = jwt.decode(TK_ACC); // 액세스 키 디코딩
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
      const { U_ID, newACC_TK } = await reissueTk(TK_REF); // 액세스토큰 재발급
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
  } catch (error) {
    console.info('failed to get crypto key from redis', error);
    return res.send({
      ok: false,
      message: '키 조회 실패',
    });
  }
});

module.exports = router;

// redis-cli
// set encryptionKey "!@#ofuScrkey$#&"
// expire encryptionKey 604800
// get encryptionKey

// client.set('myKey', 'myValue', (err, reply) => {
//     console.log(reply); // OK
// });
// client.get('myKey', (err, reply) => {
//     console.log(reply); // myValue
// });
// Schedule task to run every week
// cron.schedule('0 0 * * 0', () => {
//     storeKey().then(() => {
//         console.log('Encryption key has been regenerated and stored in Redis.');
//     }).catch(err => {
//         console.error('Error regenerating encryption key:', err);
//     });
// });

// /** 이용자의 부서 정보만 추출 */
// const department = responses[1]?.data?.data?.DATA.find((item) => item.ID === mainData.DEP);
// /** 이용자의 DUTY 정보만 추출 */
// const duty = responses[2]?.data?.data?.DATA.find(
//   (item) => item.ID === mainData.DUTY
// );
// /** 이용자의 POSITION 정보만 추출 */
// const position = responses[3]?.data?.data?.DATA.find(
//   (item) => item.ID === mainData.POSITION
// );
// /** 이용자의 지사정보만 추출 */
// const branchOffice = responses[4]?.data?.data?.DATA.find(
//   (item) => item.CODE === mainData.AGC_CD
// );
// /** 메인 정보와 통합 */
// mainData.DEP = department;
// mainData.DUTY = duty;
// mainData.POSITION = position;
// mainData.AGC_CD = branchOffice;
