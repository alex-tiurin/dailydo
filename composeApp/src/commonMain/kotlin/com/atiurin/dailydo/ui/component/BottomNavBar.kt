package com.atiurin.dailydo.ui.component

import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.List
import androidx.compose.material.icons.filled.Settings

@Composable
fun BottomNavBar(
    selectedTab: Int = 0,
    onMyListsClick: () -> Unit = {},
    onSettingsClick: () -> Unit = {}
) {
    NavigationBar(
        containerColor = MaterialTheme.colorScheme.surfaceContainerLowest
    ) {
        NavigationBarItem(
            selected = selectedTab == 0,
            onClick = onMyListsClick,
            icon = { Icon(Icons.Filled.List, contentDescription = "My Lists") },
            label = { Text("My Lists") },
            colors = NavigationBarItemDefaults.colors(
                selectedIconColor = MaterialTheme.colorScheme.primary,
                selectedTextColor = MaterialTheme.colorScheme.primary,
                indicatorColor = MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.15f)
            )
        )
        NavigationBarItem(
            selected = selectedTab == 1,
            onClick = onSettingsClick,
            icon = { Icon(Icons.Filled.Settings, contentDescription = "Settings") },
            label = { Text("Settings") },
            colors = NavigationBarItemDefaults.colors(
                selectedIconColor = MaterialTheme.colorScheme.primary,
                selectedTextColor = MaterialTheme.colorScheme.primary,
                indicatorColor = MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.15f)
            )
        )
    }
}
