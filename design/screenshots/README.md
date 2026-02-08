# Эталонные скриншоты (мобильная версия)

Скриншоты веб-приложения Daily Do в мобильном viewport (390×844, iPhone). Используются как эталон для реализации нативных мобильных приложений (Android, iOS).

## Файлы

| Файл | Экран |
|------|--------|
| `01-list-empty.png` | Список дней — пустое состояние |
| `02-create-form.png` | Создание списка — форма (имя, задачи) |
| `03-list-with-items.png` | Список дней — с карточками |
| `04-day-detail-todo.png` | Детали дня — все задачи в блоке «To Do» |
| `05-day-detail-with-completed.png` | Детали дня — часть задач в «Completed» |

## Как переснять

1. Запустите webapp: `cd webapp && npm run dev`
2. В другом терминале: `cd webapp && npx playwright test mobile-screenshots.spec.ts`

Либо с уже запущенным приложением на порту 3000:

```bash
BASE_URL=http://localhost:3000 npx playwright test mobile-screenshots.spec.ts
```

Скриншоты сохраняются в эту папку (`design/screenshots/`).
