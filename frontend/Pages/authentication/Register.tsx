import { lazy } from 'react';
import { Grid, Stack, Typography } from '@mui/material';
import AuthWrapper from './AuthWrapper';
const AuthRegister = lazy(() => import('./auth-forms/AuthRegister'));

// ================================|| REGISTER ||================================ //

const Register = () => (
  <AuthWrapper>
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
          <Typography variant="h3">회원 가입</Typography>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <AuthRegister />
      </Grid>
    </Grid>
  </AuthWrapper>
);

export default Register;

