/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
// material-ui
import { useTheme } from '@mui/material/styles';
import { useMediaQuery, Button, Stack } from '@mui/material';
import { useCallGoogleApi } from 'utils/firebase/auth_google_signin_popup';
// import { googleSingIn } from 'utils/firebase/auth_signin_password';
// import { useOauthLogin } from 'api/oauthLogin';
// import { Link } from 'react-router-dom';
// assets
// import Google from 'assets/images/icons/google.svg';
// import Twitter from 'assets/images/icons/twitter.svg';
// import Facebook from 'assets/images/icons/facebook.svg';

// ==============================|| FIREBASE - SOCIAL BUTTON ||============================== //

const FirebaseSocial = () => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
  const signInWithGoogle = useCallGoogleApi();

  // const [ loginWithGoogle ] = useOauthLogin();

  const currHost = window.location.hostname;
  const REST_API_KEY = process.env.REACT_APP_KAKAO_REST_API;
  const REDIRECT_URI1 = process.env.REACT_APP_KAKAO_REDIRECT_URI1;
  const REDIRECT_URI2 = process.env.REACT_APP_KAKAO_REDIRECT_URI2;
  const REDIRECT_URI = currHost === 'localhost' ? REDIRECT_URI1 : REDIRECT_URI2;
  const authorizeURL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`


  const googleHandler = async (event) => {
    // login || singup
    event.preventDefault();
    await signInWithGoogle();
    // await loginWithGoogle();
  };

  const kakaoHandler = async (event) => {
    // login || singup
    event.preventDefault();
    window.location.href = authorizeURL;
  };

  // const facebookHandler = async () => {
  //   // login || singup
  // };



  
  return (
    <Stack
      direction="row"
      spacing={matchDownSM ? 1 : 2}
      // spacing={1}
      justifyContent={matchDownSM ? 'space-around' : 'space-between'}
      // justifyContent={'center'}
      sx={{ '& .MuiButton-startIcon': { mr: matchDownSM ? 0 : 1, ml: matchDownSM ? 0 : -0.5 } }}
    >
      <Button
        variant="text"
        color="secondary"
        size="small"
        fullWidth={!matchDownSM}
        startIcon={<img src={process.env.PUBLIC_URL + `/assets/google_login.png`} alt="Google" />}
        onClick={(e)=> googleHandler(e)}
      >
        {/* {!matchDownSM && 'Google'} */}
      </Button>
      <Button
        variant="text"
        color="secondary"
        size="small"
        fullWidth={!matchDownSM}
        startIcon={<img src={process.env.PUBLIC_URL + `/assets/kakao_login.png`} alt="Kakao" />}
        // component={Link} to={authorizeURL}
        onClick={(e)=> kakaoHandler(e)}
      >
        {/* {!matchDownSM && 'Kakao'} */}
      </Button>
      {/* <Button
        variant="outlined"
        color="secondary"
        fullWidth={!matchDownSM}
        startIcon={<img src={Facebook} alt="Facebook" />}
        onClick={facebookHandler}
      >
        {!matchDownSM && 'Facebook'}
      </Button> */}
    </Stack>
  );
};

export default FirebaseSocial;
