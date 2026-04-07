## Why

Change решает две связанные проблемы в одной области (URL + навигация Progress View) — поэтому объединён в один:

1. **Assertum-бакетинг**. Assertum web-рекордер (`src/page-objects/localhost_3000/`, `autoGenerateScreenObjects: true` в `assertum-android-config.json`) группирует авто-генерируемые ScreenObjects по URL. Текущий маршрут Progress View — `/list/:id` — содержит динамический сегмент: каждый `listId` попадает в отдельный бакет, что даёт по ScreenObject'у на реальную запись вместо одного на шаблон экрана. Перенос идентификатора в query (`/list?id=<listId>`) стабилизирует pathname.

2. **Навигация после создания списка**. Сейчас `webapp/app/create/page.tsx:49` после успешного `createList()` делает `router.push('/')` — пользователь возвращается на My Lists и вынужден вручную найти и открыть только что созданный день, чтобы отмечать задачи. Логичнее сразу открыть его в Progress View. `createList()` в контексте уже возвращает `TaskList` с `id` (`webapp/lib/lists-context.tsx:125-129`) — данные для редиректа под рукой.

Оба пункта переопределяют одни и те же спецификационные сценарии (`webapp-screens` → Save list; Progress View screen) и одни и те же тесты (`CreateListPage`, `MyListsPage`, `ProgressViewPage`). Разделять — больше церемоний, чем пользы.

**Платформа**: только webapp (Next.js в `webapp/`). Mobile и backend не затрагиваются.

## What Changes

### URL-форма Progress View

- **BREAKING (URL)**: маршрут `/list/:id` заменяется на `/list?id=<listId>`.
- **Структура роута** (Next.js App Router): `webapp/app/list/[id]/page.tsx` → `webapp/app/list/page.tsx`. Папка `[id]` удаляется.
- **Suspense boundary**: `useSearchParams` требует `<Suspense>` при статическом рендере. Страница разбивается на серверный `page.tsx` (обёртка) и клиентский child с `useSearchParams`.
- **Клиентский код Progress View**: `useParams<{id:string}>()` → `useSearchParams().get('id')`.
- **Навигация с My Lists**: `router.push(\`/list/${list.id}\`)` → `router.push(\`/list?id=${list.id}\`)` в `webapp/app/page.tsx`.

### Навигация после создания списка

- В `webapp/app/create/page.tsx`: после успешного `createList()` — `router.push(\`/list?id=${newList.id}\`)` вместо `router.push('/')`. Результат `createList()` уже типизирован как `TaskList`, рефакторинг контекста не нужен.
- **Пустые списки разрешены**: если пользователь сохранит список с 0 задач (все ряды пустые и отфильтрованы), всё равно навигируем на `/list?id=<newId>`. Пользователь увидит Progress View с пустыми секциями «Pending 0» и «Completed 0». Валидацию «нужна хотя бы одна задача» **не добавляем** — это отдельное UX-решение, out of scope.

### Тесты и Page Objects

- `webapp/tests/page-objects/MyListsPage.ts:51` — `toHaveURL(\`/list/${listId}\`)` → `toHaveURL(\`/list?id=${listId}\`)`.
- `webapp/tests/page-objects/ProgressViewPage.ts:28, 34` — `goto(\`/list/${listId}\`)` → `goto(\`/list?id=${listId}\`)` (×2).
- `webapp/tests/page-objects/CreateListPage.ts:48` — в `submitList` ассерт `toHaveURL('/')` заменяется на паттерн `toHaveURL(/^.*\/list\?id=.+$/)` (точный id неизвестен до создания; проверяем форму URL).
- `webapp/tests/integration/navigation.spec.ts:32` — название теста переходит на `/list?id=...`.

### Что НЕ меняется

- API-роуты `/api/lists/[id]`, `/api/lists/[id]/tasks/[taskId]` — отдельный REST-слой, не участвует в UI-навигации.
- Схема данных `List`/`Task`.
- Формат `data-testid`.
- Поведение при клике «Back» на Progress View (всё так же ведёт на `/`).

## Capabilities

### Modified Capabilities

- `webapp-screens`:
  - маршрут Progress View переопределяется с `/list/:id` на `/list?id=<listId>`;
  - сценарий «Save list» меняет destination: после сохранения пользователь оказывается на Progress View нового списка, а не на `/`;
  - добавляется явный сценарий «сохранение пустого списка задач» — поведение то же, что и для непустого (редирект на Progress View).
- `e2e-navigation`:
  - сценарий перехода на Progress View ожидает `/list?id=...`;
  - сценарий «Create New List → ... после сохранения» перестаёт ожидать `/` и начинает ожидать `/list?id=<newId>`;
  - сценарий полного круга обновляется.

### New Capabilities

_(нет)_

## Impact

### Код

- `webapp/app/list/[id]/page.tsx` — удаляется, содержимое переносится в новую структуру.
- `webapp/app/list/page.tsx` — новый: server-компонент с `<Suspense>`.
- `webapp/app/list/ProgressView.tsx` (или близкое имя) — клиентский компонент с `useSearchParams`.
- `webapp/app/page.tsx:54` — обновление `router.push`.
- `webapp/app/create/page.tsx:45-49` — сохранение `newList`, обновление `router.push`.
- `webapp/tests/page-objects/MyListsPage.ts:51` — ожидаемый URL.
- `webapp/tests/page-objects/ProgressViewPage.ts:28, 34` — goto (×2).
- `webapp/tests/page-objects/CreateListPage.ts:48` — ожидаемый URL в `submitList` (пригодится regex-паттерн).
- `webapp/tests/integration/navigation.spec.ts:32` — описание теста.

### Assertum

Папка `src/page-objects/localhost_3000/` после перезаписи сценариев содержит один бакет/файл для Progress View, независимо от количества сохранённых списков в прогоне.

### Пред-валидация (блокирующая)

До начала работ — подтвердить эмпирически, что Assertum web-рекордер бакетит по pathname и **игнорирует query**. Если гипотеза опровергнута (два query-значения → два бакета), change отменяется или переосмысливается (см. `tasks.md` блок 1).

### Риски

- `useSearchParams` без `<Suspense>` ломает `next build`. Устраняется структурной разбивкой page-компонента (см. `design.md` Решение 1).
- `toHaveURL` в Playwright по умолчанию строгое сравнение. Для `CreateListPage.submitList` новый id заранее неизвестен — используем regex `/\/list\?id=/`.
- Потенциальный race: `createList()` должен обновить контекст **до** `router.push`, иначе fallback-редирект на `/` сработает и отправит пользователя обратно. Обсуждается в `design.md` Решение 6.
- Пустой Progress View как UX тупик — осознанно принимаем (`design.md` Решение 7).

### Документация

- `docs/user_stories.md`: TC-L-01, TC-N-04, TC-N-02 — описание «после save → `/`» и «`/list/:id`» правим.
- OpenSpec спеки обновляются через delta-файлы в этом change.

### Зависимости

Нет новых пакетов. `next/navigation` уже используется.

### Mobile / Backend

Не затрагиваются.
