import { useState, MouseEvent } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useLogin } from 'api/authentication/useLogin';
import { useUser } from 'context/UserContext';
// import FirebaseSocial from './FirebaseSocial';

// material-ui
import {
  Button,
  // Checkbox,
  // Divider,
  // FormControlLabel,
  FormHelperText,
  Grid,
  Link,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack
  // Typography
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
// import FirebaseSocial from './FirebaseSocial';
import AnimateButton from 'components/@extended/AnimateButton';

// assets
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

// ============================|| FIREBASE - LOGIN ||============================ //

const AuthLogin = () => {
  const runSubmit = useLogin();
  const { setUID } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  // const loginMutation = useMutation(runSubmit, {
  //   onSuccess: (data) => {
  //     onLogin(data);
  //   },
  //   onError: (error) => {
  //     console.error('Login failed:', error);
  //     // 에러 처리 로직 (예: 에러 메시지 표시)
  //   }
  // });

  return (
    <>
      <Formik
        initialValues={{
          id: '',
          password: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          id: Yup.string().max(255).required('아이디를 입력해주세요'),
          password: Yup.string().max(255).required('비밀번호를 입력해주세요')
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            const result = await runSubmit(values);
            if (result?.ok && result?.state === 'pass') {
              setUID(result?.payload);
            }
            // loginMutation.mutate(values);
            // console.log(values);
            setStatus({ success: true });
            setSubmitting(true);
          } catch (err: any) {
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="id-login">아이디</InputLabel>
                  <OutlinedInput
                    id="id-login"
                    type="text"
                    value={values.id}
                    name="id"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="아이디를 입력하세요"
                    fullWidth
                    autoComplete="off"
                    error={Boolean(touched.id && errors.id)}
                  />
                  {touched.id && errors.id && (
                    <FormHelperText error id="standard-weight-helper-text-email-login">
                      {errors.id}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="password-login">비밀번호</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    id="-password-login"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    autoComplete="off"
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
                    placeholder="비밀번호를 입력하세요"
                  />
                  {touched.password && errors.password && (
                    <FormHelperText error id="standard-weight-helper-text-password-login">
                      {errors.password}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12} sx={{ mt: -1 }}>
                <Stack direction="row" justifyContent="right" alignItems="center" spacing={2}>
                  {/* <FormControlLabel
                    control={
                      <Checkbox
                        checked={checked}
                        onChange={(event) => setChecked(event.target.checked)}
                        name="checked"
                        color="primary"
                        size="small"
                      />
                    }
                    label={<Typography variant="h6">로그인 유지</Typography>}
                  /> */}
                  <Link variant="body2" component={RouterLink} to="/find/password/auth" color="text.secondary" underline="hover">
                    아이디 또는 비밀번호를 잊으셨나요?
                  </Link>
                </Stack>
              </Grid>
              <Grid item style={{ paddingTop: '0.5rem' }} xs={12}>
                <Stack direction="row" justifyContent="right" alignItems="center" spacing={0}>
                  <Link variant="body2" component={RouterLink} to="/membership/join" color="text.secondary" underline="hover">
                    회원이 아니신가요?
                  </Link>
                </Stack>
              </Grid>
              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              <Grid item xs={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                    로그인
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

export default AuthLogin;

