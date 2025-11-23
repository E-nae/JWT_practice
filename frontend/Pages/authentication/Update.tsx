import { Grid, Stack, Typography } from '@mui/material';
import FirebaseRegister from './auth-forms/AuthUpdate';
import AuthWrapper from './AuthWrapper';

// ================================|| REGISTER ||================================ //

const Update = () => (
  <AuthWrapper>
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
          <Typography variant="h3">비밀번호 변경</Typography>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <FirebaseRegister />
      </Grid>
    </Grid>
  </AuthWrapper>
);

export default Update;

