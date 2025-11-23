export const getCurrentDateTime = (): string => {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

interface DateInfo {
  year: number;
  month: string;
  day: string;
  full: string;
}

export const getCurrentDate = (date?: Date): DateInfo => {
  let now = date ?? new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  const currentDate: DateInfo = {
    year,
    month: `${year}-${month}`,
    day: `${year}-${month}-${day}`,
    full: `${year}${month}${day}${hours}${minutes}${seconds}`
  };
  return currentDate;
};

export const getCurrentMonth = (date?: Date): string => {
  let now = date ?? new Date();
  // console.log('date');
  // console.log(date);

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');

  return `${year}-${month}`;
};

interface WeekDays {
  start: string;
  end: string;
}

export const getCurrentWeekDates = (): WeekDays => {
  let offset = 1000 * 60 * 60 * 9; // 9시간 격차(한국 시간)

  const today = new Date(Date.now() + offset);
  const currentDay = today.getDay();

  // console.log('currentDay: ');
  // console.log(currentDay);
  const diff = today.getDate() - currentDay + (currentDay === 0 ? -6 : 1);

  const monday = new Date(today.setDate(diff));
  const week: Date[] = [];

  for (let i = 0; i < 7; i++) {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    week.push(day);
  }

  const weekDays: WeekDays = {
    start: week[0].toISOString().split('T')[0],
    end: week[6].toISOString().split('T')[0]
  };
  // console.log('weekDays: ');
  // console.log(weekDays);

  return weekDays;
};

//.toLocaleString('en-US', { timeZone: 'Asia/Seoul' });

