/* eslint-disable prettier/prettier */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

export default function NotFounded() {
  const navigate = useNavigate();
  useEffect(() => {
    const goToBack = setTimeout(() => navigate(-1, { replace: true }), 1000);
    return () => clearTimeout(goToBack);
  }, [navigate]);

  return (
    <Box sx={{ width: '100%', height: '100vh', display: 'grid', placeItems: 'center' }}>
      <Typography variant="h3"> 잘못된 경로입니다. </Typography>
    </Box>
  );
}

