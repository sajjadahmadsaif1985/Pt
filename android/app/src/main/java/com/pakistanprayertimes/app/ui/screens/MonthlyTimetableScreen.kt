package com.pakistanprayertimes.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.pakistanprayertimes.app.ui.theme.*
import com.pakistanprayertimes.app.ui.viewmodel.PrayerViewModel
import java.time.LocalDate
import java.time.Month
import java.time.format.TextStyle
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MonthlyTimetableScreen(
    viewModel: PrayerViewModel,
    modifier: Modifier = Modifier
) {
    val selectedCity by viewModel.selectedCity.collectAsState()
    val selectedMonth by viewModel.selectedMonth.collectAsState()
    val selectedYear by viewModel.selectedYear.collectAsState()
    val monthlyTimetable by viewModel.monthlyTimetable.collectAsState()
    val is24Hour by viewModel.is24Hour.collectAsState()
    val isUrdu by viewModel.isUrdu.collectAsState()

    val today = LocalDate.now(viewModel.pkZone)

    val monthName = Month.of(selectedMonth).getDisplayName(TextStyle.FULL, Locale.ENGLISH)

    fun prevMonth() {
        if (selectedMonth == 1) {
            viewModel.setMonthYear(12, selectedYear - 1)
        } else {
            viewModel.setMonthYear(selectedMonth - 1, selectedYear)
        }
    }

    fun nextMonth() {
        if (selectedMonth == 12) {
            viewModel.setMonthYear(1, selectedYear + 1)
        } else {
            viewModel.setMonthYear(selectedMonth + 1, selectedYear)
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = if (isUrdu) "ماہانہ نظام الاوقات" else "Monthly Timetable",
                            style = MaterialTheme.typography.titleLarge.copy(
                                fontWeight = FontWeight.Bold,
                                color = Color.White
                            )
                        )
                        Text(
                            text = "${if (isUrdu) selectedCity.nameUr else selectedCity.nameEn} • $monthName $selectedYear",
                            style = MaterialTheme.typography.bodySmall.copy(
                                color = Gold400,
                                fontSize = 12.sp
                            )
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = Emerald800,
                    titleContentColor = Color.White
                )
            )
        }
    ) { innerPadding ->
        Column(
            modifier = modifier
                .fillMaxSize()
                .background(BackgroundLight)
                .padding(innerPadding)
                .padding(16.dp)
        ) {
            // Month Selector Bar
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp),
                colors = CardDefaults.cardColors(containerColor = SurfaceCard),
                border = androidx.compose.foundation.BorderStroke(1.dp, BorderSubtle)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 12.dp, vertical = 8.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    IconButton(onClick = { prevMonth() }) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                            contentDescription = "Previous Month",
                            tint = Emerald800
                        )
                    }

                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            text = "$monthName $selectedYear",
                            style = MaterialTheme.typography.titleMedium.copy(
                                fontWeight = FontWeight.Bold,
                                color = Emerald800
                            )
                        )
                        Text(
                            text = "${if (isUrdu) selectedCity.nameUr else selectedCity.nameEn} (PKT, UTC+05:00)",
                            style = MaterialTheme.typography.bodySmall.copy(color = TextSecondary, fontSize = 11.sp)
                        )
                    }

                    IconButton(onClick = { nextMonth() }) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Filled.ArrowForward,
                            contentDescription = "Next Month",
                            tint = Emerald800
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Timetable Table
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1f),
                shape = RoundedCornerShape(12.dp),
                colors = CardDefaults.cardColors(containerColor = SurfaceCard),
                border = androidx.compose.foundation.BorderStroke(1.dp, BorderSubtle)
            ) {
                val horizontalScrollState = rememberScrollState()

                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .horizontalScroll(horizontalScrollState)
                ) {
                    // Table Header
                    Row(
                        modifier = Modifier
                            .background(Emerald800)
                            .padding(vertical = 12.dp, horizontal = 8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        HeaderCell(if (isUrdu) "تاریخ" else "Date", width = 85.dp)
                        HeaderCell(if (isUrdu) "فجر" else "Fajr", width = 80.dp)
                        HeaderCell(if (isUrdu) "طلوع" else "Sunrise", width = 80.dp)
                        HeaderCell(if (isUrdu) "ظہر" else "Dhuhr", width = 80.dp)
                        HeaderCell(if (isUrdu) "عصر" else "Asr", width = 80.dp)
                        HeaderCell(if (isUrdu) "مغرب" else "Maghrib", width = 80.dp)
                        HeaderCell(if (isUrdu) "عشاء" else "Isha", width = 80.dp)
                    }

                    // Table Rows
                    LazyColumn(modifier = Modifier.fillMaxSize()) {
                        itemsIndexed(monthlyTimetable) { index, item ->
                            val isCurrentDay = item.date == today
                            val rowBg = when {
                                isCurrentDay -> Emerald50
                                index % 2 == 1 -> BackgroundLight
                                else -> SurfaceCard
                            }

                            Row(
                                modifier = Modifier
                                    .background(rowBg)
                                    .padding(vertical = 10.dp, horizontal = 8.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                // Date Column
                                Column(modifier = Modifier.width(85.dp)) {
                                    Text(
                                        text = "${item.date.dayOfMonth} ${item.date.month.name.take(3)}",
                                        style = MaterialTheme.typography.bodySmall.copy(
                                            fontWeight = if (isCurrentDay) FontWeight.Bold else FontWeight.SemiBold,
                                            color = if (isCurrentDay) Emerald800 else TextPrimary
                                        )
                                    )
                                    Text(
                                        text = "${item.hijriDay} ${if (isUrdu) item.hijriMonthNameUr else item.hijriMonthNameEn.take(6)}",
                                        style = MaterialTheme.typography.bodySmall.copy(
                                            color = if (isCurrentDay) Emerald700 else TextTertiary,
                                            fontSize = 9.sp
                                        )
                                    )
                                }

                                DataCell(item.formattedTime(item.fajr, is24Hour), width = 80.dp, isHighlight = isCurrentDay)
                                DataCell(item.formattedTime(item.sunrise, is24Hour), width = 80.dp, isHighlight = isCurrentDay)
                                DataCell(item.formattedTime(item.dhuhr, is24Hour), width = 80.dp, isHighlight = isCurrentDay)
                                DataCell(item.formattedTime(item.asr, is24Hour), width = 80.dp, isHighlight = isCurrentDay)
                                DataCell(item.formattedTime(item.maghrib, is24Hour), width = 80.dp, isHighlight = isCurrentDay)
                                DataCell(item.formattedTime(item.isha, is24Hour), width = 80.dp, isHighlight = isCurrentDay)
                            }
                            HorizontalDivider(color = BorderSubtle, thickness = 0.5.dp)
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun HeaderCell(text: String, width: androidx.compose.ui.unit.Dp) {
    Text(
        text = text,
        modifier = Modifier.width(width),
        style = MaterialTheme.typography.labelMedium.copy(
            color = Color.White,
            fontWeight = FontWeight.Bold,
            textAlign = TextAlign.Center
        )
    )
}

@Composable
private fun DataCell(
    text: String,
    width: androidx.compose.ui.unit.Dp,
    isHighlight: Boolean
) {
    Text(
        text = text,
        modifier = Modifier.width(width),
        style = MaterialTheme.typography.bodySmall.copy(
            color = if (isHighlight) Emerald800 else TextPrimary,
            fontWeight = if (isHighlight) FontWeight.Bold else FontWeight.Normal,
            textAlign = TextAlign.Center
        )
    )
}
