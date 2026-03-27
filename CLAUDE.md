# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Проект: DailyDo

Приложение для ежедневного трекинга задач. UI состоит из 3 экранов:
1. **Список активностей по дням** — новые записи отображаются сверху
2. **Создание списка задач** — поля: имя, список задач
3. **Просмотр/редактирование прогресса по дню** — checkbox рядом с каждой задачей, экран разделён на невыполненные и выполненные. При клике на checkbox задача перечёркивается и перемещается в раздел выполненных.

## Структура проекта

```
DailyDo/
├── composeApp/          # Kotlin Multiplatform (Android + iOS)
├── iosApp/              # iOS-обёртка (Swift/Xcode)
├── web/                 # React web-приложение (планируется)
└── backend/             # Node.js сервер (планируется)
```

## Мобильное приложение (Compose Multiplatform)

### Стек
- **Kotlin**: 2.3.0
- **Compose Multiplatform**: 1.10.0
- **Material3**: 1.10.0-alpha05
- **Таргеты**: `androidTarget`, `iosArm64`, `iosSimulatorArm64`
- **Пакет**: `com.atiurin.dailydo`
- **minSdk**: 24 / **targetSdk**: 36

### Точки входа
- **Android**: `composeApp/src/androidMain/.../MainActivity.kt` → вызывает `App()` из commonMain
- **iOS**: `iosApp/iosApp/iOSApp.swift` → `ContentView.swift` → `MainViewController.kt` → `App()`
- **Общий UI**: `composeApp/src/commonMain/kotlin/com/atiurin/dailydo/App.kt`

### Сборка и запуск

```bash
# Android — debug APK
./gradlew :composeApp:assembleDebug

# Android — установить на устройство
./gradlew :composeApp:installDebug

# Android — release APK
./gradlew :composeApp:assembleRelease

# iOS — открыть в Xcode
open iosApp/iosApp.xcodeproj

# Запустить тесты
./gradlew :composeApp:allTests

# Очистить
./gradlew clean
```

### Архитектура commonMain/androidMain/iosMain
- Весь UI и бизнес-логика — в `commonMain`
- `Platform.kt` объявляет `expect fun getPlatform()`, реализации — в `androidMain` и `iosMain`
- Платформенный код сведён к минимуму (только обёртки Activity/ViewController)

## Backend (Node.js — планируется)

- Хранит данные **в памяти** (не использует БД), только для демо
- Должен располагаться в директории `backend/`

## Web-приложение (React — планируется)

- Должно располагаться в директории `web/`
- Реализует те же 3 экрана, что и мобильное приложение

## Конфигурация iOS

Перед запуском на реальном устройстве нужно указать `TEAM_ID` в `iosApp/Configuration/Config.xcconfig`.