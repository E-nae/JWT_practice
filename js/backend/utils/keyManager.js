const dotenv = require('dotenv');
const redis = require('redis');
const crypto = require('crypto');

const client = redis.createClient();


client.on('error', (err) => {
  console.log('Redis Client Error', err);
});

client.connect();

dotenv.config();

// const KEY_LIFETIME = 7 * 24 * 60 * 60; // 일주일(초단위)
const ttl = 14 * 24 * 60 * 60; // 2주를 초 단위로 변환
const generateKey = async () => {
  return crypto.randomBytes(32).toString('hex');
};

const storeKey = async (id) => {
  const newKey = await generateKey();
  await client.setEx(`${id}`, ttl, newKey, (err, res) => {
    if (err) {
      console.log('Error setting key: ', err);
    }
    client.quit();
    return newKey;
  });
};

const getKey = async (id) => {
  let key = await client.get(`${id}`);
  if (!key) {
    key = await storeKey(id);
  }
  return key;
};

const delKey = async (id) => {
  await client.del(`${id}`, (err, response) => {
    if (err) {
      console.error('Error deleting key:', err);
    } else {
      console.log('Key deleted successfully:', response);
    }
    client.quit();
  });
};

const getFpKey = async () => {
  try {
    const key = await client.get('fpKey');
    return key;
  } catch (err) {
    console.log('Error getting fingerprint salt key from redis: ', err);
    return null;
  }
};

module.exports = { storeKey, getKey, delKey, getFpKey };

