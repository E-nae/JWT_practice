import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from 'context/UserContext';
import { useAuth } from 'context/AuthContext';
import { useEn_Decryption, setWithExpiry } from 'utils/crypt';
import { useDispatch } from 'react-redux';
import { loginMethod } from 'store/reducers/login';
import sendFP from 'api/common/sendFP';
import { useSocket } from 'context/SocketContext';

const PATH_KEY = process.env.REACT_APP_LOGIN_PATH;

interface LoginData {
  id: string;
  password: string;
}

interface LoginResponse {
  ok: boolean;
  state: string;
  method?: string;
  payload?: any;
  message?: string;
}

export const useLogin = () => {
  const { setIsAuthenticated } = useAuth();
  const { setUser, setUID } = useUser();
  const { encrypt } = useEn_Decryption();
  const { socketPro, socketDev } = useSocket();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const runSubmit = async (data: LoginData): Promise<LoginResponse> => {
    try {
      const response = await axios.post(`/${PATH_KEY}`, data, {
        withCredentials: true, // 쿠키 저장
        credentials: 'include' //쿠키 저장
      });
      // console.log(response.data.ok);
      if (response.data.ok && response.data.state === 'pass') {
        // window.close();
        const payload = response?.data?.payload;

        const result = await sendFP(payload.ID);
        console.log('FP전송 결과: ', result);

        await setUID(payload.ID);

        /** 웹소켓 연결 */
        // socket_data.open();

        if (process.env.IS_DEV) {
          socketDev.open();
          socketDev.emit('login', payload.ID, 'socket Open', (res: any) => {
            console.log(res);
          });
        } else {
          socketPro.open();
          socketPro.emit('login', payload.ID, 'socket Open', (res: any) => {
            console.log(res);
          });
        }

        /** 유저 암호화 */
        const encrypted = await encrypt(payload);
        // console.log('encrypted: ', encrypted);
        await setUser(encrypted);
        await setWithExpiry('uid', encrypted, 1 * 60 * 60 * 1000); // 1 * 60 * 60 * 1000초(1시간);
        // console.log('encrypted: ', encrypted);
        setIsAuthenticated(true);
        dispatch(loginMethod({ method: response.data.method }));

        navigate('/', { replace: true });
        return { ok: true, state: 'pass', payload: payload.ID };
      }
      if (!response.data.ok) {
        if (response.data.state === 'pending') {
          // dispatch(loginStatus(response.data.method));
          navigate(
            '/pending',
            // {state: {'id': response.data.userId, 'name': response.data.userName}},
            { state: response.data.message },
            { replace: true }
          );
          return { ok: false, state: 'pending', message: response.data.message };
        }

        if (response.data.state === 'resignation') {
          console.log('계정이 없습니다');
          alert('계정이 없습니다');

          return { ok: false, state: 'reject', message: response.data.message };
        }
        if (response.data.state === 'fail') {
          alert('아이디 또는 패스워드가 일치하지 않습니다');

          return { ok: false, state: 'fail', message: response.data.message };
        }
      }
      return { ok: false, state: 'fail' };
    } catch (error) {
      console.log('로그인 실패: ', error);
      navigate('/', { state: '다시 로그인 해주세요' }, { replace: true });
      alert('아이디 또는 패스워드가 일치하지 않습니다');
      return { ok: false, state: 'fail' };
    }
  };
  return runSubmit;
};

