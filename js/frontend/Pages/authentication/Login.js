import { lazy } from 'react';
import { Grid, Stack, Typography } from '@mui/material';
import AuthWrapper from './AuthWrapper.js';
const AuthLogin = lazy(() => import('./auth-forms/AuthLogin.js'));
const ReLoginMsg = lazy(() => import('./ReLoginMsg.js'));

// ================================|| LOGIN ||================================ //
const Login = () => (
  <AuthWrapper>
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
          <Typography variant="h3">로그인</Typography>
          <Typography variant="body1" sx={{ textDecoration: 'none' }} color="primary">
            <ReLoginMsg />
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <AuthLogin />
      </Grid>
    </Grid>
  </AuthWrapper>
);

export default Login;
