/* eslint-disable prettier/prettier */
import { Grid, Stack, Typography } from '@mui/material';
import AuthWrapper from './AuthWrapper';

// ================================|| REGISTER ||================================ //

const PendingUser = () => (
  <AuthWrapper>
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
          <Typography variant="body1"> 가입 확인 중입니다. 잠시만 기다려주세요 </Typography>
        </Stack>
      </Grid>
    </Grid>
  </AuthWrapper>
);

export default PendingUser;

