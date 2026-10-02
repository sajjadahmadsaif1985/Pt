import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { CITIES, DEFAULT_CITY } from './data/cities';
import { City, PrayerKey } from './types';
import { calculatePrayerTimes } from './calculator/prayerTimeCalculator';
import { HomeScreen } from './components/HomeScreen';
import { MonthlyTimetableScreen } from './components/MonthlyTimetableScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { AndroidProjectViewer } from './components/AndroidProjectViewer';
import { CityDialog } from './components/CityDialog';
import {
  Home,
  CalendarDays,
  Settings as SettingsIcon,
  Code2,
  Smartphone
} from 'lucide-react';

export default function App() {
  // Local storage persisted state
  const [selectedCity, setSelectedCity] = useState<City>(() => {
    try {
      const saved = localStorage.getItem('pk_prayer_city_id');
      if (saved) {
        const found = CITIES.find((c) => c.id === saved);
        if (found) return found;
      }
    } catch {
      // fallback
    }
    return DEFAULT_CITY;
  });

  const [use24Hour, setUse24Hour] = useState<boolean>(() => {
    try {
      return localStorage.getItem('pk_prayer_24h') === 'true';
    } catch {
      return false;
    }
  });

  const [isUrdu, setIsUrdu] = useState<boolean>(() => {
    try {
      return localStorage.getItem('pk_prayer_urdu') === 'true';
    } catch {
      return false;
    }
  });

  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const [activeTab, setActiveTab] = useState<'home' | 'monthly' | 'settings' | 'android'>('home');
  const [showCityDialog, setShowCityDialog] = useState<boolean>(false);
  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(true);

  // Countdown state
  const [countdown, setCountdown] = useState<string>('--:--:--');
  const [currentPrayer, setCurrentPrayer] = useState<PrayerKey | null>(null);
  const [nextPrayer, setNextPrayer] = useState<PrayerKey | null>(null);
  const [nextPrayerTime, setNextPrayerTime] = useState<string | null>(null);

  // Save changes to localStorage
  const handleSelectCity = useCallback((city: City) => {
    setSelectedCity(city);
    try {
      localStorage.setItem('pk_prayer_city_id', city.id);
    } catch {
      // ignore
    }
  }, []);

  const handleToggle24Hour = useCallback((val: boolean) => {
    setUse24Hour(val);
    try {
      localStorage.setItem('pk_prayer_24h', val ? 'true' : 'false');
    } catch {
      // ignore
    }
  }, []);

  const handleToggleUrdu = useCallback((val: boolean) => {
    setIsUrdu(val);
    try {
      localStorage.setItem('pk_prayer_urdu', val ? 'true' : 'false');
    } catch {
      // ignore
    }
  }, []);

  // Calculate prayer times for selected date
  const prayerTimes = useMemo(() => {
    return calculatePrayerTimes(selectedCity, selectedDate);
  }, [selectedCity, selectedDate]);

  // Date Navigation
  const handlePreviousDay = () => {
    setSelectedDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 1);
      return d;
    });
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  const handleNextDay = () => {
    setSelectedDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 1);
      return d;
    });
  };

  // Ticker: updates countdown and current/next prayer every second
  useEffect(() => {
    const updateTicker = () => {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      // If user is viewing another date, base countdown on today's actual prayer times
      const todayTimes = calculatePrayerTimes(selectedCity, today);

      const toMinutes = (timeStr: string) => {
        const [h, m] = timeStr.split(':').map(Number);
        return h * 60 + m;
      };

      const nowMinutes = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;

      const fMin = toMinutes(todayTimes.fajr);
      const sMin = toMinutes(todayTimes.sunrise);
      const dMin = toMinutes(todayTimes.dhuhr);
      const aMin = toMinutes(todayTimes.asr);
      const mMin = toMinutes(todayTimes.maghrib);
      const iMin = toMinutes(todayTimes.isha);

      let cur: PrayerKey = 'isha';
      let nxt: PrayerKey = 'fajr';
      let targetDate = new Date(today);

      if (nowMinutes < fMin) {
        cur = 'isha';
        nxt = 'fajr';
        const [fh, fm] = todayTimes.fajr.split(':').map(Number);
        targetDate.setHours(fh, fm, 0, 0);
      } else if (nowMinutes < sMin) {
        cur = 'fajr';
        nxt = 'sunrise';
        const [sh, sm] = todayTimes.sunrise.split(':').map(Number);
        targetDate.setHours(sh, sm, 0, 0);
      } else if (nowMinutes < dMin) {
        cur = 'sunrise';
        nxt = 'dhuhr';
        const [dh, dm] = todayTimes.dhuhr.split(':').map(Number);
        targetDate.setHours(dh, dm, 0, 0);
      } else if (nowMinutes < aMin) {
        cur = 'dhuhr';
        nxt = 'asr';
        const [ah, am] = todayTimes.asr.split(':').map(Number);
        targetDate.setHours(ah, am, 0, 0);
      } else if (nowMinutes < mMin) {
        cur = 'asr';
        nxt = 'maghrib';
        const [mh, mm] = todayTimes.maghrib.split(':').map(Number);
        targetDate.setHours(mh, mm, 0, 0);
      } else if (nowMinutes < iMin) {
        cur = 'maghrib';
        nxt = 'isha';
        const [ih, im] = todayTimes.isha.split(':').map(Number);
        targetDate.setHours(ih, im, 0, 0);
      } else {
        cur = 'isha';
        nxt = 'fajr';
        // tomorrow fajr
        targetDate.setDate(targetDate.getDate() + 1);
        const tomorrowTimes = calculatePrayerTimes(selectedCity, targetDate);
        const [fh, fm] = tomorrowTimes.fajr.split(':').map(Number);
        targetDate.setHours(fh, fm, 0, 0);
      }

      setCurrentPrayer(cur);
      setNextPrayer(nxt);

      const targetTimeString =
        nxt === 'fajr'
          ? nowMinutes < fMin
            ? todayTimes.fajr
            : calculatePrayerTimes(selectedCity, new Date(today.getTime() + 86400000)).fajr
          : nxt === 'sunrise'
          ? todayTimes.sunrise
          : nxt === 'dhuhr'
          ? todayTimes.dhuhr
          : nxt === 'asr'
          ? todayTimes.asr
          : nxt === 'maghrib'
          ? todayTimes.maghrib
          : todayTimes.isha;

      setNextPrayerTime(targetTimeString);

      const diffMs = Math.max(0, targetDate.getTime() - now.getTime());
      const totalSec = Math.floor(diffMs / 1000);
      const hrs = Math.floor(totalSec / 3600);
      const mins = Math.floor((totalSec % 3600) / 60);
      const secs = totalSec % 60;

      setCountdown(
        `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs
          .toString()
          .padStart(2, '0')}`
      );
    };

    updateTicker();
    const interval = setInterval(updateTicker, 1000);
    return () => clearInterval(interval);
  }, [selectedCity]);

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col items-center p-2 sm:p-4 md:p-6 text-gray-800">
      {/* Top Desktop Controls Bar */}
      <div className="w-full max-w-md sm:max-w-2xl mb-3 flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-800 text-amber-300 flex items-center justify-center font-bold text-xs shadow-xs">
            PK
          </div>
          <span className="font-bold text-sm text-gray-800 tracking-tight">
            Pakistan Prayer Times
          </span>
          <span className="hidden sm:inline-block text-[11px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
            Native Android 14+
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPhoneFrame(!isPhoneFrame)}
            className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-2xs"
            title="Toggle Android Device Frame view"
          >
            <Smartphone size={14} className={isPhoneFrame ? 'text-emerald-700' : 'text-gray-500'} />
            <span className="hidden sm:inline">{isPhoneFrame ? 'Phone Frame' : 'Full Width'}</span>
          </button>

          <button
            onClick={() => setActiveTab('android')}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all shadow-2xs ${
              activeTab === 'android'
                ? 'bg-amber-400 text-emerald-950 font-bold'
                : 'bg-emerald-800 text-white hover:bg-emerald-700'
            }`}
          >
            <Code2 size={14} />
            <span>{isUrdu ? 'اینڈرائیڈ کوڈ' : 'Android Studio APK'}</span>
          </button>
        </div>
      </div>

      {/* Main Container / Mobile Device Viewport */}
      <div
        className={`w-full transition-all duration-300 ${
          isPhoneFrame
            ? 'max-w-[420px] rounded-[36px] shadow-2xl border-[8px] border-stone-800 bg-white overflow-hidden ring-1 ring-black/10'
            : 'max-w-2xl rounded-2xl shadow-md border border-gray-200 bg-white overflow-hidden'
        }`}
      >
        {/* Android Status Bar Mockup */}
        <div className="bg-emerald-900 text-white px-5 py-2 flex items-center justify-between text-xs font-mono select-none">
          <span>
            {new Date().toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            })}
          </span>
          <div className="flex items-center gap-1.5 text-[10px]">
            <span>4G</span>
            <span>100%</span>
          </div>
        </div>

        {/* Top App Bar Header */}
        <div className="bg-emerald-800 text-white px-4 py-3 flex items-center justify-between border-b border-emerald-700/50">
          <div>
            <h1 className="font-bold text-base sm:text-lg leading-tight">
              {isUrdu ? 'پاکستان نماز کے اوقات' : 'Pakistan Prayer Times'}
            </h1>
            <p className="text-[11px] text-amber-300 font-medium">
              {isUrdu ? 'جامعہ کراچی طریقہ • حنفی عصر' : 'Univ. Karachi Method • Hanafi Asr'}
            </p>
          </div>

          <button
            id="open-city-dialog-top-btn"
            onClick={() => setShowCityDialog(true)}
            className="flex items-center gap-1 text-xs font-semibold bg-white/15 hover:bg-white/25 px-2.5 py-1.5 rounded-full transition-colors text-white border border-white/20"
          >
            <span>{isUrdu ? selectedCity.nameUr : selectedCity.nameEn}</span>
          </button>
        </div>

        {/* Screen Content Body */}
        <div className="p-4 bg-stone-50/60 min-h-[520px] max-h-[640px] overflow-y-auto">
          {activeTab === 'home' && (
            <HomeScreen
              selectedCity={selectedCity}
              selectedDate={selectedDate}
              prayerTimes={prayerTimes}
              currentPrayer={currentPrayer}
              nextPrayer={nextPrayer}
              nextPrayerTime={nextPrayerTime}
              countdown={countdown}
              use24Hour={use24Hour}
              isUrdu={isUrdu}
              onOpenCityDialog={() => setShowCityDialog(true)}
              onPreviousDay={handlePreviousDay}
              onToday={handleToday}
              onNextDay={handleNextDay}
            />
          )}

          {activeTab === 'monthly' && (
            <MonthlyTimetableScreen
              selectedCity={selectedCity}
              use24Hour={use24Hour}
              isUrdu={isUrdu}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsScreen
              selectedCity={selectedCity}
              use24Hour={use24Hour}
              isUrdu={isUrdu}
              onOpenCityDialog={() => setShowCityDialog(true)}
              onToggle24Hour={handleToggle24Hour}
              onToggleUrdu={handleToggleUrdu}
            />
          )}

          {activeTab === 'android' && <AndroidProjectViewer isUrdu={isUrdu} />}
        </div>

        {/* Android Material 3 Bottom Navigation Bar */}
        <div className="bg-white border-t border-gray-200 px-3 py-2 flex items-center justify-around text-center select-none">
          <button
            id="tab-home-btn"
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors ${
              activeTab === 'home'
                ? 'text-emerald-800 font-bold'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <div
              className={`p-1 rounded-full ${
                activeTab === 'home' ? 'bg-emerald-100' : ''
              }`}
            >
              <Home size={18} />
            </div>
            <span className="text-[11px]">{isUrdu ? 'صفحہ اول' : 'Home'}</span>
          </button>

          <button
            id="tab-monthly-btn"
            onClick={() => setActiveTab('monthly')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors ${
              activeTab === 'monthly'
                ? 'text-emerald-800 font-bold'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <div
              className={`p-1 rounded-full ${
                activeTab === 'monthly' ? 'bg-emerald-100' : ''
              }`}
            >
              <CalendarDays size={18} />
            </div>
            <span className="text-[11px]">
              {isUrdu ? 'ماہانہ اوقات' : 'Monthly'}
            </span>
          </button>

          <button
            id="tab-settings-btn"
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors ${
              activeTab === 'settings'
                ? 'text-emerald-800 font-bold'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <div
              className={`p-1 rounded-full ${
                activeTab === 'settings' ? 'bg-emerald-100' : ''
              }`}
            >
              <SettingsIcon size={18} />
            </div>
            <span className="text-[11px]">{isUrdu ? 'ترتیبات' : 'Settings'}</span>
          </button>

          <button
            id="tab-android-btn"
            onClick={() => setActiveTab('android')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors ${
              activeTab === 'android'
                ? 'text-emerald-800 font-bold'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <div
              className={`p-1 rounded-full ${
                activeTab === 'android' ? 'bg-emerald-100' : ''
              }`}
            >
              <Code2 size={18} />
            </div>
            <span className="text-[11px]">
              {isUrdu ? 'اینڈرائیڈ کوڈ' : 'Android'}
            </span>
          </button>
        </div>
      </div>

      {/* City Selection Dialog */}
      {showCityDialog && (
        <CityDialog
          selectedCity={selectedCity}
          isUrdu={isUrdu}
          onSelectCity={handleSelectCity}
          onClose={() => setShowCityDialog(false)}
        />
      )}
    </div>
  );
}
