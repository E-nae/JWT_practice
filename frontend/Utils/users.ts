/* eslint-disable prettier/prettier */
// import { useState } from "react";
// import crypto from 'crypto-js';
// import { getUserData } from 'api/login/getUser';
import { verifyTK } from 'api/login/verifyTk';
import { decryptData } from './crypt';

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

/** 암호화 데이터 저장 */
export const setWithExpiry = async (key: string, value: any, ttl: number): Promise<void> => {
  const now = new Date();

  // `item` is an object which contains the original value
  // as well as the time when it's supposed to expire
  const item = {
    value: value,
    expiry: now.getTime() + ttl //유효기간
  };
  sessionStorage.setItem(key, JSON.stringify(item));
};

/** 암호화 데이터 가져오기 */
const getWithExpiry = async (key: string): Promise<any | null> => {
  const itemStr = sessionStorage.getItem(key);
  // console.log(itemStr);
  // if the item doesn't exist, return null
  if (!itemStr) {
    return null;
  }
  const item = JSON.parse(itemStr);
  const now = new Date();
  // const time = new Date(item.expiry);
  // console.log(time);
  // console.log(now);
  // console.log(getTime())
  // compare the expiry time of the item with the current time
  if (now.getTime() > item.expiry) {
    // If the item is expired, delete the item from storage
    // and return null
    sessionStorage.removeItem(key);
    return null;
  }
  return item.value;
};

/** 복호화 */
export const getU_d = async (): Promise<any | null> => {
  try {
    // const scrKey = process.env.REACT_APP_CRYPTO_SCRKEY;
    // const scrKey = await generateKey();
    const encryptedData = await getWithExpiry('uid');
    // console.log(scrKey);
    // console.log(encryptedData);

    if (encryptedData === null) {
      const data = await verifyTK();
      // console.log(data);
      const decrypted = await decryptData(data);
      return decrypted;
    } else {
      // console.log(scrKey);
      // console.log(encryptedData);

      const decrypted = await decryptData(encryptedData);

      return decrypted;
    }
  } catch (error) {
    console.log('이용자 데이터 가져오기 실패: ', error);
    return null;
  }
};

/** 데이터 업데이트 */
export const updateU_d = async (): Promise<any | null> => {
  try {
    const data = await verifyTK();
    const decrypted = await decryptData(data);
    return decrypted;
  } catch (error) {
    console.log('변경된 이용자 데이터 가져오기 실패: ', error);
    return null;
  }
};

