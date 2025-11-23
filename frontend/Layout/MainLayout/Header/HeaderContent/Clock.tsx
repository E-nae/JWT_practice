import { useState, useEffect } from 'react';
import { Box, Stack, Typography } from '@mui/material';

function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const dateOptions: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };

  return (
    <Box
      sx={{
        width: '100%',
        ml: { xs: 1, md: 1 }
      }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={0.5}
        sx={{
          width: 'fit-content',
          py: 1,
          px: 1.5,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: '.314rem'
        }}
      >
        <Typography sx={{ fontSize: '.8rem' }}>{time.toLocaleDateString('ko-KR', dateOptions)}</Typography>
        <Typography sx={{ fontSize: '.8rem' }}>{time.toLocaleTimeString('ko-KR', timeOptions)}</Typography>
      </Stack>
    </Box>
  );
}

export default Clock;

