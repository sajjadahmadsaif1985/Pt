package com.pakistanprayertimes.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material.icons.filled.CalendarToday
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.pakistanprayertimes.app.data.model.PrayerName
import com.pakistanprayertimes.app.ui.components.CitySelectionDialog
import com.pakistanprayertimes.app.ui.components.PrayerCard
import com.pakistanprayertimes.app.ui.theme.*
import com.pakistanprayertimes.app.ui.viewmodel.PrayerViewModel
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    viewModel: PrayerViewModel,
    modifier: Modifier = Modifier
) {
    val selectedCity by viewModel.selectedCity.collectAsState()
    val selectedDate by viewModel.selectedDate.collectAsState()
    val prayerTimes by viewModel.prayerTimes.collectAsState()
    val currentPrayer by viewModel.currentPrayer.collectAsState()
    val nextPrayer by viewModel.nextPrayer.collectAsState()
    val nextPrayerTime by viewModel.nextPrayerTime.collectAsState()
    val countdownString by viewModel.countdownString.collectAsState()
    val is24Hour by viewModel.is24Hour.collectAsState()
    val isUrdu by viewModel.isUrdu.collectAsState()

    var showCityDialog by remember { mutableStateOf(false) }

    val isToday = selectedDate == LocalDate.now(viewModel.pkZone)

    val dateFormatter = remember(isUrdu) {
        DateTimeFormatter.ofPattern("EEEE, d MMMM yyyy", Locale.ENGLISH)
    }

    if (showCityDialog) {
        CitySelectionDialog(
            selectedCity = selectedCity,
            isUrdu = isUrdu,
            onCitySelected = { viewModel.selectCity(it) },
            onDismissRequest = { showCityDialog = false }
        )
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = if (isUrdu) "پاکستان نماز کے اوقات" else "Pakistan Prayer Times",
                            style = MaterialTheme.typography.titleLarge.copy(
                                fontWeight = FontWeight.Bold,
                                color = Color.White
                            )
                        )
                        Text(
                            text = if (isUrdu) "جامعہ علوم اسلامیہ کراچی طریقہ" else "Univ. of Islamic Sciences, Karachi",
                            style = MaterialTheme.typography.bodySmall.copy(
                                color = Gold400,
                                fontSize = 11.sp
                            )
                        )
                    }
                },
                actions = {
                    Button(
                        onClick = { showCityDialog = true },
                        colors = ButtonDefaults.buttonColors(
                            containerColor = Color.White.copy(alpha = 0.18f),
                            contentColor = Color.White
                        ),
                        contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp),
                        shape = RoundedCornerShape(20.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.LocationOn,
                            contentDescription = "Select City",
                            modifier = Modifier.size(16.dp),
                            tint = Gold400
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = if (isUrdu) selectedCity.nameUr else selectedCity.nameEn,
                            style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold)
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
        LazyColumn(
            modifier = modifier
                .fillMaxSize()
                .background(BackgroundLight)
                .padding(innerPadding)
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            item { Spacer(modifier = Modifier.height(2.dp)) }

            // Current & Next Prayer Hero Banner
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(18.dp),
                    colors = CardDefaults.cardColors(containerColor = Emerald800),
                    elevation = CardDefaults.cardElevation(defaultElevation = 3.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(
                                Brush.verticalGradient(
                                    colors = listOf(Emerald800, Emerald900)
                                )
                            )
                            .padding(20.dp)
                    ) {
                        Column {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.Top
                            ) {
                                Column {
                                    Text(
                                        text = if (isUrdu) "موجودہ وقت" else "Current Prayer",
                                        style = MaterialTheme.typography.labelMedium.copy(
                                            color = Color.White.copy(alpha = 0.75f)
                                        )
                                    )
                                    Text(
                                        text = currentPrayer?.let { if (isUrdu) it.urduName else it.englishName } ?: "-",
                                        style = MaterialTheme.typography.titleLarge.copy(
                                            color = Gold400,
                                            fontWeight = FontWeight.Bold
                                        )
                                    )
                                }

                                Column(horizontalAlignment = Alignment.End) {
                                    Text(
                                        text = if (isUrdu) "اگلی نماز" else "Next Prayer",
                                        style = MaterialTheme.typography.labelMedium.copy(
                                            color = Color.White.copy(alpha = 0.75f)
                                        )
                                    )
                                    Text(
                                        text = nextPrayer?.let { if (isUrdu) it.urduName else it.englishName } ?: "-",
                                        style = MaterialTheme.typography.titleLarge.copy(
                                            color = Color.White,
                                            fontWeight = FontWeight.Bold
                                        )
                                    )
                                    if (nextPrayerTime != null && prayerTimes != null) {
                                        Text(
                                            text = prayerTimes!!.formattedTime(nextPrayerTime!!, is24Hour),
                                            style = MaterialTheme.typography.bodySmall.copy(
                                                color = Gold100,
                                                fontWeight = FontWeight.SemiBold
                                            )
                                        )
                                    }
                                }
                            }

                            Spacer(modifier = Modifier.height(16.dp))
                            Divider(color = Color.White.copy(alpha = 0.15f))
                            Spacer(modifier = Modifier.height(14.dp))

                            // Live Countdown Ticker
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text(
                                    text = if (isUrdu) "اگلی نماز میں باقی وقت:" else "Next prayer in:",
                                    style = MaterialTheme.typography.bodyMedium.copy(
                                        color = Color.White.copy(alpha = 0.9f)
                                    )
                                )
                                Text(
                                    text = countdownString.ifEmpty { "--:--:--" },
                                    style = MaterialTheme.typography.headlineMedium.copy(
                                        color = Gold400,
                                        fontWeight = FontWeight.Bold,
                                        letterSpacing = 1.sp
                                    )
                                )
                            }
                        }
                    }
                }
            }

            // Date & Navigation Card (< Previous Day | Today | Next Day >)
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(14.dp),
                    colors = CardDefaults.cardColors(containerColor = SurfaceCard),
                    border = androidx.compose.foundation.BorderStroke(1.dp, BorderSubtle)
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(14.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text(
                            text = selectedDate.format(dateFormatter),
                            style = MaterialTheme.typography.titleMedium.copy(
                                fontWeight = FontWeight.Bold,
                                color = TextPrimary
                            )
                        )

                        prayerTimes?.let { pt ->
                            Spacer(modifier = Modifier.height(2.dp))
                            Text(
                                text = if (isUrdu) pt.hijriDateFormattedUr else pt.hijriDateFormattedEn,
                                style = MaterialTheme.typography.bodyMedium.copy(
                                    color = Emerald800,
                                    fontWeight = FontWeight.SemiBold
                                )
                            )
                        }

                        Spacer(modifier = Modifier.height(10.dp))

                        // Navigation Buttons
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            OutlinedButton(
                                onClick = { viewModel.goToPreviousDay() },
                                shape = RoundedCornerShape(8.dp),
                                contentPadding = PaddingValues(horizontal = 10.dp, vertical = 6.dp)
                            ) {
                                Icon(
                                    imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                                    contentDescription = "Previous Day",
                                    modifier = Modifier.size(16.dp),
                                    tint = Emerald800
                                )
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(
                                    text = if (isUrdu) "پچھلا دن" else "Prev Day",
                                    style = MaterialTheme.typography.labelSmall.copy(color = Emerald800)
                                )
                            }

                            Button(
                                onClick = { viewModel.goToToday() },
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = if (isToday) Emerald800 else Emerald50,
                                    contentColor = if (isToday) Color.White else Emerald800
                                ),
                                shape = RoundedCornerShape(8.dp),
                                contentPadding = PaddingValues(horizontal = 16.dp, vertical = 6.dp)
                            ) {
                                Icon(
                                    imageVector = Icons.Default.CalendarToday,
                                    contentDescription = "Today",
                                    modifier = Modifier.size(14.dp)
                                )
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(
                                    text = if (isUrdu) "آج" else "Today",
                                    style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold)
                                )
                            }

                            OutlinedButton(
                                onClick = { viewModel.goToNextDay() },
                                shape = RoundedCornerShape(8.dp),
                                contentPadding = PaddingValues(horizontal = 10.dp, vertical = 6.dp)
                            ) {
                                Text(
                                    text = if (isUrdu) "اگلا دن" else "Next Day",
                                    style = MaterialTheme.typography.labelSmall.copy(color = Emerald800)
                                )
                                Spacer(modifier = Modifier.width(4.dp))
                                Icon(
                                    imageVector = Icons.AutoMirrored.Filled.ArrowForward,
                                    contentDescription = "Next Day",
                                    modifier = Modifier.size(16.dp),
                                    tint = Emerald800
                                )
                            }
                        }
                    }
                }
            }

            // Prayer Time Cards
            prayerTimes?.let { pt ->
                item {
                    PrayerCard(
                        prayer = PrayerName.FAJR,
                        timeFormatted = pt.formattedTime(pt.fajr, is24Hour),
                        isActive = isToday && currentPrayer == PrayerName.FAJR,
                        isNext = isToday && nextPrayer == PrayerName.FAJR,
                        isUrdu = isUrdu
                    )
                }

                item {
                    PrayerCard(
                        prayer = PrayerName.SUNRISE,
                        timeFormatted = pt.formattedTime(pt.sunrise, is24Hour),
                        isActive = isToday && currentPrayer == PrayerName.SUNRISE,
                        isNext = isToday && nextPrayer == PrayerName.SUNRISE,
                        isUrdu = isUrdu
                    )
                }

                item {
                    PrayerCard(
                        prayer = PrayerName.DHUHR,
                        timeFormatted = pt.formattedTime(pt.dhuhr, is24Hour),
                        isActive = isToday && currentPrayer == PrayerName.DHUHR,
                        isNext = isToday && nextPrayer == PrayerName.DHUHR,
                        isUrdu = isUrdu
                    )
                }

                item {
                    PrayerCard(
                        prayer = PrayerName.ASR,
                        timeFormatted = pt.formattedTime(pt.asr, is24Hour),
                        isActive = isToday && currentPrayer == PrayerName.ASR,
                        isNext = isToday && nextPrayer == PrayerName.ASR,
                        isUrdu = isUrdu
                    )
                }

                item {
                    PrayerCard(
                        prayer = PrayerName.MAGHRIB,
                        timeFormatted = pt.formattedTime(pt.maghrib, is24Hour),
                        isActive = isToday && currentPrayer == PrayerName.MAGHRIB,
                        isNext = isToday && nextPrayer == PrayerName.MAGHRIB,
                        isUrdu = isUrdu
                    )
                }

                item {
                    PrayerCard(
                        prayer = PrayerName.ISHA,
                        timeFormatted = pt.formattedTime(pt.isha, is24Hour),
                        isActive = isToday && currentPrayer == PrayerName.ISHA,
                        isNext = isToday && nextPrayer == PrayerName.ISHA,
                        isUrdu = isUrdu
                    )
                }
            }

            item { Spacer(modifier = Modifier.height(16.dp)) }
        }
    }
}
