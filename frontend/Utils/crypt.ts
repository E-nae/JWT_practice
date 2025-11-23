/* eslint-disable prettier/prettier */
import CryptoJS from 'crypto-js';
import { useCallback } from 'react';
import { fetchKey, fetchFPKey, fetchIdKey } from 'api/common/fetch_Sk';
import { useQueryClient } from '@tanstack/react-query';

export const useEn_Decryption = () => {
  const queryClient = useQueryClient();
  const encrypt = useCallback(
    async (prevEncrypt: any) => {
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
    async (encryptedData: string) => {
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

export const encryptWithKey = async (data: any, id: string): Promise<string | null> => {
  try {
    // 암호화 키 조회
    const key = await fetchIdKey(id);
    let ciphertext: string | null = null;
    if (key) {
      ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
    }
    return ciphertext;
  } catch (error) {
    console.log('failed to encrypt with key: ', error);
    return null;
  }
};

export const decryptWithKey = async (data: string, id: string): Promise<any | null> => {
  try {
    // 복호화 키 조회
    const key = await fetchIdKey(id);
    let decryptedData: any | null = null;

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

export const encryptFP = async (data: any): Promise<string | null> => {
  try {
    // 암호화 키 조회
    const key = await fetchFPKey();
    let ciphertext: string | null = null;
    if (key) {
      ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
    }
    return ciphertext;
  } catch (error) {
    console.log('failed to encrypt with key: ', error);
    return null;
  }
};

