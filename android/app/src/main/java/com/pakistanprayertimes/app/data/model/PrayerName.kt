package com.pakistanprayertimes.app.data.model

enum class PrayerName(
    val englishName: String,
    val urduName: String,
    val isObligatoryPrayer: Boolean = true
) {
    FAJR("Fajr", "فجر", true),
    SUNRISE("Sunrise", "طلوع آفتاب", false),
    DHUHR("Dhuhr", "ظہر", true),
    ASR("Asr", "عصر", true),
    MAGHRIB("Maghrib", "مغرب", true),
    ISHA("Isha", "عشاء", true)
}
