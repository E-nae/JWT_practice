import { useState, useEffect, MouseEvent } from 'react';
import { useFindPwd } from 'api/authentication/findPwd';
// material-ui
import {
  Box,
  Button,
  // Divider,
  FormControl,
  FormHelperText,
  Grid,
  // Link,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
// import FirebaseSocial from './FirebaseSocial';
import AnimateButton from 'components/@extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

interface PasswordLevel {
  color: string;
  label: string;
}

interface FindPwdAfterProps {
  ui_d: string | null;
}

// ============================|| Find Password||============================ //

const FindPwdAfter = ({ ui_d }: FindPwdAfterProps) => {
  const findPwd = useFindPwd();
  const [changed, setChanged] = useState(false);
  const [level, setLevel] = useState<PasswordLevel | undefined>();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordChk, setShowPasswordChk] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowPasswordChk = () => {
    setShowPasswordChk(!showPasswordChk);
  };

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const changePassword = (value: string) => {
    const temp = strengthIndicator(value);
    setLevel(strengthColor(temp));
  };

  // const changePasswordCheck = (value) => {
  //   const temp = strengthIndicator(value);
  //   setLevel(strengthColor(temp));
  // };

  useEffect(() => {
    changePassword('');
    window.history.replaceState(null, '', '/find/password/auth');
  }, []);
  // console.log(authKey);

  return (
    <>
      <Formik
        initialValues={{
          password: '',
          passwordCheck: '',
          id: ui_d || ''
        }}
        validationSchema={Yup.object().shape({
          password: Yup.string()
            .matches(/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/, '8~15자의 영문, 숫자, 특수기호를 조합해서 입력하세요')
            .min(8, '8글자 이상 15글자 이하로 입력해주세요')
            .max(15, '8글자 이상 15글자 이하로 입력해주세요')
            .required('비밀번호를 입력해주세요'),
          passwordCheck: Yup.string()
            // .matches(new RegExp(`^${password}$`), '비밀번호가 다릅니다')
            .oneOf([Yup.ref('password'), null], '비밀번호가 다릅니다.')
            .required('비밀번호을 한번 더 입력해주세요.')
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            values.id = ui_d || '';
            // values.phone = params.phone;
            findPwd(values);
            setStatus({ success: true });
            setSubmitting(true);
          } catch (err: any) {
            console.error(err);
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {!changed && (
                <Grid item xs={12}>
                  <Typography sx={{ textAlign: 'center', color: '#ed4f3e' }}> 인증이 완료되었습니다.</Typography>
                </Grid>
              )}
              <Grid item xs={7} md={7}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="id">아이디</InputLabel>
                  <OutlinedInput id="id" type="text" value={ui_d || ''} name="id" onBlur={handleBlur} disabled fullWidth />
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="password-signup">비밀번호</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    id="password-signup"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e);
                      changePassword(e.target.value);
                      setChanged(true);
                    }}
                    autoFocus={true}
                    autoComplete="false"
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          size="large"
                        >
                          {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder=""
                    inputProps={{}}
                  />
                  {touched.password && errors.password && (
                    <FormHelperText error id="helper-text-password-signup">
                      {errors.password}
                    </FormHelperText>
                  )}
                </Stack>
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <Box sx={{ bgcolor: level?.color, width: 85, height: 8, borderRadius: '7px' }} />
                    </Grid>
                    <Grid item>
                      <Typography variant="subtitle1" fontSize="0.75rem">
                        {level?.label}
                      </Typography>
                    </Grid>
                  </Grid>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="password-check">비밀번호 확인</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.passwordCheck && errors.passwordCheck)}
                    id="password-check"
                    type={showPasswordChk ? 'text' : 'password'}
                    value={values.passwordCheck}
                    name="passwordCheck"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e);
                      setChanged(true);
                      // changePasswordCheck(e.target.value);
                    }}
                    autoComplete="false"
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPasswordChk}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          size="large"
                        >
                          {showPasswordChk ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder=""
                    inputProps={{}}
                  />
                  {touched.passwordCheck && errors.passwordCheck && (
                    <FormHelperText error id="helper-text-passwordCheck">
                      {errors.passwordCheck}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                    비밀번호 변경
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default FindPwdAfter;

