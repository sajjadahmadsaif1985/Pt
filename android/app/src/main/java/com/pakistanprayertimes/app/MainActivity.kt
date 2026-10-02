package com.pakistanprayertimes.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.pakistanprayertimes.app.ui.navigation.Screen
import com.pakistanprayertimes.app.ui.screens.HomeScreen
import com.pakistanprayertimes.app.ui.screens.MonthlyTimetableScreen
import com.pakistanprayertimes.app.ui.screens.SettingsScreen
import com.pakistanprayertimes.app.ui.theme.Emerald800
import com.pakistanprayertimes.app.ui.theme.PakistanPrayerTimesTheme
import com.pakistanprayertimes.app.ui.viewmodel.PrayerViewModel

class MainActivity : ComponentActivity() {

    private val viewModel: PrayerViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            PakistanPrayerTimesTheme {
                val navController = rememberNavController()
                val isUrdu by viewModel.isUrdu.collectAsState()

                Scaffold(
                    modifier = Modifier.fillMaxSize(),
                    bottomBar = {
                        val navBackStackEntry by navController.currentBackStackEntryAsState()
                        val currentRoute = navBackStackEntry?.destination?.route

                        NavigationBar(
                            containerColor = MaterialTheme.colorScheme.surface,
                            contentColor = Emerald800
                        ) {
                            NavigationBarItem(
                                icon = { Icon(Icons.Default.Home, contentDescription = "Home") },
                                label = { Text(if (isUrdu) Screen.Home.titleUr else Screen.Home.titleEn) },
                                selected = currentRoute == Screen.Home.route,
                                onClick = {
                                    if (currentRoute != Screen.Home.route) {
                                        navController.navigate(Screen.Home.route) {
                                            popUpTo(Screen.Home.route) { inclusive = true }
                                        }
                                    }
                                }
                            )
                            NavigationBarItem(
                                icon = { Icon(Icons.Default.CalendarMonth, contentDescription = "Monthly") },
                                label = { Text(if (isUrdu) Screen.Monthly.titleUr else Screen.Monthly.titleEn) },
                                selected = currentRoute == Screen.Monthly.route,
                                onClick = {
                                    if (currentRoute != Screen.Monthly.route) {
                                        navController.navigate(Screen.Monthly.route) {
                                            launchSingleTop = true
                                        }
                                    }
                                }
                            )
                            NavigationBarItem(
                                icon = { Icon(Icons.Default.Settings, contentDescription = "Settings") },
                                label = { Text(if (isUrdu) Screen.Settings.titleUr else Screen.Settings.titleEn) },
                                selected = currentRoute == Screen.Settings.route,
                                onClick = {
                                    if (currentRoute != Screen.Settings.route) {
                                        navController.navigate(Screen.Settings.route) {
                                            launchSingleTop = true
                                        }
                                    }
                                }
                            )
                        }
                    }
                ) { innerPadding ->
                    NavHost(
                        navController = navController,
                        startDestination = Screen.Home.route,
                        modifier = Modifier.padding(innerPadding)
                    ) {
                        composable(Screen.Home.route) {
                            HomeScreen(viewModel = viewModel)
                        }
                        composable(Screen.Monthly.route) {
                            MonthlyTimetableScreen(viewModel = viewModel)
                        }
                        composable(Screen.Settings.route) {
                            SettingsScreen(viewModel = viewModel)
                        }
                    }
                }
            }
        }
    }
}
