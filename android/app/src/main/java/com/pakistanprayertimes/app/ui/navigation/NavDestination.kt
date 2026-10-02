package com.pakistanprayertimes.app.ui.navigation

sealed class Screen(val route: String, val titleEn: String, val titleUr: String) {
    object Home : Screen("home", "Home", "صفحہ اول")
    object Monthly : Screen("monthly", "Monthly Timetable", "ماہانہ نظام الاوقات")
    object Settings : Screen("settings", "Settings", "ترتیبات")
}
