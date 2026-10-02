import React, { useState } from 'react';
import JSZip from 'jszip';
import { ANDROID_PROJECT_FILES } from '../data/androidProjectFiles';
import {
  Download,
  Folder,
  FileCode,
  Check,
  Terminal,
  Smartphone,
  Copy,
  Code
} from 'lucide-react';

interface AndroidProjectViewerProps {
  isUrdu: boolean;
}

export const AndroidProjectViewer: React.FC<AndroidProjectViewerProps> = ({ isUrdu }) => {
  const [downloading, setDownloading] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [selectedFilePath, setSelectedFilePath] = useState<string>(
    'app/src/main/java/com/pakistanprayertimes/app/data/calculator/PrayerTimeCalculator.kt'
  );

  const sampleKotlinFiles = [
    {
      name: 'PrayerTimeCalculator.kt',
      path: 'app/src/main/java/com/pakistanprayertimes/app/data/calculator/PrayerTimeCalculator.kt',
      desc: '100% offline astronomical calculation engine implementing Karachi method (18°/18°, Hanafi Asr)'
    },
    {
      name: 'CityRepository.kt',
      path: 'app/src/main/java/com/pakistanprayertimes/app/data/repository/CityRepository.kt',
      desc: 'Local coordinates database for Nowshera, Peshawar, Charsadda, Mardan, and Attock'
    },
    {
      name: 'PrayerViewModel.kt',
      path: 'app/src/main/java/com/pakistanprayertimes/app/ui/viewmodel/PrayerViewModel.kt',
      desc: 'Jetpack ViewModel with StateFlow, 1-second ticker loop, and midnight rollover'
    },
    {
      name: 'HomeScreen.kt',
      path: 'app/src/main/java/com/pakistanprayertimes/app/ui/screens/HomeScreen.kt',
      desc: 'Jetpack Compose Material 3 home screen with prayer cards, countdown, date navigator'
    },
    {
      name: 'MonthlyTimetableScreen.kt',
      path: 'app/src/main/java/com/pakistanprayertimes/app/ui/screens/MonthlyTimetableScreen.kt',
      desc: 'Monthly timetable screen generating all days dynamically with month picker'
    },
    {
      name: 'AndroidManifest.xml',
      path: 'app/src/main/AndroidManifest.xml',
      desc: 'Android application manifest configuring Pakistan Prayer Times launcher activity'
    },
    {
      name: 'build.gradle.kts',
      path: 'app/build.gradle.kts',
      desc: 'Gradle build file with Android 34 SDK, Kotlin 2.0, Compose BOM, and Material 3'
    }
  ];

  const handleDownloadZip = async () => {
    try {
      setDownloading(true);
      const zip = new JSZip();

      // Add all 41 project files directly into the ZIP
      for (const [relPath, content] of Object.entries(ANDROID_PROJECT_FILES)) {
        zip.file(relPath, content);
      }

      // Generate zip blob
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'PakistanPrayerTimes-NativeAndroid.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to generate ZIP:', e);
    } finally {
      setDownloading(false);
    }
  };

  const copyBuildCommand = () => {
    navigator.clipboard.writeText('./gradlew assembleDebug');
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const currentFileContent = ANDROID_PROJECT_FILES[selectedFilePath] || '// File not found';

  return (
    <div className="space-y-4 text-left" dir={isUrdu ? 'rtl' : 'ltr'}>
      {/* Download Action Card */}
      <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 text-white p-5 rounded-2xl shadow-md border border-emerald-700/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Smartphone size={22} className="text-amber-300" />
              <h2 className="text-lg font-bold">
                {isUrdu ? 'مکمل اینڈرائیڈ نیٹیو پروجیکٹ' : 'Native Android Studio Project'}
              </h2>
            </div>
            <p className="text-xs text-emerald-100/90 mt-1 max-w-lg">
              {isUrdu
                ? 'مکمل نیٹیو کوٹلن اینڈرائیڈ اسٹوڈیو پروجیکٹ، جس میں جیٹ پیک کمپوز، میٹریل 3، اور جامعہ کراچی کے فلکیاتی حساب کا مکمل آف لائن کوڈ شامل ہے۔'
                : 'Complete, installable Android Studio project built with Kotlin, Jetpack Compose, Material 3, and pure offline astronomical Karachi prayer calculations.'}
            </p>
          </div>

          <button
            id="download-android-zip-btn"
            onClick={handleDownloadZip}
            disabled={downloading}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 text-emerald-950 font-bold text-sm hover:bg-amber-300 transition-all shadow-md shrink-0 disabled:opacity-50"
          >
            <Download size={18} />
            <span>
              {downloading
                ? isUrdu
                  ? 'تیار ہو رہا ہے...'
                  : 'Preparing ZIP...'
                : isUrdu
                ? 'پروجیکٹ زپ ڈاؤنلوڈ کریں'
                : 'Download Android ZIP'}
            </span>
          </button>
        </div>
      </div>

      {/* APK Compilation Instructions */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
          <Terminal size={18} className="text-emerald-700" />
          <span>{isUrdu ? 'اے پی کے بنانے کا طریقہ' : 'How to Compile APK & Install'}</span>
        </div>

        <div className="space-y-2 text-xs text-gray-700">
          <div className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[11px]">
              1
            </span>
            <span>
              <strong>Open in Android Studio:</strong> Open Android Studio (Koala or newer), choose{' '}
              <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-emerald-900">
                Open
              </code>{' '}
              and select the extracted project directory.
            </span>
          </div>

          <div className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[11px]">
              2
            </span>
            <div className="flex-1">
              <span>
                <strong>Build with Gradle (or Terminal):</strong> In Android Studio or terminal, run:
              </span>
              <div className="mt-1 flex items-center justify-between bg-gray-900 text-emerald-400 p-2 rounded-lg font-mono text-xs">
                <code>./gradlew assembleDebug</code>
                <button
                  onClick={copyBuildCommand}
                  className="text-gray-400 hover:text-white transition-colors"
                  title="Copy command"
                >
                  {copiedCmd ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[11px]">
              3
            </span>
            <span>
              <strong>Install APK on Physical Phone:</strong> The debug APK is generated at{' '}
              <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-[11px]">
                app/build/outputs/apk/debug/app-debug.apk
              </code>
              . Install via USB or phone file manager.
            </span>
          </div>
        </div>
      </div>

      {/* Code Inspector */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
            <Folder size={18} className="text-emerald-700" />
            <span>{isUrdu ? 'نیٹیو کوڈ فائلیں' : 'Native Kotlin & Gradle Project Files'}</span>
          </div>
          <span className="text-[11px] font-mono text-gray-400">
            {Object.keys(ANDROID_PROJECT_FILES).length} files ready
          </span>
        </div>

        {/* File Tabs */}
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {sampleKotlinFiles.map((f, i) => {
            const isSelected = selectedFilePath === f.path;
            return (
              <button
                key={i}
                onClick={() => setSelectedFilePath(f.path)}
                className={`w-full text-left p-2 rounded-xl border transition-all flex items-start gap-2 text-xs ${
                  isSelected
                    ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-semibold'
                    : 'border-gray-100 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <FileCode size={16} className={isSelected ? 'text-emerald-700 shrink-0 mt-0.5' : 'text-gray-400 shrink-0 mt-0.5'} />
                <div className="flex-1 min-w-0">
                  <div className="font-mono font-bold truncate">{f.name}</div>
                  <div className="text-[10px] text-gray-500 truncate">{f.desc}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Code Preview Box */}
        <div className="rounded-xl border border-gray-800 bg-gray-950 text-gray-200 p-3 text-xs font-mono overflow-hidden">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-800 text-[11px] text-gray-400">
            <div className="flex items-center gap-1.5 truncate">
              <Code size={14} className="text-emerald-400" />
              <span className="truncate">{selectedFilePath}</span>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(currentFileContent);
              }}
              className="text-gray-400 hover:text-emerald-400 transition-colors shrink-0 ml-2"
              title="Copy file contents"
            >
              Copy
            </button>
          </div>
          <pre className="max-h-60 overflow-y-auto text-[11px] leading-relaxed text-gray-300 font-mono">
            {currentFileContent}
          </pre>
        </div>
      </div>
    </div>
  );
};
