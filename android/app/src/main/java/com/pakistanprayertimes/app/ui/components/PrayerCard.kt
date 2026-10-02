package com.pakistanprayertimes.app.ui.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.pakistanprayertimes.app.data.model.PrayerName
import com.pakistanprayertimes.app.ui.theme.*

@Composable
fun PrayerCard(
    prayer: PrayerName,
    timeFormatted: String,
    isActive: Boolean,
    isNext: Boolean,
    isUrdu: Boolean,
    modifier: Modifier = Modifier
) {
    val cardBg = when {
        isNext -> Emerald50
        isActive -> Emerald800.copy(alpha = 0.08f)
        else -> SurfaceCard
    }

    val borderColor = when {
        isNext -> Emerald800
        isActive -> Gold500
        else -> BorderSubtle
    }

    val borderWidth = if (isNext || isActive) 1.5.dp else 1.dp

    Card(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(containerColor = cardBg),
        border = BorderStroke(borderWidth, borderColor),
        elevation = CardDefaults.cardElevation(defaultElevation = if (isNext) 3.dp else 1.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 18.dp, vertical = 14.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Column {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = if (isUrdu) prayer.urduName else prayer.englishName,
                        style = MaterialTheme.typography.titleLarge.copy(
                            fontWeight = if (isNext || isActive) FontWeight.Bold else FontWeight.SemiBold,
                            color = if (isNext) Emerald800 else TextPrimary
                        )
                    )
                    if (!isUrdu) {
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = prayer.urduName,
                            style = MaterialTheme.typography.bodyMedium.copy(
                                color = TextSecondary,
                                fontSize = 15.sp
                            )
                        )
                    }
                }

                if (isNext) {
                    Spacer(modifier = Modifier.height(2.dp))
                    Text(
                        text = if (isUrdu) "اگلی نماز" else "Next Prayer",
                        style = MaterialTheme.typography.labelMedium.copy(
                            color = Emerald800,
                            fontWeight = FontWeight.Bold
                        )
                    )
                } else if (isActive) {
                    Spacer(modifier = Modifier.height(2.dp))
                    Text(
                        text = if (isUrdu) "موجودہ وقت" else "Current Prayer",
                        style = MaterialTheme.typography.labelMedium.copy(
                            color = Gold500,
                            fontWeight = FontWeight.SemiBold
                        )
                    )
                }
            }

            Text(
                text = timeFormatted,
                style = MaterialTheme.typography.headlineMedium.copy(
                    fontWeight = FontWeight.Bold,
                    color = if (isNext) Emerald800 else TextPrimary
                )
            )
        }
    }
}
