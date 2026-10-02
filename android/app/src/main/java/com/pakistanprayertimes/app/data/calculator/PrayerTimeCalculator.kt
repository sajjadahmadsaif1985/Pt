package com.pakistanprayertimes.app.data.calculator

import com.pakistanprayertimes.app.data.model.CalculationSettings
import com.pakistanprayertimes.app.data.model.City
import com.pakistanprayertimes.app.data.model.PrayerTimes
import java.time.LocalDate
import java.time.LocalTime
import kotlin.math.*

/**
 * Astronomical Prayer Time Calculation Engine for Pakistan.
 * Implements the University of Islamic Sciences, Karachi calculation method:
 * - Fajr angle: 18.0° depression
 * - Isha angle: 18.0° depression
 * - Asr juristic method: Hanafi (shadow length ratio = 2.0)
 * - Time zone: Pakistan Standard Time (UTC+05:00)
 * - Complete offline astronomical calculations from sun coordinates
 */
class PrayerTimeCalculator(
    private val settings: CalculationSettings = CalculationSettings()
) {

    /**
     * Calculates prayer times for a specified city and date.
     */
    fun calculate(city: City, date: LocalDate): PrayerTimes {
        val year = date.year
        val month = date.monthValue
        val day = date.dayOfMonth
        val lat = city.latitude
        val lng = city.longitude
        val tz = settings.timeZoneOffsetHours

        // Step 1: Julian Day calculation
        val d = 367.0 * year - floor(7.0 * (year + floor((month + 9.0) / 12.0)) / 4.0) +
                floor(275.0 * month / 9.0) + day - 730531.5

        // Step 2: Solar coordinates
        val meanLongitude = fixAngle(280.461 + 0.9856474 * d)
        val meanAnomaly = fixAngle(357.528 + 0.9856003 * d)
        val eclipticLongitude = fixAngle(
            meanLongitude + 1.915 * sin(toRadians(meanAnomaly)) + 0.020 * sin(toRadians(2 * meanAnomaly))
        )
        val obliquity = 23.439 - 0.0000004 * d

        // Right Ascension and Declination
        val alphaRad = atan2(
            cos(toRadians(obliquity)) * sin(toRadians(eclipticLongitude)),
            cos(toRadians(eclipticLongitude))
        )
        val alphaHours = fixAngle(toDegrees(alphaRad)) / 15.0
        val deltaRad = asin(sin(toRadians(obliquity)) * sin(toRadians(eclipticLongitude)))
        val deltaDeg = toDegrees(deltaRad)

        // Equation of Time (in hours)
        val equationOfTime = (meanLongitude / 15.0) - alphaHours

        // Solar Noon (Transit in hours)
        val transit = fixHour(12.0 + tz - (lng / 15.0) - equationOfTime)

        // Helper to compute hour angle for a given solar altitude angle
        fun computeHourAngle(altitudeDeg: Double): Double? {
            val cosH = (sin(toRadians(altitudeDeg)) - sin(toRadians(lat)) * sin(toRadians(deltaDeg))) /
                    (cos(toRadians(lat)) * cos(toRadians(deltaDeg)))
            return if (cosH in -1.0..1.0) {
                toDegrees(acos(cosH)) / 15.0
            } else {
                null
            }
        }

        // 1. Sunrise and Sunset (standard atmospheric refraction -0.8333°)
        val hSun = computeHourAngle(-0.8333) ?: 6.0
        val sunriseHours = fixHour(transit - hSun)
        val sunsetHours = fixHour(transit + hSun)

        // 2. Fajr (Karachi: 18° depression)
        val hFajr = computeHourAngle(-settings.fajrAngle) ?: (hSun + 1.25)
        val fajrHours = fixHour(transit - hFajr)

        // 3. Dhuhr (Solar noon + 1 minute safe margin)
        val dhuhrHours = fixHour(transit + (1.0 / 60.0))

        // 4. Asr (Hanafi method: shadow length = 2 * height + noon shadow)
        val asrFactor = settings.asrMethod.factor
        val zenithDiff = abs(lat - deltaDeg)
        val asrAltDeg = toDegrees(atan(1.0 / (asrFactor + tan(toRadians(zenithDiff)))))
        val hAsr = computeHourAngle(asrAltDeg) ?: 3.5
        val asrHours = fixHour(transit + hAsr)

        // 5. Maghrib (Sunset)
        val maghribHours = sunsetHours

        // 6. Isha (Karachi: 18° depression)
        val hIsha = computeHourAngle(-settings.ishaAngle) ?: (hSun + 1.25)
        val ishaHours = fixHour(transit + hIsha)

        // Step 3: Hijri Date
        val hijri = HijriCalendarCalculator.convert(date)

        return PrayerTimes(
            date = date,
            fajr = hoursToLocalTime(fajrHours),
            sunrise = hoursToLocalTime(sunriseHours),
            dhuhr = hoursToLocalTime(dhuhrHours),
            asr = hoursToLocalTime(asrHours),
            maghrib = hoursToLocalTime(maghribHours),
            isha = hoursToLocalTime(ishaHours),
            hijriDay = hijri.day,
            hijriMonthNameEn = hijri.monthNameEn,
            hijriMonthNameUr = hijri.monthNameUr,
            hijriYear = hijri.year
        )
    }

    /**
     * Calculates prayer times for an entire month for the monthly timetable screen.
     */
    fun calculateMonth(city: City, year: Int, month: Int): List<PrayerTimes> {
        val firstDay = LocalDate.of(year, month, 1)
        val lengthOfMonth = firstDay.lengthOfMonth()
        val list = mutableListOf<PrayerTimes>()
        for (day in 1..lengthOfMonth) {
            val date = LocalDate.of(year, month, day)
            list.add(calculate(city, date))
        }
        return list
    }

    private fun hoursToLocalTime(hours: Double): LocalTime {
        val totalSeconds = (hours * 3600.0).roundToInt()
        val normalizedSeconds = ((totalSeconds % 86400) + 86400) % 86400
        val h = normalizedSeconds / 3600
        val m = (normalizedSeconds % 3600) / 60
        val s = normalizedSeconds % 60
        return LocalTime.of(h, m, s)
    }

    private fun fixAngle(angle: Double): Double {
        var a = angle - 360.0 * floor(angle / 360.0)
        if (a < 0.0) a += 360.0
        return a
    }

    private fun fixHour(hour: Double): Double {
        var h = hour - 24.0 * floor(hour / 24.0)
        if (h < 0.0) h += 24.0
        return h
    }

    private fun toRadians(deg: Double): Double = deg * (PI / 180.0)
    private fun toDegrees(rad: Double): Double = rad * (180.0 / PI)
}
