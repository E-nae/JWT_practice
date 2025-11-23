/* eslint-disable prettier/prettier */
import axios from 'axios';

const ID_PATH_KEY = process.env.REACT_APP_FINDID_PATH;

export const findId = async(data) => {
    try {
        const results = await axios.post(`${ID_PATH_KEY}`, data);
            if(results.data.ok === false){
                return { ok: false, payload: '아이디를 찾을 수 없습니다' };
            } else {
                return { ok: true, payload: results.data.result};
            }
    } catch(error){
        // throw `failed to send data to find id: ${error}`;
        console.log(`failed to send data to find id: ${error}`);
        return { ok: false, payload: '시스템 에러' };
    }
};
