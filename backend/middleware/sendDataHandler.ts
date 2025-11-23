import { Request, Response } from 'express';

/****************************** 쿠키 전송 또는 에러 전송 미들웨어 ***************************/

export const sendDataHandler = (req: Request, res: Response): Response => {
  try {
    /** 클라이언트로 쿠키 전송*/
    if (req.acc_Tk) {
      // const oneHourInMilliseconds = 1 * 60 * 60 * 1000; // 1시간
      const oneHourInMilliseconds = 5 * 60 * 1000; // 5분
      res.cookie('OASID$', req.acc_Tk, {
        httpOnly: true, // 자바스크립트로 읽기 방지, 클라이언트에서 자동으로 헤더에 추가 전송
        maxAge: oneHourInMilliseconds,
        secure: process.env.CURRENT_ENV === 'production' ? true : false,
      });
    }
    if (req.ref_TK) {
      const twoWeeksInMilliseconds = 14 * 24 * 60 * 60 * 1000; // 14일
      res.cookie('OASID_', req.ref_TK, {
        httpOnly: true, // 자바스크립트로 읽기 방지
        maxAge: twoWeeksInMilliseconds,
        // expires: new Date(Date.now() + twoWeeksInMilliseconds),
        secure: process.env.CURRENT_ENV === 'production' ? true : false,
      });
    }

    return res.send({
      ok: true,
      state: 'pass',
      method: 'tk',
      payload: req.userId,
      refresh: req.acc_Tk ? true : false /** 액세스 토큰이 갱신되면 알림 */,
      message: req.errorMsg ?? '완료',
    });
  } catch (error: any) {
    return res.send({
      ok: false,
      state: 'fail',
      message: error.message,
    });
  }
};

export default sendDataHandler;

