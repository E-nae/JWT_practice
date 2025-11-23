import { useEffect, useState, useRef, MouseEvent } from 'react';
import { useLocation } from 'react-router';
// import { Link as RouterLink } from 'react-router-dom';
import { useSavePwd } from 'api/login/useUpdate';
import { useFindAddress } from 'utils/daum_postcode';

// material-ui
import {
  Box,
  Button,
  Divider,
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

// assets
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

interface PasswordLevel {
  color: string;
  label: string;
}

interface LocationState {
  userId?: string;
  userName?: string;
  position?: any;
}

// ============================|| FIREBASE - REGISTER ||============================ //

const AuthUpdate = () => {
  const location = useLocation<LocationState>();
  // console.log(location);

  const chgSumbit = useSavePwd();

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
  }, []);

  const detailAddr = useRef<HTMLDivElement>(null);
  const [sample6_execDaumPostcode, postcode_, roadAddress, extraAddress] = useFindAddress();

  return (
    <>
      <Formik
        initialValues={{
          id: location.state?.userId || '',
          name: location.state?.userName || '',
          birthDate: '',
          email: '',
          gmail: '',
          address: '',
          detailAddress: '',
          password: '',
          passwordCheck: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          // firstname: Yup.string().max(255).required('First Name is required'),
          name: Yup.string().max(255).required('이름을 입력해주세요'),
          birthDate: Yup.string()
            .matches(/^[0-9]{6}$/i, '6자리 숫자')
            .required('생년월일 6자를 입력해주세요'),
          // phone: Yup.string()
          //   .matches(/^[0-9]{11}$/i, '숫자만 입력해주세요')
          //   .required('휴대폰 번호를 입력해주세요'),
          email: Yup.string()
            .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, '이메일 형식에 맞지 않습니다')
            .required('이메일 주소를 입력해주세요'),
          gmail: Yup.string().matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, '이메일 형식에 맞지 않습니다'),
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
            const data = { ...values };
            data['position'] = location.state?.position;
            // console.log(data);
            chgSumbit(data);
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
            <Grid container spacing={2}>
              <Grid item xs={7} md={7}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="id-update">아이디</InputLabel>
                  <OutlinedInput
                    id="id-update"
                    type="id"
                    value={values.id}
                    name="id"
                    onBlur={handleBlur}
                    disabled
                    // onChange={handleChange}
                    // placeholder="John"
                    fullWidth
                    error={Boolean(touched.id && errors.id)}
                  />
                  {touched.id && errors.id && (
                    <FormHelperText error id="helper-text-id-update">
                      {errors.id}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={5} md={5}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="name-update">이름</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.name && errors.name)}
                    id="name-update"
                    type="name"
                    value={values.name}
                    name="name"
                    onBlur={handleBlur}
                    disabled
                    // onChange={handleChange}
                    // placeholder="Doe"
                    inputProps={{}}
                  />
                  {touched.name && errors.name && (
                    <FormHelperText error id="helper-text-name-update">
                      {errors.name}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={7}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="email-update">이메일 주소</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.email && errors.email)}
                    id="email-update"
                    type="email"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="one4u@ofu.co.kr"
                    autoComplete="true"
                    inputProps={{}}
                  />
                  {touched.email && errors.email && (
                    <FormHelperText error id="helper-text-email-update">
                      {errors.email}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={5}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="birthDate-update">생년월일</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.birthDate && errors.birthDate)}
                    id="birthDate-update"
                    value={values.birthDate}
                    name="birthDate"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="6자리 숫자"
                    inputProps={{}}
                  />
                  {touched.birthDate && errors.birthDate && (
                    <FormHelperText error id="helper-text-birthDate-update">
                      {errors.birthDate}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="gmail-update">구글 로그인 이용을 희망하실 경우</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.gmail && errors.gmail)}
                    id="gmail-update"
                    type="gmail"
                    value={values.gmail}
                    name="gmail"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="(선택)이메일 주소를 입력해주세요"
                    autoComplete="true"
                    inputProps={{}}
                  />
                  {touched.gmail && errors.gmail && (
                    <FormHelperText error id="helper-text-gmail-update" style={{ fontSize: '0.7rem', marginTop: '0.2rem' }}>
                      {errors.gmail}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="password-update">비밀번호</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    id="password-update"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e);
                      changePassword(e.target.value);
                    }}
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
                    placeholder="******"
                    inputProps={{}}
                  />
                  {touched.password && errors.password && (
                    <FormHelperText error id="helper-text-password-update">
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
                  <InputLabel htmlFor="password-update">비밀번호 확인</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.passwordCheck && errors.passwordCheck)}
                    id="password-update"
                    type={showPasswordChk ? 'text' : 'password'}
                    value={values.passwordCheck}
                    name="passwordCheck"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e);
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
                    placeholder="******"
                    inputProps={{}}
                  />
                  {touched.passwordCheck && errors.passwordCheck && (
                    <FormHelperText error id="helper-text-passwordCheck-update">
                      {errors.passwordCheck}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Divider> 주소 </Divider>
              </Grid>
              {/** 주소 */}
              <Grid item xs={6}>
                <Stack spacing={1}>
                  {/** 우편번호 */}
                  {/* <InputLabel htmlFor="postcode-signup">우편번호</InputLabel> */}
                  <OutlinedInput
                    error={Boolean(touched.postcode && errors.postcode)}
                    id="postcode-signup"
                    type="number"
                    value={postcode_ || ''}
                    name="postcode"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="우편번호"
                    autoComplete="true"
                    inputProps={{}}
                  />
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Stack spacing={1}>
                  <Button
                    onClick={() => {
                      if (detailAddr.current && detailAddr.current.children && detailAddr.current.children[0]) {
                        sample6_execDaumPostcode(detailAddr.current.children[0] as HTMLElement);
                      }
                    }}
                    size="large"
                    variant="outlined"
                    color="primary"
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    우편번호 찾기
                  </Button>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  {/** 도로명주소 */}
                  <OutlinedInput
                    error={Boolean(touched.roadAddress && errors.roadAddress)}
                    id="roadAddress-signup"
                    type="text"
                    value={roadAddress || ''}
                    name="roadAddress"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="도로명주소"
                    autoComplete="true"
                    inputProps={{}}
                  />
                </Stack>
              </Grid>
              <Grid item xs={7}>
                <Stack spacing={1}>
                  {/** 상세주소 */}
                  {/* <InputLabel htmlFor="detailAddress-signup">상세주소</InputLabel> */}
                  <OutlinedInput
                    error={Boolean(touched.detailAddress && errors.detailAddress)}
                    id="detailAddress-signup"
                    ref={detailAddr}
                    type="text"
                    value={values.detailAddress}
                    name="detailAddress"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="상세주소"
                    autoComplete="true"
                    inputProps={{}}
                  />
                </Stack>
              </Grid>
              <Grid item xs={5}>
                <Stack spacing={1}>
                  {/** 참고항목 */}
                  {/* <InputLabel htmlFor="extraAddress-signup">참고항목</InputLabel> */}
                  <OutlinedInput
                    error={Boolean(touched.extraAddress && errors.extraAddress)}
                    id="extraAddress-signup"
                    type="text"
                    value={extraAddress || ''}
                    name="extraAddress"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="참고항목"
                    autoComplete="true"
                    inputProps={{}}
                  />
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
                    변경된 비밀번호 저장
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

export default AuthUpdate;

