/* eslint-disable prettier/prettier */
import CryptoJS from 'crypto-js';
import { useCallback } from 'react';
import { fetchKey, fetchFPKey, fetchIdKey } from 'api/common/fetch_Sk';
import { useQueryClient } from '@tanstack/react-query';

export const useEn_Decryption = () => {
  const queryClient = useQueryClient();
  const encrypt = useCallback(
    async (prevEncrypt) => {
      try {
        const key = await queryClient.fetchQuery({
          queryKey: ['getSk'],
          queryFn: async () => await fetchKey(),
          staleTime: 1000 * 60 * 5,
          gcTime: 1000 * 60 * 60
        });
        // const key = await fetchKey('encrypt', prevEncrypt?.ID);
        if (!key) return null;
        const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(prevEncrypt), key).toString();
        return ciphertext;
      } catch (error) {
        console.log('failed to get key for encrypt: ', error);
        return null;
      }
    },
    [queryClient]
  );

  const decrypt = useCallback(
    async (encryptedData) => {
      try {
        // 복호화 키 조회
        const key = await queryClient.fetchQuery({
          queryKey: ['getSk'],
          queryFn: async () => await fetchKey(null),
          staleTime: Infinity,
          gcTime: 1000 * 60 * 60
        });
        // const key = await fetchKey('decrypt', encryptedData?.ID);
        if (!key) return null;

        const bytes = CryptoJS.AES.decrypt(encryptedData, key);
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        return decryptedData;
      } catch (error) {
        console.log('failed to get key for decrypt: ', error);
        return null;
      }
    },
    [queryClient]
  );

  return { encrypt, decrypt };
};

/** 암호화 데이터 저장 */
export const setWithExpiry = async (key, value, ttl) => {
  const now = new Date();

  // `item` is an object which contains the original value
  // as well as the time when it's supposed to expire
  const item = {
    value: value,
    expiry: now.getTime() + ttl //유효기간
  };
  sessionStorage.setItem(key, JSON.stringify(item));
};

export const encryptWithKey = async (data, id) => {
  try {
    // 암호화 키 조회
    const key = await fetchIdKey(id);
    let ciphertext = null;
    if (key) {
      ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
    }
    return ciphertext;
  } catch (error) {
    console.log('failed to encrypt with key: ', error);
    return null;
  }
};

export const decryptWithKey = async (data, id) => {
  try {
    // 복호화 키 조회
    const key = await fetchIdKey(id);
    let decryptedData = null;

    if (key) {
      const bytes = CryptoJS.AES.decrypt(data, key);
      decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    }
    return decryptedData;
  } catch (error) {
    console.log('failed to decrypt with key: ', error);
    return null;
  }
};

export const encryptFP = async (data) => {
  try {
    // 암호화 키 조회
    const key = await fetchFPKey();
    let ciphertext = null;
    if (key) {
      ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
    }
    return ciphertext;
  } catch (error) {
    console.log('failed to encrypt with key: ', error);
    return null;
  }
};

/** 암호화 데이터 가져오기 */
// const getWithExpiry = async (key) => {
//   const itemStr = sessionStorage.getItem(key);
//   // console.log(itemStr);
//   // if the item doesn't exist, return null
//   if (!itemStr) {
//     return null;
//   }
//   const item = JSON.parse(itemStr);
//   const now = new Date();
//   // const time = new Date(item.expiry);
//   // console.log(time);
//   // console.log(now);
//   // console.log(getTime())
//   // compare the expiry time of the item with the current time
//   if (now.getTime() > item.expiry) {
//     // If the item is expired, delete the item from storage
//     // and return null
//     sessionStorage.removeItem(key);
//     return null;
//   }
//   return item.value;
// };

// 데이터 암호화
// const encryptedData = await encryptData(plaintext, key, iv);

// // 암호화된 데이터를 복호화
// const decryptedData = await decryptData(encryptedData, key, iv);

// console.log('Decrypted data:', decryptedData); // 출력: Hello, world!
