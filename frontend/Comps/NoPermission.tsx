import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@mui/material';
import MainCard from 'components/MainCard';

// ==============================|| SAMPLE PAGE ||============================== //

const NoPermission = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate('/', { replace: true });
    }, 4000);

    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <MainCard title="Block Access">
      <Typography variant="body2">페이지 접근 권한이 없습니다.</Typography>
    </MainCard>
  );
};

export default NoPermission;

