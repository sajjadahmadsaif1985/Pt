import { City } from '../types';

/**
 * City coordinates database for Pakistan Prayer Times.
 * 1. Nowshera (Khyber Pakhtunkhwa) - Default
 * 2. Peshawar (Khyber Pakhtunkhwa)
 * 3. Charsadda (Khyber Pakhtunkhwa)
 * 4. Mardan (Khyber Pakhtunkhwa)
 * 5. Attock (Punjab)
 */
export const CITIES: City[] = [
  {
    id: 'nowshera',
    nameEn: 'Nowshera',
    nameUr: 'نوشہرہ',
    provinceEn: 'Khyber Pakhtunkhwa',
    provinceUr: 'خیبر پختونخوا',
    latitude: 34.0153,
    longitude: 71.9747,
    elevationMeters: 290
  },
  {
    id: 'peshawar',
    nameEn: 'Peshawar',
    nameUr: 'پشاور',
    provinceEn: 'Khyber Pakhtunkhwa',
    provinceUr: 'خیبر پختونخوا',
    latitude: 34.0151,
    longitude: 71.5249,
    elevationMeters: 359
  },
  {
    id: 'charsadda',
    nameEn: 'Charsadda',
    nameUr: 'چارسدہ',
    provinceEn: 'Khyber Pakhtunkhwa',
    provinceUr: 'خیبر پختونخوا',
    latitude: 34.1482,
    longitude: 71.7406,
    elevationMeters: 295
  },
  {
    id: 'mardan',
    nameEn: 'Mardan',
    nameUr: 'مردان',
    provinceEn: 'Khyber Pakhtunkhwa',
    provinceUr: 'خیبر پختونخوا',
    latitude: 34.1989,
    longitude: 72.0404,
    elevationMeters: 300
  },
  {
    id: 'attock',
    nameEn: 'Attock',
    nameUr: 'اٹک',
    provinceEn: 'Punjab',
    provinceUr: 'پنجاب',
    latitude: 33.7667,
    longitude: 72.3667,
    elevationMeters: 355
  }
];

export const DEFAULT_CITY: City = CITIES[0]; // Nowshera
