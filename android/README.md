# Pakistan Prayer Times - Native Android Application

A complete, production-ready Native Android application built with **Kotlin**, **Jetpack Compose**, and **Material 3**.

## Key Highlights

- **100% Offline Astronomical Calculation Engine**: Computes high-precision solar transit, twilight depression, and solar altitudes locally on device.
- **University of Islamic Sciences, Karachi Method**:
  - Fajr depression angle: 18.0°
  - Isha depression angle: 18.0°
  - Asr juristic rule: **Hanafi** (shadow length = object height × 2 + noon shadow)
  - Time zone: **Pakistan Standard Time (UTC+05:00)** (no daylight saving time)
- **Local City Coordinates Database**:
  1. **Nowshera**, Khyber Pakhtunkhwa (`34.0153° N, 71.9747° E`) [Default]
  2. **Peshawar**, Khyber Pakhtunkhwa (`34.0151° N, 71.5249° E`)
  3. **Charsadda**, Khyber Pakhtunkhwa (`34.1482° N, 71.7406° E`)
  4. **Mardan**, Khyber Pakhtunkhwa (`34.1989° N, 72.0404° E`)
  5. **Attock**, Punjab (`33.7667° N, 72.3667° E`)
- **Real-time Live Countdown**: 1-second interval ticker computing exact remaining duration until the next prayer.
- **Date Navigation**: Previous Day, Today, Next Day controls with dynamic astronomical recalculation.
- **Monthly Timetable Screen**: Full calendar month timetable generation for any chosen month.
- **Offline Hijri Calendar**: Islamic Hijri lunar date calculation (e.g. 10 Rabi al-Awwal 1448 AH).
- **Urdu Language Support**: Complete bilingual interface with authentic Urdu terminology (فجر، طلوع آفتاب، ظہر، عصر، مغرب، عشاء).
- **12h / 24h Time Format**: Customizable display options.

---

## How to Build the APK

### Method 1: Android Studio (Recommended)
1. Open **Android Studio** (Koala or newer).
2. Select **Open** and choose the `android` folder in this repository.
3. Allow Gradle sync to complete automatically.
4. Select **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
5. The debug APK will be generated at:
   `app/build/outputs/apk/debug/app-debug.apk`
6. Transfer this APK to your Android device or run directly on a physical phone via USB debugging.

### Method 2: Command Line (Gradle)
Run the following from the `android` directory:
```bash
./gradlew assembleDebug
```
For release APK with signing:
```bash
./gradlew assembleRelease
```

---

## Project Structure

```
android/
├── app/
│   ├── build.gradle.kts
│   ├── proguard-rules.pro
│   └── src/
│       └── main/
│           ├── AndroidManifest.xml
│           ├── java/com/pakistanprayertimes/app/
│           │   ├── MainActivity.kt
│           │   ├── PakistanPrayerTimesApp.kt
│           │   ├── data/
│           │   │   ├── calculator/
│           │   │   │   ├── PrayerTimeCalculator.kt
│           │   │   │   └── HijriCalendarCalculator.kt
│           │   │   ├── model/
│           │   │   │   ├── City.kt
│           │   │   │   ├── PrayerTimes.kt
│           │   │   │   ├── CalculationSettings.kt
│           │   │   │   └── PrayerName.kt
│           │   │   ├── preferences/
│           │   │   │   └── UserPreferencesRepository.kt
│           │   │   └── repository/
│           │   │       └── CityRepository.kt
│           │   └── ui/
│           │       ├── components/
│           │       │   ├── PrayerCard.kt
│           │       │   └── CitySelectionDialog.kt
│           │       ├── navigation/
│           │       │   └── NavDestination.kt
│           │       ├── screens/
│           │       │   ├── HomeScreen.kt
│           │       │   ├── MonthlyTimetableScreen.kt
│           │       │   └── SettingsScreen.kt
│           │       ├── theme/
│           │       │   ├── Color.kt
│           │       │   ├── Theme.kt
│           │       │   └── Type.kt
│           │       └── viewmodel/
│           │           └── PrayerViewModel.kt
│           └── res/
│               ├── drawable/
│               ├── mipmap-anydpi-v26/
│               ├── values/
│               │   ├── colors.xml
│               │   ├── strings.xml
│               │   └── themes.xml
│               ├── values-ur/
│               │   └── strings.xml
│               └── xml/
├── gradle/
│   ├── libs.versions.toml
│   └── wrapper/
├── build.gradle.kts
├── settings.gradle.kts
├── gradle.properties
├── gradlew
└── gradlew.bat
```
