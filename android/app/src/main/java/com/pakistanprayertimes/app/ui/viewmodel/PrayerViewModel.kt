package com.pakistanprayertimes.app.ui.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.pakistanprayertimes.app.data.calculator.PrayerTimeCalculator
import com.pakistanprayertimes.app.data.model.CalculationSettings
import com.pakistanprayertimes.app.data.model.City
import com.pakistanprayertimes.app.data.model.PrayerName
import com.pakistanprayertimes.app.data.model.PrayerTimes
import com.pakistanprayertimes.app.data.preferences.UserPreferencesRepository
import com.pakistanprayertimes.app.data.repository.CityRepository
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch
import java.time.Duration
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime
import java.time.ZoneId

class PrayerViewModel(application: Application) : AndroidViewModel(application) {

    private val preferences = UserPreferencesRepository(application)
    private val calculationSettings = CalculationSettings()
    private val calculator = PrayerTimeCalculator(calculationSettings)

    val pkZone: ZoneId = ZoneId.of("Asia/Karachi")

    private val _selectedCity = MutableStateFlow(CityRepository.defaultCity)
    val selectedCity: StateFlow<City> = _selectedCity.asStateFlow()

    private val _selectedDate = MutableStateFlow(LocalDate.now(pkZone))
    val selectedDate: StateFlow<LocalDate> = _selectedDate.asStateFlow()

    private val _prayerTimes = MutableStateFlow<PrayerTimes?>(null)
    val prayerTimes: StateFlow<PrayerTimes?> = _prayerTimes.asStateFlow()

    private val _currentPrayer = MutableStateFlow<PrayerName?>(null)
    val currentPrayer: StateFlow<PrayerName?> = _currentPrayer.asStateFlow()

    private val _nextPrayer = MutableStateFlow<PrayerName?>(null)
    val nextPrayer: StateFlow<PrayerName?> = _nextPrayer.asStateFlow()

    private val _nextPrayerTime = MutableStateFlow<LocalTime?>(null)
    val nextPrayerTime: StateFlow<LocalTime?> = _nextPrayerTime.asStateFlow()

    private val _countdownString = MutableStateFlow("")
    val countdownString: StateFlow<String> = _countdownString.asStateFlow()

    val is24Hour: StateFlow<Boolean> = preferences.use24HourFormat
    val isUrdu: StateFlow<Boolean> = preferences.languageUrdu

    // Monthly Timetable state
    private val _selectedMonth = MutableStateFlow(LocalDate.now(pkZone).monthValue)
    val selectedMonth: StateFlow<Int> = _selectedMonth.asStateFlow()

    private val _selectedYear = MutableStateFlow(LocalDate.now(pkZone).year)
    val selectedYear: StateFlow<Int> = _selectedYear.asStateFlow()

    private val _monthlyTimetable = MutableStateFlow<List<PrayerTimes>>(emptyList())
    val monthlyTimetable: StateFlow<List<PrayerTimes>> = _monthlyTimetable.asStateFlow()

    init {
        // Initialize saved city
        viewModelScope.launch {
            preferences.selectedCityId.collect { cityId ->
                val city = CityRepository.getCityById(cityId)
                _selectedCity.value = city
                recalculate()
                recalculateMonth()
            }
        }

        // Ticker loop: updates countdown every second and checks midnight rollover
        viewModelScope.launch {
            while (isActive) {
                updateCountdownAndActivePrayer()
                delay(1000L)
            }
        }
    }

    fun selectCity(city: City) {
        preferences.setSelectedCityId(city.id)
    }

    fun setDate(date: LocalDate) {
        _selectedDate.value = date
        recalculate()
    }

    fun goToPreviousDay() {
        _selectedDate.value = _selectedDate.value.minusDays(1)
        recalculate()
    }

    fun goToToday() {
        _selectedDate.value = LocalDate.now(pkZone)
        recalculate()
    }

    fun goToNextDay() {
        _selectedDate.value = _selectedDate.value.plusDays(1)
        recalculate()
    }

    fun setMonthYear(month: Int, year: Int) {
        _selectedMonth.value = month
        _selectedYear.value = year
        recalculateMonth()
    }

    fun set24HourFormat(use24Hour: Boolean) {
        preferences.setUse24HourFormat(use24Hour)
    }

    fun setLanguageUrdu(isUrdu: Boolean) {
        preferences.setLanguageUrdu(isUrdu)
    }

    private fun recalculate() {
        val city = _selectedCity.value
        val date = _selectedDate.value
        try {
            val times = calculator.calculate(city, date)
            _prayerTimes.value = times
            updateCountdownAndActivePrayer()
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    private fun recalculateMonth() {
        val city = _selectedCity.value
        val month = _selectedMonth.value
        val year = _selectedYear.value
        try {
            val list = calculator.calculateMonth(city, year, month)
            _monthlyTimetable.value = list
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    private fun updateCountdownAndActivePrayer() {
        val times = _prayerTimes.value ?: return
        val now = LocalDateTime.now(pkZone)
        val today = now.toLocalDate()

        // If user is viewing a different day, base countdown on today's actual prayer times
        val todayTimes = if (_selectedDate.value == today) {
            times
        } else {
            calculator.calculate(_selectedCity.value, today)
        }

        val currentTime = now.toLocalTime()

        // Daily sequence:
        // Before Fajr: Current = Isha (prev night), Next = Fajr
        // Fajr to Sunrise: Current = Fajr, Next = Sunrise
        // Sunrise to Dhuhr: Current = Sunrise, Next = Dhuhr
        // Dhuhr to Asr: Current = Dhuhr, Next = Asr
        // Asr to Maghrib: Current = Asr, Next = Maghrib
        // Maghrib to Isha: Current = Maghrib, Next = Isha
        // After Isha: Current = Isha, Next = Fajr (tomorrow)

        val fajrTime = todayTimes.fajr
        val sunriseTime = todayTimes.sunrise
        val dhuhrTime = todayTimes.dhuhr
        val asrTime = todayTimes.asr
        val maghribTime = todayTimes.maghrib
        val ishaTime = todayTimes.isha

        val (cur, nxt, targetDateTime) = when {
            currentTime.isBefore(fajrTime) -> {
                Triple(PrayerName.ISHA, PrayerName.FAJR, LocalDateTime.of(today, fajrTime))
            }
            currentTime.isBefore(sunriseTime) -> {
                Triple(PrayerName.FAJR, PrayerName.SUNRISE, LocalDateTime.of(today, sunriseTime))
            }
            currentTime.isBefore(dhuhrTime) -> {
                Triple(PrayerName.SUNRISE, PrayerName.DHUHR, LocalDateTime.of(today, dhuhrTime))
            }
            currentTime.isBefore(asrTime) -> {
                Triple(PrayerName.DHUHR, PrayerName.ASR, LocalDateTime.of(today, asrTime))
            }
            currentTime.isBefore(maghribTime) -> {
                Triple(PrayerName.ASR, PrayerName.MAGHRIB, LocalDateTime.of(today, maghribTime))
            }
            currentTime.isBefore(ishaTime) -> {
                Triple(PrayerName.MAGHRIB, PrayerName.ISHA, LocalDateTime.of(today, ishaTime))
            }
            else -> {
                // After Isha: next is tomorrow Fajr
                val tomorrow = today.plusDays(1)
                val tomorrowTimes = calculator.calculate(_selectedCity.value, tomorrow)
                Triple(PrayerName.ISHA, PrayerName.FAJR, LocalDateTime.of(tomorrow, tomorrowTimes.fajr))
            }
        }

        _currentPrayer.value = cur
        _nextPrayer.value = nxt
        _nextPrayerTime.value = targetDateTime.toLocalTime()

        val diff = Duration.between(now, targetDateTime)
        val totalSeconds = diff.seconds.coerceAtLeast(0)
        val hrs = totalSeconds / 3600
        val mins = (totalSeconds % 3600) / 60
        val secs = totalSeconds % 60
        _countdownString.value = String.format("%02d:%02d:%02d", hrs, mins, secs)
    }
}
