package com.pakistanprayertimes.app.data.repository

import com.pakistanprayertimes.app.data.model.City

/**
 * Repository providing Pakistani cities and their geographic coordinates.
 * Structured cleanly to easily add more Pakistani cities in the future.
 */
object CityRepository {

    val NOWSHERA = City(
        id = "nowshera",
        nameEn = "Nowshera",
        nameUr = "نوشہرہ",
        provinceEn = "Khyber Pakhtunkhwa",
        provinceUr = "خیبر پختونخوا",
        latitude = 34.0153,
        longitude = 71.9747,
        elevationMeters = 290.0
    )

    val PESHAWAR = City(
        id = "peshawar",
        nameEn = "Peshawar",
        nameUr = "پشاور",
        provinceEn = "Khyber Pakhtunkhwa",
        provinceUr = "خیبر پختونخوا",
        latitude = 34.0151,
        longitude = 71.5249,
        elevationMeters = 359.0
    )

    val CHARSADDA = City(
        id = "charsadda",
        nameEn = "Charsadda",
        nameUr = "چارسدہ",
        provinceEn = "Khyber Pakhtunkhwa",
        provinceUr = "خیبر پختونخوا",
        latitude = 34.1482,
        longitude = 71.7406,
        elevationMeters = 295.0
    )

    val MARDAN = City(
        id = "mardan",
        nameEn = "Mardan",
        nameUr = "مردان",
        provinceEn = "Khyber Pakhtunkhwa",
        provinceUr = "خیبر پختونخوا",
        latitude = 34.1989,
        longitude = 72.0404,
        elevationMeters = 300.0
    )

    val ATTOCK = City(
        id = "attock",
        nameEn = "Attock",
        nameUr = "اٹک",
        provinceEn = "Punjab",
        provinceUr = "پنجاب",
        latitude = 33.7667,
        longitude = 72.3667,
        elevationMeters = 355.0
    )

    /**
     * Primary 5 cities required for the application.
     */
    val availableCities: List<City> = listOf(
        NOWSHERA,
        PESHAWAR,
        CHARSADDA,
        MARDAN,
        ATTOCK
    )

    val defaultCity: City = NOWSHERA

    fun getCityById(id: String): City {
        return availableCities.find { it.id.equals(id, ignoreCase = true) } ?: defaultCity
    }
}
