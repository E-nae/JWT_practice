/* eslint-disable prettier/prettier */
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FIND_P_W_PATH_KEY = process.env.REACT_APP_FINDPWD_PATH;

export const useFindPwd = () => {
  const navigate = useNavigate();

  const findPwd = async (data) => {
    try {
      const response = await axios.post(`${FIND_P_W_PATH_KEY}`, data);
      if (!response?.data?.ok) {
        const errorMsg = response.data.message;
        throw new Error(errorMsg);
      }
      alert('비밀번호가 변경되었습니다');
      return navigate('/login', { replace: true });
    } catch (error) {
      console.log(error);
      alert(error);
      return { ok: false, state: 'fail', message: error };
    }
  };
  return findPwd;
};
