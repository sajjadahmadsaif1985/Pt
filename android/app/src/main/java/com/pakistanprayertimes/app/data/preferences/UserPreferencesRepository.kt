package com.pakistanprayertimes.app.data.preferences

import android.content.Context
import android.content.SharedPreferences
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

class UserPreferencesRepository(context: Context) {

    private val prefs: SharedPreferences =
        context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

    private val _selectedCityId = MutableStateFlow(
        prefs.getString(KEY_CITY_ID, DEFAULT_CITY_ID) ?: DEFAULT_CITY_ID
    )
    val selectedCityId: StateFlow<String> = _selectedCityId.asStateFlow()

    private val _use24HourFormat = MutableStateFlow(
        prefs.getBoolean(KEY_24_HOUR, false)
    )
    val use24HourFormat: StateFlow<Boolean> = _use24HourFormat.asStateFlow()

    private val _languageUrdu = MutableStateFlow(
        prefs.getBoolean(KEY_LANG_URDU, false)
    )
    val languageUrdu: StateFlow<Boolean> = _languageUrdu.asStateFlow()

    fun setSelectedCityId(cityId: String) {
        prefs.edit().putString(KEY_CITY_ID, cityId).apply()
        _selectedCityId.value = cityId
    }

    fun setUse24HourFormat(use24Hour: Boolean) {
        prefs.edit().putBoolean(KEY_24_HOUR, use24Hour).apply()
        _use24HourFormat.value = use24Hour
    }

    fun setLanguageUrdu(isUrdu: Boolean) {
        prefs.edit().putBoolean(KEY_LANG_URDU, isUrdu).apply()
        _languageUrdu.value = isUrdu
    }

    companion object {
        private const val PREFS_NAME = "pakistan_prayer_times_prefs"
        private const val KEY_CITY_ID = "selected_city_id"
        private const val KEY_24_HOUR = "use_24_hour_format"
        private const val KEY_LANG_URDU = "language_urdu"
        private const val DEFAULT_CITY_ID = "nowshera"
    }
}
