import React, { useState } from 'react';
import { City } from '../types';
import { calculateMonthPrayerTimes, formatTimeDisplay } from '../calculator/prayerTimeCalculator';
import { ChevronLeft, ChevronRight, Calendar, MapPin } from 'lucide-react';

interface MonthlyTimetableScreenProps {
  selectedCity: City;
  use24Hour: boolean;
  isUrdu: boolean;
}

export const MonthlyTimetableScreen: React.FC<MonthlyTimetableScreenProps> = ({
  selectedCity,
  use24Hour,
  isUrdu
}) => {
  const currentDate = new Date();
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [currentMonthIndex, setCurrentMonthIndex] = useState(currentDate.getMonth());

  const monthNamesEn = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const monthNamesUr = [
    'جنوری', 'فروری', 'مارچ', 'اپریل', 'مئی', 'جون',
    'جولائی', 'اگست', 'ستمبر', 'اکتوبر', 'نومبر', 'دسمبر'
  ];

  const monthlyData = calculateMonthPrayerTimes(selectedCity, currentYear, currentMonthIndex);

  const prevMonth = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonthIndex((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonthIndex((m) => m + 1);
    }
  };

  const todayStr = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;

  return (
    <div className="space-y-4" dir={isUrdu ? 'rtl' : 'ltr'}>
      {/* Month Navigator Header */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between">
        <button
          id="prev-month-btn"
          onClick={prevMonth}
          className="p-2 rounded-xl border border-gray-200 hover:bg-emerald-50 hover:border-emerald-300 text-gray-700 transition-colors"
          title="Previous Month"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5 text-lg font-bold text-emerald-900">
            <Calendar size={18} className="text-emerald-700" />
            <span>
              {isUrdu ? monthNamesUr[currentMonthIndex] : monthNamesEn[currentMonthIndex]}{' '}
              {currentYear}
            </span>
          </div>
          <div className="text-xs text-gray-500 font-medium flex items-center justify-center gap-1 mt-0.5">
            <MapPin size={12} className="text-emerald-600" />
            <span>{isUrdu ? selectedCity.nameUr : selectedCity.nameEn}</span>
            <span>•</span>
            <span>{isUrdu ? 'جامعہ بنوری ٹاؤن، کراچی' : 'Univ. Karachi Method'}</span>
          </div>
        </div>

        <button
          id="next-month-btn"
          onClick={nextMonth}
          className="p-2 rounded-xl border border-gray-200 hover:bg-emerald-50 hover:border-emerald-300 text-gray-700 transition-colors"
          title="Next Month"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-left border-collapse">
            <thead>
              <tr className="bg-emerald-800 text-white text-xs font-semibold uppercase tracking-wider text-center">
                <th className="py-3 px-3 border-r border-emerald-700/50">
                  {isUrdu ? 'تاریخ' : 'Date'}
                </th>
                <th className="py-3 px-2 border-r border-emerald-700/50">
                  {isUrdu ? 'فجر' : 'Fajr'}
                </th>
                <th className="py-3 px-2 border-r border-emerald-700/50">
                  {isUrdu ? 'طلوع' : 'Sunrise'}
                </th>
                <th className="py-3 px-2 border-r border-emerald-700/50">
                  {isUrdu ? 'ظہر' : 'Dhuhr'}
                </th>
                <th className="py-3 px-2 border-r border-emerald-700/50">
                  {isUrdu ? 'عصر' : 'Asr'}
                </th>
                <th className="py-3 px-2 border-r border-emerald-700/50">
                  {isUrdu ? 'مغرب' : 'Maghrib'}
                </th>
                <th className="py-3 px-2">
                  {isUrdu ? 'عشاء' : 'Isha'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-center font-mono">
              {monthlyData.map((item, index) => {
                const isTodayRow = item.date === todayStr;
                const d = item.dateObj;
                const dayNum = d.getDate();
                const dayName = d.toLocaleDateString(isUrdu ? 'ur-PK' : 'en-US', {
                  weekday: 'short'
                });

                return (
                  <tr
                    key={item.date}
                    className={`transition-colors ${
                      isTodayRow
                        ? 'bg-emerald-100/90 font-bold text-emerald-950 ring-1 ring-emerald-500/50'
                        : index % 2 === 1
                        ? 'bg-gray-50/70 hover:bg-emerald-50/50 text-gray-800'
                        : 'bg-white hover:bg-emerald-50/50 text-gray-800'
                    }`}
                  >
                    <td className="py-2.5 px-3 border-r border-gray-100 whitespace-nowrap text-left font-sans">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-gray-900 w-5 text-right font-mono">
                          {dayNum}
                        </span>
                        <span className="text-[11px] text-gray-500 font-medium">
                          {dayName}
                        </span>
                        {isTodayRow && (
                          <span className="text-[10px] bg-emerald-700 text-white font-semibold px-1.5 py-0.2 rounded-sm ml-1">
                            {isUrdu ? 'آج' : 'Today'}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-emerald-800/80 font-medium">
                        {item.hijriDay}{' '}
                        {isUrdu
                          ? item.hijriMonthNameUr.split(' ')[0]
                          : item.hijriMonthNameEn.split(' ')[0]}
                      </div>
                    </td>

                    <td className="py-2 px-2 border-r border-gray-100">
                      {formatTimeDisplay(item.fajr, use24Hour)}
                    </td>
                    <td className="py-2 px-2 border-r border-gray-100 text-stone-600">
                      {formatTimeDisplay(item.sunrise, use24Hour)}
                    </td>
                    <td className="py-2 px-2 border-r border-gray-100 font-semibold text-emerald-900">
                      {formatTimeDisplay(item.dhuhr, use24Hour)}
                    </td>
                    <td className="py-2 px-2 border-r border-gray-100 font-medium text-amber-800">
                      {formatTimeDisplay(item.asr, use24Hour)}
                    </td>
                    <td className="py-2 px-2 border-r border-gray-100 font-semibold text-emerald-900">
                      {formatTimeDisplay(item.maghrib, use24Hour)}
                    </td>
                    <td className="py-2 px-2 font-medium">
                      {formatTimeDisplay(item.isha, use24Hour)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
