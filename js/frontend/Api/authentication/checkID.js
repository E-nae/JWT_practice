/* eslint-disable prettier/prettier */
import axios from 'axios';

const PATH_KEY = process.env.REACT_APP_IDCHECK_PATH;

export const checkID = async (id) => {
  try {
    const response = await axios.post(`/${PATH_KEY}`, { ID: id });
    if (response.data.ok) {
      return { status: 'pass', message: response.data.message };
    }
    if (!response.data.ok) {
      if (response.data.state === 'duplicated') {
        return { status: 'duplicated', message: response.data.message };
      }
      if (response.data.state === 'fail') {
        return { status: 'fail', message: response.data.message };
      }
    }
  } catch (error) {
    console.log('아이디 중복 검사 실패: ', error);
    return { status: 'fail', message: '시스템 오류' };
  }
};
