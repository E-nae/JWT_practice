import { encryptWithKey } from 'utils/crypt';
import { Button, FormHelperText, Grid, InputLabel, OutlinedInput, Stack } from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import AnimateButton from 'components/@extended/AnimateButton';

const PATH1 = process.env.REACT_APP_PWD_POPUP_PATH1;
const PATH2 = process.env.REACT_APP_PWD_POPUP_PATH2;
const PATH3 = process.env.REACT_APP_PWD_POPUP_PATH3;
const PATH4 = process.env.REACT_APP_PWD_POPUP_PATH4;

// ============================|| 비밀번호 찾기 ||============================ //

const FindPwdBefore = () => {
  const randomKey = async (length) => {
    return Math.random().toString(16).slice(2, length);
  };

  const saveAuthKey = async (key, id) => {
    const encryted = await encryptWithKey(key, id);
    sessionStorage.setItem('authKey', encryted);
  };
  const openPopup = async (id, key) => {
    window.open(
      `${PATH1}=${id}&${PATH2}=${PATH3}&${PATH4}=${key}`,
      'popup',
      'width=700, height=900, left=30, top=30, scrollbars=no,titlebar=no,status=no,resizable=no,fullscreen=no'
    );
    // dispatch(setKeyVal({ keyVal: authKey }));
  };

  return (
    <>
      <Formik
        initialValues={{
          id: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          id: Yup.string().max(255).required('아이디를 입력해주세요')
        })}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="id-signup">아이디</InputLabel>
                  <OutlinedInput
                    id="id-login"
                    type="id"
                    value={values.id}
                    name="id"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="아이디를 입력하세요"
                    fullWidth
                    error={Boolean(touched.id && errors.id)}
                  />
                  {touched.id && errors.id && (
                    <FormHelperText error id="helper-text-id-signup">
                      {errors.id}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              <Grid item xs={12}>
                <AnimateButton>
                  {/* <a
                    href={``}
                    target="_blank"
                    rel="noopener noreferrer"
                  > */}
                  <Button
                    // disableElevation
                    // disabled={isSubmitting}
                    fullWidth
                    size="large"
                    // type="submit"
                    variant="contained"
                    color="primary"
                    onClick={(e) => {
                      return new Promise((resolve, reject) => {
                        e.preventDefault();
                        if (values.id) {
                          randomKey(8)
                            .then((res) => {
                              saveAuthKey(res, values.id);
                              openPopup(values.id, res);
                              resolve(res);
                            })
                            .catch((error) => reject(error));
                        } else {
                          alert('아이디를 입력해주세요');
                        }
                      });
                    }}
                  >
                    본인 인증
                  </Button>
                  {/* </a> */}
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default FindPwdBefore;
