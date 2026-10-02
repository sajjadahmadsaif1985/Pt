import { City, CalculationSettings, PrayerTimesResult } from '../types';
import { gregorianToHijri } from './hijriCalculator';

export const KARACHI_SETTINGS: CalculationSettings = {
  methodName: 'University of Islamic Sciences, Karachi',
  methodNameUrdu: 'جامعہ علوم اسلامیہ علامہ بنوری ٹاؤن، کراچی',
  fajrAngle: 18.0,
  ishaAngle: 18.0,
  asrMethod: 'Hanafi',
  asrShadowFactor: 2.0,
  timeZoneOffsetHours: 5.0
};

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180.0;
}

function toDegrees(rad: number): number {
  return (rad * 180.0) / Math.PI;
}

function fixAngle(angle: number): number {
  let a = angle - 360.0 * Math.floor(angle / 360.0);
  if (a < 0.0) a += 360.0;
  return a;
}

function fixHour(hour: number): number {
  let h = hour - 24.0 * Math.floor(hour / 24.0);
  if (h < 0.0) h += 24.0;
  return h;
}

function formatHours(hours: number): string {
  const totalSeconds = Math.round(hours * 3600);
  const normalizedSeconds = ((totalSeconds % 86400) + 86400) % 86400;
  const h = Math.floor(normalizedSeconds / 3600);
  const m = Math.floor((normalizedSeconds % 3600) / 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

export function formatTimeDisplay(timeStr24: string, use24Hour: boolean): string {
  if (!timeStr24) return '--:--';
  const [hStr, mStr] = timeStr24.split(':');
  let h = parseInt(hStr, 10);
  const m = mStr;
  if (isNaN(h)) return '--:--';

  if (use24Hour) {
    return `${h.toString().padStart(2, '0')}:${m}`;
  }

  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  return `${h.toString().padStart(2, '0')}:${m} ${ampm}`;
}

/**
 * Calculates prayer times for a city on a specific date using
 * the University of Islamic Sciences, Karachi method.
 */
export function calculatePrayerTimes(
  city: City,
  date: Date,
  settings: CalculationSettings = KARACHI_SETTINGS
): PrayerTimesResult {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const lat = city.latitude;
  const lng = city.longitude;
  const tz = settings.timeZoneOffsetHours;

  // Step 1: Julian Day calculation
  const d =
    367.0 * year -
    Math.floor((7.0 * (year + Math.floor((month + 9.0) / 12.0))) / 4.0) +
    Math.floor((275.0 * month) / 9.0) +
    day -
    730531.5;

  // Step 2: Solar coordinates
  const meanLongitude = fixAngle(280.461 + 0.9856474 * d);
  const meanAnomaly = fixAngle(357.528 + 0.9856003 * d);
  const eclipticLongitude = fixAngle(
    meanLongitude +
      1.915 * Math.sin(toRadians(meanAnomaly)) +
      0.02 * Math.sin(toRadians(2 * meanAnomaly))
  );
  const obliquity = 23.439 - 0.0000004 * d;

  // Right Ascension and Declination
  const alphaRad = Math.atan2(
    Math.cos(toRadians(obliquity)) * Math.sin(toRadians(eclipticLongitude)),
    Math.cos(toRadians(eclipticLongitude))
  );
  const alphaHours = fixAngle(toDegrees(alphaRad)) / 15.0;
  const deltaRad = Math.asin(
    Math.sin(toRadians(obliquity)) * Math.sin(toRadians(eclipticLongitude))
  );
  const deltaDeg = toDegrees(deltaRad);

  // Equation of Time (hours)
  const equationOfTime = meanLongitude / 15.0 - alphaHours;

  // Solar Noon (Transit in hours)
  const transit = fixHour(12.0 + tz - lng / 15.0 - equationOfTime);

  // Helper to compute hour angle for a given solar altitude angle
  function computeHourAngle(altitudeDeg: number): number | null {
    const cosH =
      (Math.sin(toRadians(altitudeDeg)) -
        Math.sin(toRadians(lat)) * Math.sin(toRadians(deltaDeg))) /
      (Math.cos(toRadians(lat)) * Math.cos(toRadians(deltaDeg)));
    if (cosH >= -1.0 && cosH <= 1.0) {
      return toDegrees(Math.acos(cosH)) / 15.0;
    }
    return null;
  }

  // 1. Sunrise and Sunset (standard atmospheric refraction -0.8333°)
  const hSun = computeHourAngle(-0.8333) ?? 6.0;
  const sunriseHours = fixHour(transit - hSun);
  const sunsetHours = fixHour(transit + hSun);

  // 2. Fajr (Karachi: 18° depression)
  const hFajr = computeHourAngle(-settings.fajrAngle) ?? hSun + 1.25;
  const fajrHours = fixHour(transit - hFajr);

  // 3. Dhuhr (Solar noon + 1 minute safe margin)
  const dhuhrHours = fixHour(transit + 1.0 / 60.0);

  // 4. Asr (Hanafi method: shadow length = 2 * height + noon shadow)
  const asrFactor = settings.asrShadowFactor;
  const zenithDiff = Math.abs(lat - deltaDeg);
  const asrAltDeg = toDegrees(
    Math.atan(1.0 / (asrFactor + Math.tan(toRadians(zenithDiff))))
  );
  const hAsr = computeHourAngle(asrAltDeg) ?? 3.5;
  const asrHours = fixHour(transit + hAsr);

  // 5. Maghrib (Sunset)
  const maghribHours = sunsetHours;

  // 6. Isha (Karachi: 18° depression)
  const hIsha = computeHourAngle(-settings.ishaAngle) ?? hSun + 1.25;
  const ishaHours = fixHour(transit + hIsha);

  // Hijri Date
  const hijri = gregorianToHijri(date);

  const yearStr = year.toString();
  const monthStr = month.toString().padStart(2, '0');
  const dayStr = day.toString().padStart(2, '0');

  return {
    date: `${yearStr}-${monthStr}-${dayStr}`,
    fajr: formatHours(fajrHours),
    sunrise: formatHours(sunriseHours),
    dhuhr: formatHours(dhuhrHours),
    asr: formatHours(asrHours),
    maghrib: formatHours(maghribHours),
    isha: formatHours(ishaHours),
    hijriDay: hijri.day,
    hijriMonthNameEn: hijri.monthNameEn,
    hijriMonthNameUr: hijri.monthNameUr,
    hijriYear: hijri.year,
    dateObj: date
  };
}

/**
 * Calculates prayer times for an entire month.
 */
export function calculateMonthPrayerTimes(
  city: City,
  year: number,
  monthIndex0: number
): PrayerTimesResult[] {
  const daysInMonth = new Date(year, monthIndex0 + 1, 0).getDate();
  const results: PrayerTimesResult[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const dt = new Date(year, monthIndex0, d, 12, 0, 0);
    results.push(calculatePrayerTimes(city, dt));
  }
  return results;
}
