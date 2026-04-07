# DailyDo

Приложение для ежедневного трекинга задач. Доступно на Android, iOS и в браузере.

## Структура проекта

```
DailyDo/
├── composeApp/   # Kotlin Multiplatform — Android + iOS
├── iosApp/       # iOS-обёртка (Swift/Xcode)
├── webapp/       # Web-приложение (Next.js)
└── backend/      # API-сервер (Fastify + PostgreSQL)
```

---

## Backend (Fastify + PostgreSQL)

**Стек:** Node.js, TypeScript, Fastify, PostgreSQL 16  
**Порт:** `3001`

### Запуск базы данных

```shell
cd backend
docker compose up -d
```

### Запуск сервера (dev)

```shell
cd backend
npm install
npm run dev
```

### Сборка и запуск (production)

```shell
cd backend
npm run build
npm start
```

### Тесты

```shell
cd backend
npm test
```

### Переменные окружения

Создайте файл `backend/.env` (по умолчанию уже настроено для локального Docker):

```env
PORT=3001
DATABASE_URL=postgresql://dailydo:dailydo@localhost:5433/dailydo
CORS_ORIGIN=http://localhost:3000
```

---

## Web-приложение (Next.js)

**Стек:** Next.js 16, React 19, TypeScript, Tailwind CSS  
**Порт:** `3000`

### Запуск (dev)

```shell
cd webapp
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

### Сборка и запуск (production)

```shell
cd webapp
npm run build
npm start
```

### Прочие команды

```shell
npm run lint        # проверка ESLint
npm run typecheck   # проверка типов TypeScript
npm run format      # форматирование Prettier

# E2E тесты (Playwright)
npm run test:integration
npm run test:integration:ui   # с UI-режимом
```

---

## Android-приложение (Compose Multiplatform)

**Стек:** Kotlin 2.3.0, Compose Multiplatform 1.10.0, Material3  
**minSdk:** 24 / **targetSdk:** 36

### Debug APK

```shell
./gradlew :composeApp:assembleDebug
```

### Установить на устройство

```shell
./gradlew :composeApp:installDebug
```

### Release APK

```shell
./gradlew :composeApp:assembleRelease
```

### Тесты

```shell
./gradlew :composeApp:allTests
```

---

## iOS-приложение (Compose Multiplatform)

**Требования:** macOS, Xcode

### Открыть в Xcode

```shell
open iosApp/iosApp.xcodeproj
```

Запустите через кнопку Run в Xcode или выберите run configuration в IDE.

> Для запуска на реальном устройстве укажите `TEAM_ID` в `iosApp/Configuration/Config.xcconfig`.

---

## Быстрый старт (полный стек)

```shell
# 1. База данных
cd backend && docker compose up -d

# 2. Backend
npm install && npm run dev &

# 3. Web
cd ../webapp && npm install && npm run dev
```

---

Подробнее о [Kotlin Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html).
