import PropTypes from 'prop-types';
import { useEffect, useCallback, useRef, useState } from 'react';
import { usePro_File } from 'controller/usePro_file';
import { useLogout } from 'api/authentication/useLogout';
// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, ButtonBase, CardContent, ClickAwayListener, Grid, IconButton, Paper, Popper, Stack, Typography } from '@mui/material';
import { LogoutOutlined } from '@ant-design/icons';
// project import
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';
import ProfileTab from './ProfileTab';
import Loader from 'components/Loader';
import { useEn_Decryption } from 'utils/crypt';
import defaultImg from 'components/LazyImage';
const defaultUrl = process.env.REACT_APP_MYPAGE_AVATAR_DEFAULT_PATH;

// tab panel wrapper
function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`profile-tabpanel-${index}`} aria-labelledby={`profile-tab-${index}`} {...other}>
      {value === index && children}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

// ==============================|| HEADER CONTENT - PROFILE ||============================== //

const Profile = () => {
  const theme = useTheme();
  const [us_er, setUs_er] = useState({});
  const [avatar, setAvatar] = useState(null);
  const { isError, error, isPending, user } = usePro_File();
  const { decrypt } = useEn_Decryption();

  const updateUser = useCallback(
    (data) => {
      setUs_er(data);
      setAvatar(data?.PROFILE_URL);
    },
    [setUs_er, setAvatar]
  );

  useEffect(() => {
    const decryptData = async (data) => {
      const profile = await decrypt(data);
      // console.log(profile);
      updateUser(profile);
    };
    if (user) {
      decryptData(user);
    }
  }, [user, decrypt, updateUser]);
  // console.log(user);
  // const logout = useLogout();
  const logout = useLogout();

  const handleLogout = async () => {
    logout(us_er?.ID);
  };

  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const iconBackColorOpen = 'grey.300';

  if (isPending) return <Loader />;
  if (isError) return console.log(`에러 발생: ${error.message}`);

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <ButtonBase
        sx={{
          p: 0.25,
          bgcolor: open ? iconBackColorOpen : 'transparent',
          borderRadius: 1,
          '&:hover': { bgcolor: 'secondary.lighter' }
        }}
        aria-label="open profile"
        ref={anchorRef}
        aria-controls={open ? 'profile-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Stack direction="row" spacing={2} alignItems="center" sx={{ p: 0.5 }}>
          <Avatar alt="profile user" src={`${avatar ? defaultUrl + avatar : defaultImg}`} sx={{ width: 32, height: 32 }} />
          <Typography variant="subtitle1">{us_er.NAME}</Typography>
          {/* <Typography variant="subtitle1">이름</Typography> */}
        </Stack>
      </ButtonBase>
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 9]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions type="fade" in={open} {...TransitionProps}>
            {open && (
              <Paper
                sx={{
                  boxShadow: theme.customShadows.z1,
                  width: 290,
                  minWidth: 240,
                  maxWidth: 290,
                  [theme.breakpoints.down('md')]: {
                    maxWidth: 250
                  }
                }}
              >
                <ClickAwayListener onClickAway={handleClose}>
                  <MainCard elevation={0} border={false} content={false}>
                    <CardContent sx={{ px: 2.5, pt: 3 }}>
                      <Grid container justifyContent="space-between" alignItems="center">
                        <Grid item>
                          <Stack direction="row" spacing={1.25} alignItems="center">
                            <Avatar
                              alt="profile user"
                              src={`${avatar ? defaultUrl + avatar : defaultImg}`}
                              sx={{ width: 32, height: 32 }}
                            />
                            <Stack>
                              <Typography variant="h6">{us_er.NAME}</Typography>
                              {/* <Typography variant="h6">이름</Typography> */}
                              <Typography variant="body2" color="textSecondary">
                                {us_er?.POSITION?.NAME}
                              </Typography>
                            </Stack>
                          </Stack>
                        </Grid>
                        <Grid item>
                          <IconButton size="large" color="secondary" onClick={handleLogout}>
                            <LogoutOutlined />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </CardContent>
                    {open && (
                      <>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                          {/* <Stack direction="row" justifyContent="center" alignItems="baseline" style={{ height: '2rem' }}>
                            <UserOutlined style={{ marginBottom: 0, marginRight: '10px' }} />내 정보
                          </Stack>
                          <Divider /> */}
                          <Stack>
                            <ProfileTab handleLogout={handleLogout} setOpen={setOpen} />
                          </Stack>
                        </Box>
                      </>
                    )}
                  </MainCard>
                </ClickAwayListener>
              </Paper>
            )}
          </Transitions>
        )}
      </Popper>
    </Box>
  );
};

export default Profile;
