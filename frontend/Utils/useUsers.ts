/* eslint-disable prettier/prettier */
// import { useState } from "react";
// import crypto from 'crypto-js';
// import { getUserData } from 'api/login/getUser';
import { verifyTK } from 'api/verifyTk';
import { useEn_Decryption } from 'utils/crypt';
import { useUser } from 'context/UserContext';

// // 암호화 키 생성
// async function generateKey() {
//     return await window.crypto.subtle.importKey(
//         "raw",
//         new ArrayBuffer(process.env.REACT_APP_CRYPTO_SCRKEY.toString('hex')),
//         "AES-CBC",
//         false,
//         ["encrypt", "decrypt"]
//     );
// }

/** 복호화 */
export const GetU_d = () => {
  const { user, setUser } = useUser();
  const { encrypt, decrypt } = useEn_Decryption();
  const udata = async (): Promise<any | null> => {
    try {
      // const scrKey = process.env.REACT_APP_CRYPTO_SCRKEY;
      // const scrKey = await generateKey();
      // const encryptedData = await getWithExpiry('uid');
      // console.log(scrKey);
      // console.log(encryptedData);
      console.log(user);
      if (user === null) {
        const data = await verifyTK();
        console.log(data);
        const encryptedData = await encrypt(data.payload);
        setUser(encryptedData);
        return data.payload;
      } else {
        // console.log(scrKey);
        // console.log(encryptedData);

        const decrypted = await decrypt(user);
        return decrypted;
      }
    } catch (error) {
      console.log('이용자 데이터 가져오기 실패: ', error);
      return null;
    }
  };
  return udata;
};

// /** 데이터 업데이트 */
// export const updateU_d = async () => {
//   try {
//     const data = await verifyTK();
//     const decrypted = await decryptData(data.payload);
//     return decrypted;
//   } catch (error) {
//     console.log('변경된 이용자 데이터 가져오기 실패: ', error);
//     return null;
//   }
// };

