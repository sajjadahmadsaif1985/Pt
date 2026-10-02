import React from 'react';
import { CITIES } from '../data/cities';
import { City } from '../types';
import { MapPin, Check, X } from 'lucide-react';

interface CityDialogProps {
  selectedCity: City;
  isUrdu: boolean;
  onSelectCity: (city: City) => void;
  onClose: () => void;
}

export const CityDialog: React.FC<CityDialogProps> = ({
  selectedCity,
  isUrdu,
  onSelectCity,
  onClose
}) => {
  return (
    <div
      id="city-dialog-backdrop"
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        id="city-dialog-card"
        className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-emerald-900/10 text-left"
        onClick={(e) => e.stopPropagation()}
        dir={isUrdu ? 'rtl' : 'ltr'}
      >
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <MapPin size={18} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              {isUrdu ? 'پاکستانی شہر منتخب کریں' : 'Select Pakistani City'}
            </h3>
          </div>
          <button
            id="close-city-dialog-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-4 space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
          {CITIES.map((city) => {
            const isSelected = city.id === selectedCity.id;
            return (
              <button
                key={city.id}
                id={`city-option-${city.id}`}
                onClick={() => {
                  onSelectCity(city);
                  onClose();
                }}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                  isSelected
                    ? 'border-emerald-700 bg-emerald-50/80 shadow-xs'
                    : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 text-base">
                      {isUrdu ? city.nameUr : city.nameEn}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
                      ({isUrdu ? city.nameEn : city.nameUr})
                    </span>
                  </div>
                  <div className="text-xs text-emerald-900/70 mt-0.5">
                    {isUrdu ? city.provinceUr : city.provinceEn} •{' '}
                    <span className="font-mono">
                      {city.latitude.toFixed(4)}° N, {city.longitude.toFixed(4)}° E
                    </span>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0">
                    <Check size={14} strokeWidth={3} />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-5 pt-3 border-t border-gray-100 flex justify-end">
          <button
            id="city-dialog-confirm-btn"
            onClick={onClose}
            className="px-4 py-2 bg-emerald-800 text-white text-sm font-semibold rounded-lg hover:bg-emerald-900 transition-colors"
          >
            {isUrdu ? 'بند کریں' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
};
