import React from 'react';
import { formatTimeDisplay } from '../calculator/prayerTimeCalculator';
import { Sunrise, Moon, Sun, Sunset, CloudSun } from 'lucide-react';

interface PrayerCardProps {
  id: string;
  nameEn: string;
  nameUr: string;
  time24: string;
  use24Hour: boolean;
  isActive: boolean;
  isNext: boolean;
  isUrdu: boolean;
  isSunrise?: boolean;
}

export const PrayerCard: React.FC<PrayerCardProps> = ({
  id,
  nameEn,
  nameUr,
  time24,
  use24Hour,
  isActive,
  isNext,
  isUrdu,
  isSunrise = false
}) => {
  const formattedTime = formatTimeDisplay(time24, use24Hour);

  const getIcon = () => {
    switch (id) {
      case 'fajr':
        return <Moon size={20} className="text-emerald-700" />;
      case 'sunrise':
        return <Sunrise size={20} className="text-amber-600" />;
      case 'dhuhr':
        return <Sun size={20} className="text-amber-500" />;
      case 'asr':
        return <CloudSun size={20} className="text-amber-700" />;
      case 'maghrib':
        return <Sunset size={20} className="text-orange-600" />;
      case 'isha':
      default:
        return <Moon size={20} className="text-indigo-800" />;
    }
  };

  return (
    <div
      id={`prayer-card-${id}`}
      className={`p-4 rounded-xl border transition-all duration-200 flex items-center justify-between ${
        isNext
          ? 'bg-emerald-50/90 border-emerald-600 shadow-sm ring-1 ring-emerald-500/30'
          : isActive
          ? 'bg-amber-50/70 border-amber-400 shadow-xs'
          : isSunrise
          ? 'bg-stone-50 border-stone-200 opacity-90'
          : 'bg-white border-gray-200/90 hover:border-gray-300'
      }`}
    >
      <div className="flex items-center gap-3.5">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            isNext
              ? 'bg-emerald-100 text-emerald-800'
              : isActive
              ? 'bg-amber-100 text-amber-900'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          {getIcon()}
        </div>

        <div>
          <div className="flex items-baseline gap-2">
            <span
              className={`font-bold text-base sm:text-lg ${
                isNext ? 'text-emerald-900' : 'text-gray-900'
              }`}
            >
              {isUrdu ? nameUr : nameEn}
            </span>
            {!isUrdu && (
              <span className="text-xs text-gray-500 font-medium font-sans">
                {nameUr}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mt-0.5">
            {isNext && (
              <span className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-700 text-white">
                {isUrdu ? 'اگلی نماز' : 'Next Prayer'}
              </span>
            )}
            {isActive && !isNext && (
              <span className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500 text-white">
                {isUrdu ? 'موجودہ وقت' : 'Current Prayer'}
              </span>
            )}
            {isSunrise && (
              <span className="text-xs text-stone-500">
                {isUrdu ? 'وقت ختم فجر' : 'Fajr ends'}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="text-right">
        <div
          className={`text-xl sm:text-2xl font-bold font-mono tracking-tight ${
            isNext
              ? 'text-emerald-800'
              : isActive
              ? 'text-amber-700'
              : 'text-gray-900'
          }`}
        >
          {formattedTime}
        </div>
        <div className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
          PST (UTC+05)
        </div>
      </div>
    </div>
  );
};
