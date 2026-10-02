package com.pakistanprayertimes.app.data.model

/**
 * City model representing a Pakistani city with its geographic coordinates.
 * Designed cleanly to allow future expansion with additional cities.
 */
data class City(
    val id: String,
    val nameEn: String,
    val nameUr: String,
    val provinceEn: String,
    val provinceUr: String,
    val latitude: Double,
    val longitude: Double,
    val elevationMeters: Double = 0.0
)
