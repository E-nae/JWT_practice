/* eslint-disable prettier/prettier */
import axios from 'axios';
import { useAuth } from 'context/AuthContext';
import { useUser } from 'context/UserContext';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { loginMethod } from 'store/reducers/login';
import { refetching } from 'store/reducers/refetch';
import { useSocket } from 'context/SocketContext';

const PATH_KEY = process.env.REACT_APP_LOGOUT_PATH;

export const useLogout = () => {
  const { setIsAuthenticated } = useAuth();
  const { setUser, setUID } = useUser();
  const { socketPro, socketDev } = useSocket();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const logout = async (id) => {
    /** form 입력값 서버로 전송 */
    try {
      const result = await axios.post(
        `/${PATH_KEY}`,
        { id },
        {
          credentials: 'same-origin',
          withCredentials: true
        }
      );
      if (!result?.data?.ok) {
        return new Error('Failed to logout: ', result.message);
      }
      // local
      if (result?.data?.ok) {
        setIsAuthenticated(false);
        navigate('/', { replace: true });
      }
    } catch (error) {
      console.log(error);
      alert('에러');
      return;
    } finally {
      setIsAuthenticated(false); //권한 제거
      setUser(null); // 정보 삭제
      setUID(null); //아이디 삭제
      queryClient.clear(); //캐싱 초기화
      dispatch(loginMethod({ method: 'unknown' })); // 무한 토큰 검사 요청 방지
      dispatch(refetching(false)); // 프로필 조회 차단
      sessionStorage.removeItem('uid');

      process.env.IS_DEV && socketDev.disconnect();
      !process.env.IS_DEV && socketPro.disconnect();
      navigate('/', { replace: true });
    }
  };

  return logout;
};
