import { HijriDate } from '../types';

const ISLAMIC_MONTHS_EN = [
  'Muharram', 'Safar', "Rabi' al-Awwal", "Rabi' al-Thani",
  'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', "Sha'ban",
  'Ramadan', 'Shawwal', "Dhu al-Qi'dah", 'Dhu al-Hijjah'
];

const ISLAMIC_MONTHS_UR = [
  'محرم الحرام', 'صفر المظفر', 'ربیع الاول', 'ربیع الثانی',
  'جمادی الاول', 'جمادی الثانی', 'رجب المرجب', 'شعبان المعظم',
  'رمضان المبارک', 'شوال المکرم', 'ذوالقعدہ', 'ذوالحجہ'
];

export function gregorianToHijri(date: Date, dayAdjustment: number = 0): HijriDate {
  let y = date.getFullYear();
  let m = date.getMonth() + 1;
  const d = date.getDate() + dayAdjustment;

  if (m < 3) {
    y -= 1;
    m += 12;
  }

  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + b - 1524.5;

  const l = Math.floor(jd - 1948440 + 10632);
  const n = Math.floor((l - 1) / 10631);
  const l1 = l - 10631 * n + 354;
  const j = (Math.floor((10985 - l1) / 5316)) * (Math.floor((50 * l1) / 17719)) +
            (Math.floor(l1 / 5670)) * (Math.floor((43 * l1) / 15238));
  const l2 = l1 - (Math.floor((30 - j) / 15)) * (Math.floor((17719 * j) / 50)) -
            (Math.floor(j / 16)) * (Math.floor((15238 * j) / 43)) + 29;
  const monthIndex = Math.floor((24 * l2) / 709);
  const day = l2 - Math.floor((709 * monthIndex) / 24);
  const year = 30 * n + j - 30;

  const safeMonthIndex = Math.max(0, Math.min(11, monthIndex - 1));
  const safeDay = Math.max(1, Math.min(30, day));

  return {
    year,
    month: safeMonthIndex + 1,
    day: safeDay,
    monthNameEn: ISLAMIC_MONTHS_EN[safeMonthIndex],
    monthNameUr: ISLAMIC_MONTHS_UR[safeMonthIndex]
  };
}
