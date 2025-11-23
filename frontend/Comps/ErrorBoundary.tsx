/* eslint-disable prettier/prettier */
import { useState, useEffect, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

export const ErrorBoundary = ({ children }: ErrorBoundaryProps) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      // 에러 상태를 업데이트하여 에러가 발생했음을 표시
      setHasError(true);
      // 여기서 에러를 로깅하거나 에러 보고를 처리할 수 있음
      console.error('Error caught by ErrorBoundary:', error);
    };

    // 에러 이벤트 리스너 등록
    window.addEventListener('error', handleError);

    // cleanup 함수에서 에러 이벤트 리스너 제거
    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);

  // 에러가 발생한 경우 대체 UI를 렌더링
  if (hasError) {
    return <div>Error: 컴포넌트를 로드할 수 없습니다.</div>;
  }

  // 에러가 발생하지 않은 경우 자식 컴포넌트를 렌더링
  return <>{children}</>;
};

