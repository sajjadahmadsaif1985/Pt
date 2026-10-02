package com.pakistanprayertimes.app.data.calculator

import java.time.LocalDate
import kotlin.math.floor

data class HijriDate(
    val year: Int,
    val month: Int,
    val day: Int,
    val monthNameEn: String,
    val monthNameUr: String
)

/**
 * 100% offline Hijri calendar calculation engine.
 * Converts Gregorian dates into Islamic Hijri dates based on standard astronomical lunar calendar algorithms.
 */
object HijriCalendarCalculator {

    private val islamicMonthsEn = listOf(
        "Muharram", "Safar", "Rabi' al-Awwal", "Rabi' al-Thani",
        "Jumada al-Awwal", "Jumada al-Thani", "Rajab", "Sha'ban",
        "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah"
    )

    private val islamicMonthsUr = listOf(
        "محرم الحرام", "صفر المظفر", "ربیع الاول", "ربیع الثانی",
        "جمادی الاول", "جمادی الثانی", "رجب المرجب", "شعبان المعظم",
        "رمضان المبارک", "شوال المکرم", "ذوالقعدہ", "ذوالحجہ"
    )

    fun convert(date: LocalDate, dayAdjustment: Int = 0): HijriDate {
        var y = date.year
        var m = date.monthValue
        val d = date.dayOfMonth + dayAdjustment

        if (m < 3) {
            y -= 1
            m += 12
        }

        val a = floor(y / 100.0)
        val b = 2 - a + floor(a / 4.0)
        val jd = floor(365.25 * (y + 4716)) + floor(30.6001 * (m + 1)) + d + b - 1524.5

        val l = floor(jd - 1948440 + 10632).toInt()
        val n = floor((l - 1) / 10631.0).toInt()
        val l1 = l - 10631 * n + 354
        val j = (floor((10985 - l1) / 5316.0) * floor((50.0 * l1) / 17719.0)).toInt() +
                (floor(l1 / 5670.0) * floor((43.0 * l1) / 15238.0)).toInt()
        val l2 = l1 - (floor((30 - j) / 15.0) * floor((17719.0 * j) / 50.0)).toInt() -
                (floor(j / 16.0) * floor((15238.0 * j) / 43.0)).toInt() + 29
        val monthIndex = floor((24.0 * l2) / 709.0).toInt()
        val day = l2 - floor((709.0 * monthIndex) / 24.0).toInt()
        val year = 30 * n + j - 30

        val safeMonthIndex = (monthIndex - 1).coerceIn(0, 11)
        val safeDay = day.coerceIn(1, 30)

        return HijriDate(
            year = year,
            month = safeMonthIndex + 1,
            day = safeDay,
            monthNameEn = islamicMonthsEn[safeMonthIndex],
            monthNameUr = islamicMonthsUr[safeMonthIndex]
        )
    }
}
