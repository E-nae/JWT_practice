/* eslint-disable prettier/prettier */
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PATH_KEY = process.env.REACT_APP_JOIN_PATH;

export const useJoin = () => {
  const navigate = useNavigate();
  const runSubmit = async (data: any): Promise<void> => {
    try {
      const response = await axios.post(`/${PATH_KEY}`, data);
      console.log(response.data);
      navigate('/pending', { state: true }, { replace: true });
    } catch (error) {
      // throw error; // 에러를 다시 던져서 다른 곳에서도 처리할 수 있게 합니다.
      alert('가입이 완료되지 않음');
      throw new Error(`가입 실패: ${error}`);
    }
  };
  return runSubmit;
};

