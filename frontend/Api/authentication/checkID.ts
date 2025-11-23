/* eslint-disable prettier/prettier */
import axios from 'axios';

const PATH_KEY = process.env.REACT_APP_IDCHECK_PATH;

interface CheckIDResponse {
  status: string;
  message: string;
}

export const checkID = async (id: string): Promise<CheckIDResponse> => {
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
    return { status: 'fail', message: '알 수 없는 오류' };
  } catch (error) {
    console.log('아이디 중복 검사 실패: ', error);
    return { status: 'fail', message: '시스템 오류' };
  }
};

