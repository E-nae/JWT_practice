// import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useRef } from 'react';
import { findId } from 'api/authentication/find';
import { useState } from 'react';
// material-ui
import {
  // Box,
  Button,
  // Divider,
  // FormControl,
  // FormHelperText,
  Grid,
  Link,
  // IconButton,
  // InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
// import FirebaseSocial from './FirebaseSocial';
import AnimateButton from 'components/@extended/AnimateButton';
import { Box } from '../../../../node_modules/@mui/material/index';
// import { strengthColor, strengthIndicator } from 'utils/password-strength';

// assets
// import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

// ============================|| FIREBASE - REGISTER ||============================ //

const AuthFindId = () => {
  const theme = useTheme();
  // const [level, setLevel] = useState();
  // const [showPassword, setShowPassword] = useState(false);
  // const handleClickShowPassword = () => {
  //   setShowPassword(!showPassword);
  // };

  // const handleMouseDownPassword = (event) => {
  //   event.preventDefault();
  // };

  // const changePassword = (value) => {
  //   const temp = strengthIndicator(value);
  //   setLevel(strengthColor(temp));
  // };
  // console.log(document.findForm);
  const [result, setResult] = useState({});

  /** 연락처 input 자동 포커스 옮기기 */
  const targetVal1 = useRef(null);
  const targetVal2 = useRef(null);
  const toss = (e, target, max) => {
    let str = e.target.value.length;
    if (str >= max) target.current.firstChild.focus();
  };

  return (
    <>
      <Formik
        initialValues={{
          id: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          // firstname: Yup.string().max(255).required('First Name is required'),
          // name: Yup.string().max(255).required('Last Name is required'),
          // email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          // password: Yup.string().max(255).required('Password is required')
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            const data = {};
            data.name = values.name;
            data.birthDate = values.birthDate;
            data.phone = values.phone1 + values.phone2 + values.phone3;
            // console.log(data);
            setStatus({ success: true });
            setSubmitting(true);
            const results = await findId(data);
            console.log(results);
            setResult(results);
          } catch (err) {
            console.error(err);
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
          }
        }}
      >
        {({ handleBlur, handleChange, handleSubmit, isSubmitting, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="name-signup">이름</InputLabel>
                  <OutlinedInput
                    id="name-find"
                    type="name"
                    value={values.name || ''}
                    name="name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    fullWidth
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} md={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="birthDate-signup">생년월일</InputLabel>
                  <OutlinedInput
                    id="birthDate-find"
                    type="birthDate"
                    value={values.birthDate || ''}
                    name="birthDate"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="6자리 숫자"
                    fullWidth
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} md={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="phone-signup">연락처</InputLabel>
                  <Stack spacing={1} direction="row" justifyContent="space-between" alignItems="baseline">
                    <OutlinedInput
                      id="phone1-find"
                      type="phone1"
                      value={values.phone1 || ''}
                      name="phone1"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      maxLength={3}
                      onKeyUp={(e) => toss(e, targetVal1, 3)}
                      fullWidth
                    />
                    <Typography>-</Typography>
                    <OutlinedInput
                      id="phone2-find"
                      type="phone2"
                      value={values.phone2 || ''}
                      name="phone2"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      maxLength={4}
                      onKeyUp={(e) => toss(e, targetVal2, 4)}
                      ref={targetVal1}
                      fullWidth
                    />
                    <Typography>-</Typography>
                    <OutlinedInput
                      id="phone3-find"
                      type="phone3"
                      value={values.phone3 || ''}
                      name="phone3"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      maxLength={4}
                      ref={targetVal2}
                      fullWidth
                    />
                  </Stack>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                    아이디 찾기
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
      {result && result.ok && (
        <Box sx={{ pt: 3, pb: 3, textAlign: 'center' }}>
          <Typography sx={{ pb: 2, color: theme.palette.secondary.main }} noWrap>
            회원님의 아이디는&nbsp;&nbsp; <span style={{ fontSize: '1.6rem', color: theme.palette.primary.light }}>{result.payload}</span>{' '}
            &nbsp;&nbsp;입니다.
          </Typography>
          <Link component={RouterLink} to="/login">
            로그인 하러 가기
          </Link>
        </Box>
      )}
    </>
  );
};

export default AuthFindId;
