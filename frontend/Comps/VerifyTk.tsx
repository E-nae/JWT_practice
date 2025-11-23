import { ReactNode } from 'react';
import { verifyTK } from 'api/verify';
import { useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from 'context/AuthContext';
import { useUser } from 'context/UserContext';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loginMethod } from 'store/reducers/login';
import LoginRoutes from 'routes/LoginRoutes';
import LoginLoader from 'components/LoginLoader';

interface VerifyTKProps {
  children: ReactNode;
}

const VerifyTK = ({ children }: VerifyTKProps) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const method = useSelector((state: any) => state.login.method); // 로그인 수단
  const { UID, setUID } = useUser();
  const { setIsAuthenticated } = useAuth();

  const excluded = LoginRoutes?.children?.map((obj: any) => obj.path).filter((item: string) => item !== '/' && item !== '/login');
  const isExcludedPage = excluded.some((path: string) => location.pathname?.startsWith(path));
  // console.log(location.pathname);
  console.log(isExcludedPage);

  const { data, isError, isPending, error, refetch } = useQuery({
    queryKey: ['verifyTk'],
    queryFn: verifyTK,
    // 아이디 로그인 또는 로그인 전 페이지에서 토큰 검증 차단
    enabled: method === 'tk' || !!isExcludedPage,
    retry: 0, // 재시도를 비활성화하여 즉시 에러 상태로 전환
    // retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 1000 * 5, // 5초
    gcTime: 1000 * 60 * 60 * 2, // 2시간 (cacheTime -> gcTime으로 변경)
    refetchOnWindowFocus: false, // 창에 포커스가 맞춰질 때 재조회하지 않음
    refetchOnReconnect: false, // 네트워크 재연결 시 재조회하지 않음
    refetchOnMount: false
  });

  const refetching = useCallback(async () => {
    refetch();
  }, [refetch]);

  /** 페이지가 변경되면 토큰 검사 실행 */
  useEffect(() => {
    refetching();
    if (data?.ok) {
      setIsAuthenticated(data?.ok);
      setUID(data?.payload);
      console.log('토큰 검사함!: ', UID);
    }
  }, [data, setIsAuthenticated, setUID, location.pathname, UID, refetching]);

  /** 토큰 로그인 로딩 처리  */
  if (isPending) {
    return <LoginLoader />;
  }

  // /** 에러 처리(토큰 검사 무한 요청 방지) */
  if (isError) {
    console.log('토큰 로그인 실패', error);
    dispatch(loginMethod({ method: 'unknown' }));
    return null;
  }

  return <>{children}</>;
};

export default VerifyTK;

