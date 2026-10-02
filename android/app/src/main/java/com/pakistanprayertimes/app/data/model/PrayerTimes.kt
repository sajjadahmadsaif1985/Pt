package com.pakistanprayertimes.app.data.model

import java.time.LocalDate
import java.time.LocalTime
import java.time.format.DateTimeFormatter

/**
 * Data model holding prayer times for a single date.
 */
data class PrayerTimes(
    val date: LocalDate,
    val fajr: LocalTime,
    val sunrise: LocalTime,
    val dhuhr: LocalTime,
    val asr: LocalTime,
    val maghrib: LocalTime,
    val isha: LocalTime,
    val hijriDay: Int,
    val hijriMonthNameEn: String,
    val hijriMonthNameUr: String,
    val hijriYear: Int
) {
    fun getTimeForPrayer(prayer: PrayerName): LocalTime {
        return when (prayer) {
            PrayerName.FAJR -> fajr
            PrayerName.SUNRISE -> sunrise
            PrayerName.DHUHR -> dhuhr
            PrayerName.ASR -> asr
            PrayerName.MAGHRIB -> maghrib
            PrayerName.ISHA -> isha
        }
    }

    fun formattedTime(time: LocalTime, use24Hour: Boolean = false): String {
        return if (use24Hour) {
            time.format(DateTimeFormatter.ofPattern("HH:mm"))
        } else {
            time.format(DateTimeFormatter.ofPattern("hh:mm a"))
        }
    }

    val hijriDateFormattedEn: String
        get() = "$hijriDay $hijriMonthNameEn $hijriYear AH"

    val hijriDateFormattedUr: String
        get() = "$hijriDay $hijriMonthNameUr $hijriYear ھ"
}
