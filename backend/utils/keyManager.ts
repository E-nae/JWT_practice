import * as dotenv from 'dotenv';
import { createClient } from 'redis';
import * as crypto from 'crypto';

const client = createClient();

client.on('error', (err) => {
  console.log('Redis Client Error', err);
});

client.connect();

dotenv.config();

// const KEY_LIFETIME = 7 * 24 * 60 * 60; // 일주일(초단위)
const ttl = 14 * 24 * 60 * 60; // 2주를 초 단위로 변환

const generateKey = async (): Promise<string> => {
  return crypto.randomBytes(32).toString('hex');
};

export const storeKey = async (id: string): Promise<string | null> => {
  const newKey = await generateKey();
  await client.setEx(`${id}`, ttl, newKey);
  return newKey;
};

export const getKey = async (id: string): Promise<string | null> => {
  let key = await client.get(`${id}`);
  if (!key) {
    key = await storeKey(id);
  }
  return key;
};

export const delKey = async (id: string): Promise<void> => {
  await client.del(`${id}`);
};

export const getFpKey = async (): Promise<string | null> => {
  try {
    const key = await client.get('fpKey');
    return key;
  } catch (err) {
    console.log('Error getting fingerprint salt key from redis: ', err);
    return null;
  }
};

