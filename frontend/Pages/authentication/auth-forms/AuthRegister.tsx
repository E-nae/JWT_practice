import { useEffect, useState, useRef, MouseEvent } from 'react';
import { useJoin } from 'api/authentication/useJoin';
import { checkID } from 'api/authentication/checkID';
import { useFindAddress } from 'utils/daum_postcode';
// import { googleSignUp } from 'utils/firebase/auth_signup_password';
// import { Link as RouterLink } from 'react-router-dom';
// material-ui
import {
  Box,
  Button,
  Divider,
  FormHelperText,
  Grid,
  // Link,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography
} from '@mui/material';
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

interface IdCheckResult {
  status: string;
  message: string;
}

interface RegisterValues {
  ID: string;
  NAME: string;
  BIRTHDAY: string;
  TEL: string;
  EMAIL: string | { CONTENTS: string; IS_ACTIVE: string; TY: string };
  detailAddress: string;
  PASSWD: string;
  PASSWDCheck: string;
  submit: null;
  ADDR?: { CONTENTS: string; IS_ACTIVE: string; TY: string };
  [key: string]: any;
}

// ============================|| FIREBASE - REGISTER ||============================ //

const AuthRegister = () => {
  const runSubmit = useJoin();
  const [level, setLevel] = useState<PasswordLevel | undefined>();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordChk, setShowPasswordChk] = useState(false);
  const [idCheck, setIdCheck] = useState<IdCheckResult | false>({ status: 'default', message: '' });

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

  useEffect(() => {
    changePassword('');
  }, []);

  const idDuplicateChk = async (id: string) => {
    const result = await checkID(id);
    console.log(result);
    setIdCheck(result);
  };

  const detailAddr = useRef<HTMLDivElement>(null);
  const [sample6_execDaumPostcode, postcode_, roadAddress, extraAddress] = useFindAddress();

  return (
    <>
      <Formik
        initialValues={{
          ID: '',
          NAME: '',
          BIRTHDAY: '',
          TEL: '',
          EMAIL: '',
          detailAddress: '',
          PASSWD: '',
          PASSWDCheck: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          ID: Yup.string().max(255).required('아이디를 입력해주세요'),
          NAME: Yup.string().max(255).required('이름을 입력해주세요'),
          BIRTHDAY: Yup.string()
            .matches(/^[0-9]{8}$/, '8자리 숫자만 입력해주세요')
            .required('생년월일 8자리'),
          TEL: Yup.string()
            .matches(/^[0-9]{11}$/, '숫자만 입력해주세요')
            .required('휴대폰 번호를 입력해주세요'),
          EMAIL: Yup.string()
            .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, '이메일 형식에 맞지 않습니다')
            .required('이메일 주소를 입력해주세요'),
          PASSWD: Yup.string()
            .matches(
              /^(?:(?=.*[a-z])(?:(?=.*[A-Z])|(?=.*\d)|(?=.*[!@%23$%^&*()-_=+]))|(?=.*[A-Z])(?:(?=.*\d)|(?=.*[!@%23$%^&*()-_=+]))|(?=.*\d)(?=.*[!@%23$%^&*()-_=+])).{8,15}$/,
              '8~15자의 영문, 숫자, 특수기호(!@#$%^&*()-_=+)를 2가지 이상 사용해주세요'
            )
            .min(8, '8글자 이상 15글자 이하로 입력해주세요')
            .max(15, '8글자 이상 15글자 이하로 입력해주세요')
            .required('비밀번호를 입력해주세요'),
          PASSWDCheck: Yup.string()
            // .matches(new RegExp(`^${password}$`), '비밀번호가 다릅니다')
            .oneOf([Yup.ref('PASSWD'), null], '비밀번호가 다릅니다')
            .required('비밀번호를 한번 더 입력해주세요')
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            if (!idCheck) {
              setStatus({ success: false });
              alert('아이디 중복 확인을 해주세요');
              setSubmitting(false);
              return;
            }
            if (idCheck.status === 'pass') {
              const address = '(' + postcode_ + ') ' + roadAddress + ' ' + values.detailAddress + ' ' + extraAddress;
              // values['ZIP_CD'] = postcode_;
              // values['ROAD_ADDR'] = roadAddress;
              // values['DETAIL_ADDR'] = values.detailAddress;
              // values['EXTRA_ADDR'] = extraAddress;
              const submitValues: RegisterValues = {
                ...values,
                EMAIL: { CONTENTS: values.EMAIL as string, IS_ACTIVE: 'MAIN', TY: 'EMAIL' },
                TEL: { CONTENTS: values.TEL, IS_ACTIVE: 'MAIN', TY: 'TEL' },
                ADDR: { CONTENTS: address, IS_ACTIVE: 'MAIN', TY: 'ADDRESS' }
              };
              delete submitValues.PASSWDCheck;
              console.log(submitValues);
              setStatus({ success: true });
              setSubmitting(true);
              return runSubmit(submitValues);
            }
            if (idCheck.status === 'duplicated') {
              setStatus({ success: false });
              alert('중복된 아이디가 있습니다');
              setSubmitting(false);
              return;
            }
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
              <Grid item xs={12} md={12}>
                {/* <Stack spacing={1}> */}
                <InputLabel htmlFor="id-signup">아이디</InputLabel>
                <Stack spacing={1} direction="row" justifyContent="space-between" alignItems="center">
                  <OutlinedInput
                    id="id-signup"
                    type="text"
                    value={values.ID || ''}
                    name="ID"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e);
                      setIdCheck(false);
                    }}
                    placeholder="아이디"
                    fullWidth
                    // sx={{ width: 4/5 }}
                    error={Boolean(touched.ID && errors.ID)}
                  />
                  <AnimateButton>
                    <Button
                      fullWidth
                      size="large"
                      variant="outlined"
                      color="primary"
                      onClick={() => idDuplicateChk(values.ID)}
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      중복 확인
                    </Button>
                  </AnimateButton>
                </Stack>
                {touched.ID && errors.ID && (
                  <FormHelperText error id="helper-text-id-signup" style={{ fontSize: '0.7rem', marginTop: '0.2rem' }}>
                    {errors.ID}
                  </FormHelperText>
                )}
                {idCheck && typeof idCheck !== 'boolean' && (
                  <FormHelperText error id="helper-text-id-signup" style={{ fontSize: '0.7rem', marginTop: '0.2rem' }}>
                    {idCheck.message}
                  </FormHelperText>
                )}
                {/* </Stack> */}
              </Grid>
              <Grid item xs={5} md={5}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="name-signup">이름</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.NAME && errors.NAME)}
                    id="name-signup"
                    type="text"
                    value={values.NAME || ''}
                    name="NAME"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="이름"
                    inputProps={{}}
                  />
                  {touched.NAME && errors.NAME && (
                    <FormHelperText error id="helper-text-name-signup" style={{ fontSize: '0.7rem', marginTop: '0.2rem' }}>
                      {errors.NAME}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={7}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="tel-signup">휴대폰번호</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.TEL && errors.TEL)}
                    id="tel-signup"
                    value={values.TEL || ''}
                    name="TEL"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="숫자만 입력"
                    inputProps={{}}
                  />
                  {touched.TEL && errors.TEL && (
                    <FormHelperText error id="helper-text-tel-signup" style={{ fontSize: '0.7rem', marginTop: '0.2rem' }}>
                      {errors.TEL}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={5} md={5}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="birthDate-signup">생년월일</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.BIRTHDAY && errors.BIRTHDAY)}
                    id="birthDate-signup"
                    value={values.BIRTHDAY || ''}
                    name="BIRTHDAY"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="8자리"
                    inputProps={{}}
                  />
                  {touched.BIRTHDAY && errors.BIRTHDAY && (
                    <FormHelperText error id="helper-text-birthDate-signup" style={{ fontSize: '0.7rem', marginTop: '0.2rem' }}>
                      {errors.BIRTHDAY}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={7}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="email-signup">이메일 주소</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.EMAIL && errors.EMAIL)}
                    id="email-login"
                    type="text"
                    value={typeof values.EMAIL === 'string' ? values.EMAIL : ''}
                    name="EMAIL"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="이메일"
                    autoComplete="true"
                    inputProps={{}}
                  />
                  {touched.EMAIL && errors.EMAIL && (
                    <FormHelperText error id="helper-text-email-signup" style={{ fontSize: '0.7rem', marginTop: '0.2rem' }}>
                      {errors.EMAIL}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="PASSWD-signup">비밀번호</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.PASSWD && errors.PASSWD)}
                    id="PASSWD-signup"
                    type={showPassword ? 'text' : 'password'}
                    value={values.PASSWD || ''}
                    name="PASSWD"
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
                    placeholder="********"
                    inputProps={{}}
                  />
                  {touched.PASSWD && errors.PASSWD && (
                    <FormHelperText error id="helper-text-PASSWD-signup" style={{ fontSize: '0.7rem', marginTop: '0.2rem' }}>
                      {errors.PASSWD}
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

              <Grid item xs={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="password-check">비밀번호 확인</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.PASSWDCheck && errors.PASSWDCheck)}
                    id="password-check"
                    type={showPasswordChk ? 'text' : 'password'}
                    value={values.PASSWDCheck || ''}
                    name="PASSWDCheck"
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
                    placeholder="********"
                    inputProps={{}}
                  />
                  {touched.PASSWDCheck && errors.PASSWDCheck && (
                    <FormHelperText error id="helper-text-passwordCheck">
                      {errors.PASSWDCheck}
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
                  {/* {touched.postcode && errors.postcode && (
                    <FormHelperText error id="helper-text-postcode-signup" style={{ fontSize: '0.7rem', marginTop: '0.2rem' }}>
                      {errors.postcode}
                    </FormHelperText>
                  )} */}
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
                  {/* <InputLabel htmlFor="roadAddress-signup">도로명주소</InputLabel> */}
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
                  {/* {touched.roadAddress && errors.roadAddress && (
                    <FormHelperText error id="helper-text-roadAddress-signup" style={{ fontSize: '0.7rem', marginTop: '0.2rem' }}>
                      {errors.roadAddress}
                    </FormHelperText>
                  )} */}
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
                  {/* {touched.detailAddress && errors.detailAddress && (
                    <FormHelperText error id="helper-text-detailAddress-signup" style={{ fontSize: '0.7rem', marginTop: '0.2rem' }}>
                      {errors.detailAddress}
                    </FormHelperText>
                  )} */}
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
                    placeholder="자동입력"
                    autoComplete="true"
                    inputProps={{}}
                  />
                  {/* {touched.extraAddress && errors.extraAddress && (
                      <FormHelperText error id="helper-text-extraAddress-signup" style={{ fontSize: '0.7rem', marginTop: '0.2rem' }}>
                        {errors.extraAddress}
                      </FormHelperText>
                    )} */}
                </Stack>
              </Grid>

              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              <Grid item xs={8} style={{ margin: '2rem auto 0' }}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                    가입
                  </Button>
                </AnimateButton>
              </Grid>
              {/* <Grid item xs={12}>
                <Divider>
                  <Typography variant="caption">Sign up with</Typography>
                </Divider>
              </Grid>
              <Grid item xs={12}>
                <FirebaseSocial />
              </Grid> */}
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AuthRegister;

