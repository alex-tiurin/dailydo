## Why

Текущие `testTag` в composeApp привязаны к внутренним ID сущностей (например, `testTag = "task_card_${taskList.id}"`, `testTag = "checkbox_${task.id}"`). Такие теги непригодны для стабильных UI‑автотестов: они меняются с каждой новой записью и не могут быть заранее известны тесту. Тест не может «найти» элемент по такому тегу, пока не узнал ID — а ID — это деталь реализации, а не пользовательские данные.

Починим это, чтобы автотесты на Assertum MCP могли находить элементы по стабильному тегу роли плюс пользовательским данным (имя списка, текст задачи), которыми тест сам управляет при создании сценария.

## What Changes

- **Mobile (composeApp)** — переписать все `testTag` в `commonMain`, убрав из них идентификаторы сущностей:
  - `TaskCard`: `"task_card_${taskList.id}"` → стабильный `testTag = "task_card"` + `contentDescription`, собранный из пользовательских данных (имя списка и дата).
  - `TaskItem` (Checkbox): `"checkbox_${task.id}"` → стабильный `testTag = "task_checkbox"` + `contentDescription = task.name`.
  - `CreateListScreen` (поле задачи): `"task_input_$index"` → стабильный `testTag = "task_input"` + `contentDescription`, отражающий пользовательский ввод (имя задачи либо порядковую роль для пустого поля).
  - `CreateListScreen` (`"list_name_field"`) — оставить как есть (уже стабильный, не содержит ID).
- **Контейнерные `testTag` на `LazyColumn`** — дать каждому списку стабильный тег‑скоуп, чтобы тест мог сужать поиск item‑ов до конкретного экрана/раздела:
  - `MyListsScreen` → `testTag = "my_lists_column"`.
  - `CreateListScreen` → `testTag = "create_list_column"`.
  - `ProgressScreen` → `testTag = "progress_column"`.
- Ввести и зафиксировать единое правило назначения `testTag` для composeApp: тег описывает **роль** элемента, а не конкретный экземпляр; уникальность среди однородных элементов обеспечивается пользовательскими данными через `contentDescription`/`Text`; повторяющиеся элементы живут внутри контейнера с собственным `testTag`, дающим скоуп.
- Обновить спецификацию `mobile-ui-tests` новым требованием к testability‑контракту composeApp, чтобы авторы тестов (и будущие изменения UI) опирались на это правило.

Breaking changes для автотестов нет, так как сейчас нет ни одного прохождения теста, опирающегося на текущие ID‑содержащие теги (в `mobile-ui-tests/e2e-*` они не используются).

## Capabilities

### New Capabilities
<!-- нет новых capability -->

### Modified Capabilities
- `mobile-ui-tests`: добавляется требование к стабильности `testTag` и использованию пользовательских данных в семантике UI‑элементов composeApp, чтобы автотесты могли находить элементы по роли + пользовательским данным.

## Impact

- Код: `composeApp/src/commonMain/kotlin/com/atiurin/dailydo/ui/component/TaskCard.kt`, `.../ui/component/TaskItem.kt`, `.../ui/screen/CreateListScreen.kt`, `.../ui/screen/MyListsScreen.kt`, `.../ui/screen/ProgressScreen.kt`.
- Тесты: последующие UI‑тесты (Assertum MCP, `mobile-ui-tests`) смогут находить элементы по стабильному тегу + пользовательским данным. Существующие e2e‑сценарии не обращаются к ID‑содержащим тегам, регрессий не ожидается.
- Платформы: только mobile (Android + iOS через Compose Multiplatform). Web/backend не затрагиваются.
- Без изменений публичного API, моделей (`Task`, `TaskList`) и бизнес‑логики.
