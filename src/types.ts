export interface City {
  id: string;
  nameEn: string;
  nameUr: string;
  provinceEn: string;
  provinceUr: string;
  latitude: number;
  longitude: number;
  elevationMeters?: number;
}

export type PrayerKey = 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export interface PrayerTimesResult {
  date: string; // YYYY-MM-DD
  fajr: string; // HH:mm (24h)
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  hijriDay: number;
  hijriMonthNameEn: string;
  hijriMonthNameUr: string;
  hijriYear: number;
  dateObj: Date;
}

export interface CalculationSettings {
  methodName: string;
  methodNameUrdu: string;
  fajrAngle: number;
  ishaAngle: number;
  asrMethod: 'Hanafi' | 'Shafi';
  asrShadowFactor: number;
  timeZoneOffsetHours: number;
}

export interface HijriDate {
  year: number;
  month: number;
  day: number;
  monthNameEn: string;
  monthNameUr: string;
}
