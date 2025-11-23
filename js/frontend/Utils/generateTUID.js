const generateRandomNum = (length) => {
  let result = '';
  const characters = '0123456789';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const generateTimestamp = () => {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const lastThreeChars = timestamp.slice(-3);
  return lastThreeChars;
};

export const generateTUID = () => {
  // 현재 날짜와 시간 가져오기
  const currentDate = new Date();

  // 년, 월, 일, 시, 분 가져오기
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const hour = String(currentDate.getHours()).padStart(2, '0');
  const minute = String(currentDate.getMinutes()).padStart(2, '0');
  const second = String(currentDate.getSeconds()).padStart(2, '0');

  // 원하는 형식으로 조합하기
  const dateTimeString = `${year}${month}${day}${hour}${minute}${second}`;

  const TUID = dateTimeString + generateTimestamp() + generateRandomNum(12);

  return TUID;
};
