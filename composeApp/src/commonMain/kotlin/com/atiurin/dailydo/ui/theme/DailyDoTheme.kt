package com.atiurin.dailydo.ui.theme

import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Shapes
import androidx.compose.material3.Typography
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

// Stitch design system colors
val Primary = Color(0xFF5700E1)
val PrimaryContainer = Color(0xFF7033FF)
val OnPrimary = Color(0xFFFFFFFF)
val OnPrimaryContainer = Color(0xFFE9DFFF)
val Secondary = Color(0xFF006E28)
val SecondaryContainer = Color(0xFF6FFB85)
val OnSecondary = Color(0xFFFFFFFF)
val OnSecondaryContainer = Color(0xFF00732A)
val Background = Color(0xFFF9F9F9)
val Surface = Color(0xFFF9F9F9)
val SurfaceContainerLowest = Color(0xFFFFFFFF)
val SurfaceContainerLow = Color(0xFFF3F3F3)
val SurfaceContainer = Color(0xFFEEEEEE)
val SurfaceContainerHigh = Color(0xFFE8E8E8)
val SurfaceContainerHighest = Color(0xFFE2E2E2)
val OnSurface = Color(0xFF1A1C1C)
val OnSurfaceVariant = Color(0xFF494456)
val Outline = Color(0xFF7A7488)
val OutlineVariant = Color(0xFFCBC3D9)
val Error = Color(0xFFBA1A1A)
val OnError = Color(0xFFFFFFFF)

private val LightColorScheme = lightColorScheme(
    primary = Primary,
    primaryContainer = PrimaryContainer,
    onPrimary = OnPrimary,
    onPrimaryContainer = OnPrimaryContainer,
    secondary = Secondary,
    secondaryContainer = SecondaryContainer,
    onSecondary = OnSecondary,
    onSecondaryContainer = OnSecondaryContainer,
    background = Background,
    surface = Surface,
    onSurface = OnSurface,
    onSurfaceVariant = OnSurfaceVariant,
    outline = Outline,
    outlineVariant = OutlineVariant,
    error = Error,
    onError = OnError,
    surfaceContainer = SurfaceContainer,
    surfaceContainerHigh = SurfaceContainerHigh,
    surfaceContainerHighest = SurfaceContainerHighest,
    surfaceContainerLow = SurfaceContainerLow,
    surfaceContainerLowest = SurfaceContainerLowest
)

private val DailyDoShapes = Shapes(
    extraSmall = RoundedCornerShape(4.dp),
    small = RoundedCornerShape(8.dp),
    medium = RoundedCornerShape(12.dp),
    large = RoundedCornerShape(16.dp),
    extraLarge = RoundedCornerShape(24.dp)
)

private val DailyDoTypography = Typography(
    displayLarge = TextStyle(fontWeight = FontWeight.Bold, fontSize = 56.sp),
    headlineLarge = TextStyle(fontWeight = FontWeight.Bold, fontSize = 32.sp),
    headlineMedium = TextStyle(fontWeight = FontWeight.Bold, fontSize = 28.sp),
    headlineSmall = TextStyle(fontWeight = FontWeight.SemiBold, fontSize = 24.sp),
    titleLarge = TextStyle(fontWeight = FontWeight.SemiBold, fontSize = 22.sp),
    titleMedium = TextStyle(fontWeight = FontWeight.SemiBold, fontSize = 16.sp),
    titleSmall = TextStyle(fontWeight = FontWeight.Medium, fontSize = 14.sp),
    bodyLarge = TextStyle(fontWeight = FontWeight.Normal, fontSize = 16.sp),
    bodyMedium = TextStyle(fontWeight = FontWeight.Normal, fontSize = 14.sp),
    bodySmall = TextStyle(fontWeight = FontWeight.Normal, fontSize = 12.sp),
    labelLarge = TextStyle(fontWeight = FontWeight.Medium, fontSize = 14.sp),
    labelSmall = TextStyle(fontWeight = FontWeight.Medium, fontSize = 11.sp)
)

@Composable
fun DailyDoTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = LightColorScheme,
        shapes = DailyDoShapes,
        typography = DailyDoTypography,
        content = content
    )
}
