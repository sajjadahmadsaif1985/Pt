import React from 'react';
import { City } from '../types';
import {
  MapPin,
  Clock,
  Languages,
  BookOpen,
  Info,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface SettingsScreenProps {
  selectedCity: City;
  use24Hour: boolean;
  isUrdu: boolean;
  onOpenCityDialog: () => void;
  onToggle24Hour: (val: boolean) => void;
  onToggleUrdu: (val: boolean) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  selectedCity,
  use24Hour,
  isUrdu,
  onOpenCityDialog,
  onToggle24Hour,
  onToggleUrdu
}) => {
  return (
    <div className="space-y-4 text-left" dir={isUrdu ? 'rtl' : 'ltr'}>
      {/* City Setting */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <MapPin size={20} />
            </div>
            <div>
              <div className="font-bold text-gray-900 text-base">
                {isUrdu ? 'منتخب شہر' : 'Selected City'}
              </div>
              <div className="text-xs text-gray-500 font-medium">
                {selectedCity.nameEn} ({selectedCity.nameUr}) • {selectedCity.provinceEn}
              </div>
            </div>
          </div>

          <button
            id="settings-change-city-btn"
            onClick={onOpenCityDialog}
            className="px-3 py-1.5 bg-emerald-50 text-emerald-800 text-xs sm:text-sm font-semibold rounded-lg border border-emerald-200 hover:bg-emerald-100 transition-colors"
          >
            {isUrdu ? 'تبدیل کریں' : 'Change'}
          </button>
        </div>
      </div>

      {/* Calculation Method (Locked Karachi 18°/18°) */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <BookOpen size={20} />
          </div>
          <div className="space-y-1">
            <div className="font-bold text-gray-900 text-base">
              {isUrdu ? 'طریقہ حساب' : 'Calculation Method'}
            </div>
            <div className="text-sm font-bold text-emerald-800 flex items-center gap-1.5">
              <span>University of Islamic Sciences, Karachi</span>
              <CheckCircle2 size={16} className="text-emerald-600 inline" />
            </div>
            <div className="text-xs text-gray-500 font-urdu">
              جامعہ علوم اسلامیہ علامہ بنوری ٹاؤن، کراچی
            </div>
            <div className="text-xs text-stone-500 font-mono pt-1">
              Fajr angle: 18.0° • Isha angle: 18.0° • Time zone: PST (UTC+05:00)
            </div>
          </div>
        </div>
      </div>

      {/* Asr Juristic Method (Locked Hanafi 2x) */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <ShieldCheck size={20} />
          </div>
          <div className="space-y-1">
            <div className="font-bold text-gray-900 text-base">
              {isUrdu ? 'طریقہ عصر' : 'Asr Juristic Method'}
            </div>
            <div className="text-sm font-bold text-emerald-800 flex items-center gap-1.5">
              <span>Hanafi</span>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-medium px-2 py-0.5 rounded-full">
                {isUrdu ? 'سایہ مثلین (2x)' : 'Shadow 2x'}
              </span>
            </div>
            <div className="text-xs text-gray-500">
              {isUrdu
                ? 'شے کا سایہ اصل سایہ کے علاوہ اس کے قد کے دو گنا ہونے پر عصر کا وقت شروع ہوتا ہے۔'
                : 'Asr starts when shadow of an object equals twice its length plus noon shadow.'}
            </div>
          </div>
        </div>
      </div>

      {/* Time Format Toggle (12h vs 24h) */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center">
            <Clock size={20} />
          </div>
          <div>
            <div className="font-bold text-gray-900 text-base">
              {isUrdu ? '24 گھنٹے کا فارمیٹ' : '24-Hour Time Format'}
            </div>
            <div className="text-xs text-gray-500">
              {use24Hour
                ? isUrdu
                  ? '24 گھنٹے (16:30)'
                  : '24-hour (16:30)'
                : isUrdu
                ? '12 گھنٹے (04:30 PM)'
                : '12-hour AM/PM (04:30 PM)'}
            </div>
          </div>
        </div>

        <button
          id="toggle-24h-btn"
          onClick={() => onToggle24Hour(!use24Hour)}
          className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
            use24Hour ? 'bg-emerald-700 justify-end' : 'bg-gray-300 justify-start'
          }`}
        >
          <div className="bg-white w-4 h-4 rounded-full shadow-md" />
        </button>
      </div>

      {/* Language Toggle (English / Urdu) */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <Languages size={20} />
          </div>
          <div>
            <div className="font-bold text-gray-900 text-base">
              {isUrdu ? 'اردو زبان' : 'Urdu Language'}
            </div>
            <div className="text-xs text-gray-500">
              {isUrdu ? 'اردو انٹرفیس فعال ہے' : 'Switch UI and prayer names to Urdu'}
            </div>
          </div>
        </div>

        <button
          id="toggle-urdu-btn"
          onClick={() => onToggleUrdu(!isUrdu)}
          className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
            isUrdu ? 'bg-emerald-700 justify-end' : 'bg-gray-300 justify-start'
          }`}
        >
          <div className="bg-white w-4 h-4 rounded-full shadow-md" />
        </button>
      </div>

      {/* Calculation Information Card */}
      <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200/80 shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
          <Info size={16} />
          <span>{isUrdu ? 'حساب کی ضروری معلومات' : 'Calculation Information'}</span>
        </div>
        <p className="text-xs leading-relaxed text-gray-800">
          {isUrdu
            ? 'نماز کے اوقات جامعہ علوم اسلامیہ علامہ بنوری ٹاؤن کراچی کے مروجہ فلکیاتی قواعد اور منتخب شہر کے جغرافیائی نقاط کی بنیاد پر آف لائن خودکار حساب کیے جاتے ہیں۔'
            : 'Prayer times are calculated according to the University of Islamic Sciences, Karachi calculation method using astronomical calculations and the geographic coordinates of the selected city.'}
        </p>
        <p className="text-[11px] leading-relaxed text-gray-600 border-t border-emerald-200/60 pt-2">
          {isUrdu
            ? 'تنبیہ: یہ اوقات نماز کے دخول کے اصل شرعی فلکیاتی اوقات ہیں۔ مساجد کے باجماعت اقامت کے اوقات مقامی مساجد کی انتظامیہ کے طے شدہ جدول کے مطابق ہو سکتے ہیں۔'
            : "Important note: Calculated prayer times represent the earliest permissible astronomical times for prayer and are not necessarily the same as a mosque's Jamaat/Iqamah schedule."}
        </p>
      </div>

      {/* About Application */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs text-center space-y-1">
        <div className="font-bold text-gray-900 text-sm">
          Pakistan Prayer Times
        </div>
        <div className="text-xs text-emerald-800 font-semibold">
          Native Android Architecture • 100% Offline
        </div>
        <div className="text-[11px] text-gray-500">
          Covering Nowshera, Peshawar, Charsadda, Mardan, and Attock.
        </div>
      </div>
    </div>
  );
};
