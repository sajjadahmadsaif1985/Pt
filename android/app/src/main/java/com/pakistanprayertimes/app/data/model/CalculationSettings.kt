package com.pakistanprayertimes.app.data.model

/**
 * Juristic method for Asr prayer calculation.
 * In Pakistan, University of Islamic Sciences, Karachi specifies the Hanafi method.
 */
enum class AsrJuristicMethod(val factor: Double, val displayNameEn: String, val displayNameUr: String) {
    HANAFI(2.0, "Hanafi (Shadow length: 2x)", "حنفی (سایہ مثلین)"),
    SHAFI(1.0, "Shafi'i / Maliki / Hanbali", "شافعی / مالکی / حنبلی")
}

/**
 * Calculation configuration conforming strictly to
 * University of Islamic Sciences, Karachi guidelines:
 * - Fajr angle: 18.0 degrees
 * - Isha angle: 18.0 degrees
 * - Asr method: Hanafi (shadow length = 2x object height + noon shadow)
 * - Time zone: Pakistan Standard Time (UTC+05:00)
 */
data class CalculationSettings(
    val methodName: String = "University of Islamic Sciences, Karachi",
    val methodNameUrdu: String = "جامعہ علوم اسلامیہ بنوری ٹاؤن، کراچی",
    val fajrAngle: Double = 18.0,
    val ishaAngle: Double = 18.0,
    val asrMethod: AsrJuristicMethod = AsrJuristicMethod.HANAFI,
    val timeZoneOffsetHours: Double = 5.0 // UTC+05:00 Pakistan Standard Time
)
