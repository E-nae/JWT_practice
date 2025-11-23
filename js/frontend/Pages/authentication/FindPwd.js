import Loadable from 'components/Loadable';
import { useState, lazy } from 'react';
// material-ui
import { Grid, Stack, Tabs, Tab } from '@mui/material';

// project import
import AuthWrapper from './AuthWrapper.js';
// import { useParams } from 'react-router';
const AuthFindId = Loadable(lazy(() => import('./auth-forms/AuthFindID.js')));
const AuthFindPwd = Loadable(lazy(() => import('./auth-forms/AuthFindPwd.js')));

// ================================|| REGISTER ||================================ //
const TabPanel = ({ tab }) => {
  return [<AuthFindId key={0} />, <AuthFindPwd key={1} />][tab];
};
const FindPwd = () => {
  const [tab, setTab] = useState(1);

  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
            <Tabs value={tab}>
              <Tab label="아이디 찾기" onClick={() => setTab(0)} />
              <Tab label="비밀번호 찾기" onClick={() => setTab(1)} />
            </Tabs>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <TabPanel tab={tab} setTab={setTab} />
        </Grid>
      </Grid>
    </AuthWrapper>
  );
};

export default FindPwd;
