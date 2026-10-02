import React from 'react';
import { City, PrayerTimesResult, PrayerKey } from '../types';
import { PrayerCard } from './PrayerCard';
import { formatTimeDisplay } from '../calculator/prayerTimeCalculator';
import {
  MapPin,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  Sparkles
} from 'lucide-react';

interface HomeScreenProps {
  selectedCity: City;
  selectedDate: Date;
  prayerTimes: PrayerTimesResult;
  currentPrayer: PrayerKey | null;
  nextPrayer: PrayerKey | null;
  nextPrayerTime: string | null;
  countdown: string;
  use24Hour: boolean;
  isUrdu: boolean;
  onOpenCityDialog: () => void;
  onPreviousDay: () => void;
  onToday: () => void;
  onNextDay: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  selectedCity,
  selectedDate,
  prayerTimes,
  currentPrayer,
  nextPrayer,
  nextPrayerTime,
  countdown,
  use24Hour,
  isUrdu,
  onOpenCityDialog,
  onPreviousDay,
  onToday,
  onNextDay
}) => {
  const isToday =
    new Date().toDateString() === selectedDate.toDateString();

  const formattedDate = selectedDate.toLocaleDateString(
    isUrdu ? 'ur-PK' : 'en-US',
    {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
  );

  const getPrayerName = (key: PrayerKey | null) => {
    if (!key) return '--';
    const names: Record<PrayerKey, { en: string; ur: string }> = {
      fajr: { en: 'Fajr', ur: 'فجر' },
      sunrise: { en: 'Sunrise', ur: 'طلوع آفتاب' },
      dhuhr: { en: 'Dhuhr', ur: 'ظہر' },
      asr: { en: 'Asr', ur: 'عصر' },
      maghrib: { en: 'Maghrib', ur: 'مغرب' },
      isha: { en: 'Isha', ur: 'عشاء' }
    };
    return isUrdu ? names[key].ur : names[key].en;
  };

  return (
    <div className="space-y-4" dir={isUrdu ? 'rtl' : 'ltr'}>
      {/* Top Header / City Selector Bar */}
      <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-gray-200/80 shadow-xs">
        <div>
          <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block">
            {isUrdu ? 'منتخب شہر' : 'Selected Location'}
          </span>
          <button
            id="city-picker-trigger-btn"
            onClick={onOpenCityDialog}
            className="flex items-center gap-1.5 text-base sm:text-lg font-bold text-gray-900 hover:text-emerald-700 transition-colors group mt-0.5"
          >
            <MapPin size={18} className="text-emerald-700 group-hover:scale-110 transition-transform" />
            <span>{isUrdu ? selectedCity.nameUr : selectedCity.nameEn}</span>
            <span className="text-xs text-gray-500 font-normal">
              ({isUrdu ? selectedCity.provinceUr : selectedCity.provinceEn})
            </span>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full ml-1">
              {isUrdu ? 'تبدیل' : 'Change'}
            </span>
          </button>
        </div>

        <div className="text-right">
          <span className="text-xs font-medium text-gray-500 block">
            {isUrdu ? 'طریقہ حساب' : 'Method'}
          </span>
          <span className="text-xs font-bold text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
            {isUrdu ? 'جامعہ بنوری ٹاؤن، کراچی' : 'Univ. Karachi (18°)'}
          </span>
        </div>
      </div>

      {/* Hero Prayer Status & Countdown Card */}
      <div
        id="prayer-hero-banner"
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-800 via-emerald-900 to-emerald-950 text-white p-5 sm:p-6 shadow-md border border-emerald-700/40"
      >
        {/* Subtle decorative Islamic arch geometric overlay */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-medium text-emerald-200/80 block">
                {isUrdu ? 'موجودہ نماز کا وقت' : 'Current Prayer'}
              </span>
              <div className="text-2xl font-black text-amber-300 tracking-tight mt-0.5 flex items-center gap-2">
                <span>{getPrayerName(currentPrayer)}</span>
                <span className="text-xs bg-amber-400/20 text-amber-300 font-medium px-2 py-0.5 rounded-full border border-amber-400/30">
                  {isUrdu ? 'جاری' : 'Active'}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-medium text-emerald-200/80 block">
                {isUrdu ? 'اگلی نماز' : 'Next Prayer'}
              </span>
              <div className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
                {getPrayerName(nextPrayer)}
              </div>
              {nextPrayerTime && (
                <div className="text-xs text-emerald-200 font-mono font-semibold">
                  {formatTimeDisplay(nextPrayerTime, use24Hour)}
                </div>
              )}
            </div>
          </div>

          <div className="h-px bg-white/10 my-1" />

          {/* Live Countdown Display */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-100/90 text-sm">
              <Clock size={16} className="text-amber-400" />
              <span>
                {isUrdu ? 'اگلی نماز میں باقی وقت:' : 'Next prayer in:'}
              </span>
            </div>
            <div
              id="live-countdown-ticker"
              className="text-2xl sm:text-3xl font-black font-mono tracking-wider text-amber-300"
            >
              {countdown}
            </div>
          </div>
        </div>
      </div>

      {/* Date & Hijri Display + Navigation (< Previous Day | Today | Next Day >) */}
      <div
        id="date-navigation-panel"
        className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs space-y-3"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-center sm:text-left">
          <div>
            <div className="font-bold text-gray-900 text-base sm:text-lg flex items-center justify-center sm:justify-start gap-1.5">
              <Calendar size={18} className="text-emerald-800" />
              <span>{formattedDate}</span>
            </div>
            <div className="text-xs sm:text-sm font-semibold text-emerald-700 mt-0.5">
              {isUrdu
                ? `${prayerTimes.hijriDay} ${prayerTimes.hijriMonthNameUr} ${prayerTimes.hijriYear} ھ`
                : `${prayerTimes.hijriDay} ${prayerTimes.hijriMonthNameEn} ${prayerTimes.hijriYear} AH`}
            </div>
          </div>

          {isToday && (
            <span className="inline-flex items-center justify-center text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 self-center">
              <Sparkles size={12} className="mr-1" />
              {isUrdu ? 'آج' : "Today's Schedule"}
            </span>
          )}
        </div>

        {/* Previous Day | Today | Next Day Buttons */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100">
          <button
            id="prev-day-btn"
            onClick={onPreviousDay}
            className="flex items-center justify-center gap-1 py-2 px-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-emerald-50 hover:border-emerald-300 text-xs sm:text-sm font-semibold transition-colors"
          >
            <ChevronLeft size={16} />
            <span>{isUrdu ? 'پچھلا دن' : 'Previous Day'}</span>
          </button>

          <button
            id="today-btn"
            onClick={onToday}
            className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs ${
              isToday
                ? 'bg-emerald-800 text-white'
                : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
            }`}
          >
            {isUrdu ? 'آج' : 'Today'}
          </button>

          <button
            id="next-day-btn"
            onClick={onNextDay}
            className="flex items-center justify-center gap-1 py-2 px-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-emerald-50 hover:border-emerald-300 text-xs sm:text-sm font-semibold transition-colors"
          >
            <span>{isUrdu ? 'اگلا دن' : 'Next Day'}</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Prayer Time Cards Grid */}
      <div className="space-y-2.5">
        <PrayerCard
          id="fajr"
          nameEn="Fajr"
          nameUr="فجر"
          time24={prayerTimes.fajr}
          use24Hour={use24Hour}
          isActive={isToday && currentPrayer === 'fajr'}
          isNext={isToday && nextPrayer === 'fajr'}
          isUrdu={isUrdu}
        />

        <PrayerCard
          id="sunrise"
          nameEn="Sunrise"
          nameUr="طلوع آفتاب"
          time24={prayerTimes.sunrise}
          use24Hour={use24Hour}
          isActive={isToday && currentPrayer === 'sunrise'}
          isNext={isToday && nextPrayer === 'sunrise'}
          isUrdu={isUrdu}
          isSunrise={true}
        />

        <PrayerCard
          id="dhuhr"
          nameEn="Dhuhr"
          nameUr="ظہر"
          time24={prayerTimes.dhuhr}
          use24Hour={use24Hour}
          isActive={isToday && currentPrayer === 'dhuhr'}
          isNext={isToday && nextPrayer === 'dhuhr'}
          isUrdu={isUrdu}
        />

        <PrayerCard
          id="asr"
          nameEn="Asr (Hanafi)"
          nameUr="عصر (حنفی)"
          time24={prayerTimes.asr}
          use24Hour={use24Hour}
          isActive={isToday && currentPrayer === 'asr'}
          isNext={isToday && nextPrayer === 'asr'}
          isUrdu={isUrdu}
        />

        <PrayerCard
          id="maghrib"
          nameEn="Maghrib"
          nameUr="مغرب"
          time24={prayerTimes.maghrib}
          use24Hour={use24Hour}
          isActive={isToday && currentPrayer === 'maghrib'}
          isNext={isToday && nextPrayer === 'maghrib'}
          isUrdu={isUrdu}
        />

        <PrayerCard
          id="isha"
          nameEn="Isha"
          nameUr="عشاء"
          time24={prayerTimes.isha}
          use24Hour={use24Hour}
          isActive={isToday && currentPrayer === 'isha'}
          isNext={isToday && nextPrayer === 'isha'}
          isUrdu={isUrdu}
        />
      </div>
    </div>
  );
};
