/* eslint-disable prettier/prettier */
import { useLocation } from 'react-router-dom';

const ReLoginMsg = () => {
  const location = useLocation();
  let message = location?.state;
  console.log(message);
  if (!message) {
    message = '다시 로그인 해주세요';
  }
  return message ? message : null;
};

export default ReLoginMsg;
