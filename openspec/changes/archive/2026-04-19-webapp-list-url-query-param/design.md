## Контекст и мотивация

В webapp сейчас три UI-маршрута:

```
/            → app/page.tsx            (My Lists)
/create      → app/create/page.tsx     (Create New List)
/list/:id    → app/list/[id]/page.tsx  (Progress View)
```

Change решает две связанные задачи одним пакетом:

1. Убрать динамический сегмент из pathname Progress View (для стабильного Assertum-бакетинга).
2. После создания списка отправлять пользователя в Progress View только что созданного дня, а не на My Lists.

## Ключевые решения

### Решение 1. Структура роута в Next.js App Router

Проблема: `useSearchParams` в App Router должен быть обёрнут в `<Suspense>`, иначе `next build` падает ошибкой «useSearchParams() should be wrapped in a suspense boundary at page ...».

Решение: разделить страницу на два файла.

```
webapp/app/list/
├── page.tsx              (server component — Suspense wrapper)
└── ProgressView.tsx      ("use client" — UI с useSearchParams)
```

```tsx
// page.tsx (server)
import { Suspense } from 'react'
import ProgressView from './ProgressView'

export default function Page() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ProgressView />
    </Suspense>
  )
}
```

```tsx
// ProgressView.tsx (client)
"use client"
import { useSearchParams } from 'next/navigation'
// ...
const id = useSearchParams().get('id')
```

**Отвергнутая альтернатива**: оставить одним файлом с `"use client"`. Работает в dev, но ломает прод-билд.

### Решение 2. Обработка отсутствующего / невалидного `id`

Сейчас `app/list/[id]/page.tsx:58-61` делает `router.push('/')` прямо в теле функции-компонента — сайд-эффект в рендере, антипаттерн. С query-параметром ситуация `id = null` (нет параметра) становится штатной, поэтому логика требуется явная.

Подход: редирект в `useEffect`, не в рендере.

```tsx
const id = useSearchParams().get('id')
const list = id ? lists.find(l => l.id === id) : undefined

useEffect(() => {
  if (!loading && (!id || !list)) router.replace('/')
}, [loading, id, list, router])

if (loading || !list) return <p>Loading...</p>
```

**Отвергнутая альтернатива**: серверный `redirect()` через `next/navigation`. Требует серверный компонент и загрузку данных на сервере, чего в webapp нет (данные через client-side context). Out of scope.

### Решение 3. API-роуты не трогать

REST API `/api/lists/[id]`, `/api/lists/[id]/tasks/[taskId]` — это внутренний контракт клиент↔сервер. Ни рекордер, ни пользователь его не видят. Сохранение path-параметров соответствует REST-стилю.

### Решение 4. Предварительная валидация гипотезы бакетинга

Всё изменение имеет смысл только если Assertum бакетит по pathname и игнорирует query. Это эмпирический вопрос. Валидация ставится **блокирующей задачей** в `tasks.md` — если гипотеза ложна, change отменяется.

### Решение 5. Куда уходит пользователь после `createList()`

Выбранное поведение:

```
save Save List ─▶ POST /api/lists ─▶ ответ { list }
                                         │
                                         ▼
                           dispatch(ADD_LIST, list)
                                         │
                                         ▼
                        router.push(`/list?id=${list.id}`)
```

Почему так:
- UX: пользователь заполнил имя списка и задачи — естественное продолжение открыть этот день и начать отмечать чекбоксы. Альтернатива «вернуться на My Lists и найти новый список» требует дополнительного клика и визуального поиска.
- Данные уже под рукой: `createList()` в `lib/lists-context.tsx:125` возвращает `TaskList` (с `id` от сервера). Никакого дополнительного запроса `getList(id)` не нужно.

**Отвергнутая альтернатива**: оставить `router.push('/')`, но выделять только что созданный список визуально (анимация, подсветка). Требует отдельного UI-фичеринга и сложнее в тестировании; не проще.

### Решение 6. Порядок `dispatch` / `router.push` и fallback-редирект

Риск: Progress View в Решении 2 имеет `useEffect`, редиректящий на `/`, если `!list`. Если `router.push('/list?id=NEW')` выполнится **до** `dispatch(ADD_LIST)`, новый Progress View примонтируется в пустом контексте, не найдёт список, и `useEffect` отправит пользователя обратно на `/`. Это будет выглядеть как мерцание и UX-регрессия.

Решение: опираться на существующую последовательность в `createList()`:

```tsx
async function createList(data) {
  const newList = await apiCreateList(data)    // 1. сеть
  dispatch({ type: 'ADD_LIST', payload: newList })  // 2. state обновлён СИНХРОННО
  return newList                                // 3. возврат
}
```

В `create/page.tsx`:

```tsx
const newList = await createList({...})      // state уже обновлён к моменту return
router.push(`/list?id=${newList.id}`)        // навигация после этого
```

`dispatch` в `useReducer` применяется синхронно до следующего рендера. К моменту, когда Next.js начинает рендерить Progress View, context уже содержит новый список — fallback не сработает.

Фиксируем это как инвариант: **обновлять state до router.push никогда не нарушать**. В code review блока 4 в `tasks.md` явно проверяем, что между `await createList(...)` и `router.push(...)` не вставлен другой `await` (например, вызов аналитики), который мог бы сдвинуть порядок рендеринга.

### Решение 7. Пустые списки разрешены

Пользователь может сохранить список с 0 задач (все поля пустые, `filtered` в `create/page.tsx:41` отсеивает их). По новой логике он попадает на Progress View с пустыми секциями «Pending 0» и «Completed 0».

Это сознательный выбор: валидация «нужна хотя бы одна задача» — отдельное UX-решение (`webapp-screens` capability в секции Create New List), вне scope этого change. Сейчас фиксируем, что **change не добавляет и не убирает валидацию**; поведение «пустой список → пустой Progress View» принимается.

Флажок на будущее: когда потребуется ужесточение, откроется отдельный change вроде `webapp-validate-nonempty-list`.

## Последовательности

### Создание нового списка — новое поведение

```
User     create/page.tsx    lists-context       Backend         router
 │             │                  │                │              │
 │─fill form──▶│                  │                │              │
 │─submit─────▶│                  │                │              │
 │             │─createList(data)▶│                │              │
 │             │                  │─POST /api/lists▶              │
 │             │                  │◀─{ newList }───│              │
 │             │                  │ dispatch(ADD_LIST)            │
 │             │◀──newList────────│                │              │
 │             │                                                   │
 │             │───────push(`/list?id=${newList.id}`)────────────▶│
 │                                                                 │
 │                                        (Next mount ProgressView)
 │                                        useSearchParams → id=NEW
 │                                        lists.find(id=NEW) → найден
 │                                        render Progress View
```

### Переход на Progress View по карточке дня (после change)

```
User      MyListsPage          router          page.tsx → ProgressView
 │             │                  │                      │
 │─click card▶│                  │                      │
 │             │─push(`/list?id=abc`)▶                  │
 │             │                  │──<Suspense>─────────▶
 │                                                       │─useSearchParams─▶ id='abc'
 │                                                       │
```

### Обработка невалидного/отсутствующего id

```
User    page.tsx (Suspense)    ProgressView (client)    router
 │            │                       │                    │
 │─goto /list?id=bogus──▶             │                    │
 │                                     │──useEffect: !list──▶
 │                                     │                    │──replace('/')──▶
 │                                     │◀──────rerender at '/'────
```

## Влияние на контракты

| Контракт                                           | Изменяется?                      |
|----------------------------------------------------|----------------------------------|
| UI-маршрут Progress View                           | **Да**: `/list/:id` → `/list?id=<id>` |
| Destination после save в Create New List           | **Да**: `/` → `/list?id=<newId>` |
| REST API `/api/lists/:id`                          | Нет                              |
| Формат `data-testid`                               | Нет                              |
| Схема `List` / `Task`                              | Нет                              |
| Валидация формы Create (обязательность задач)      | Нет (по-прежнему не валидируется) |
| TC-N-02, TC-N-03, TC-L-01 в `docs/user_stories.md` | Ожидаемые URL обновляются         |

## Что остаётся open

- Как именно Assertum бакетит web-URL — закрывается блоком 1 в `tasks.md`.
- Если позже потребуется shareable-ссылка на день с человеко-читаемым slug (`/list?id=2026-04-19`), — отдельный change.
- Валидация «нужна хотя бы одна задача» при сохранении — отдельный change.
