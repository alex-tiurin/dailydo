## 1. Audit current testTags

- [x] 1.1 Подтвердить список всех `testTag` в `composeApp/src/commonMain` (ожидаемо: `TaskCard.kt`, `TaskItem.kt`, `CreateListScreen.kt` — поле имени списка и поле задачи)
- [x] 1.2 Убедиться, что никакой код снаружи `composeApp` (e2e‑сценарии в `mobile-ui-tests`, assertum тесты) не ссылается на строки `"task_card_"` или `"checkbox_"` — иначе запланировать их обновление в рамках тестового change, а не этого

## 2. Fix TaskCard

- [x] 2.1 В `composeApp/src/commonMain/kotlin/com/atiurin/dailydo/ui/component/TaskCard.kt` заменить `testTag = "task_card_${taskList.id}"` на константу `testTag = "task_card"`
- [x] 2.2 В том же `.semantics { ... }` блоке добавить `contentDescription = "${taskList.name}, ${taskList.date}"`, чтобы тест мог дизамбигуировать карточку по пользовательским полям
- [x] 2.3 Добавить импорт `androidx.compose.ui.semantics.contentDescription`

## 3. Fix TaskItem checkbox

- [x] 3.1 В `composeApp/src/commonMain/kotlin/com/atiurin/dailydo/ui/component/TaskItem.kt` заменить `testTag = "checkbox_${task.id}"` на константу `testTag = "task_checkbox"`
- [x] 3.2 В том же `.semantics { ... }` блоке чекбокса добавить `contentDescription = task.name`
- [x] 3.3 Добавить импорт `androidx.compose.ui.semantics.contentDescription`

## 4. Fix CreateListScreen task input

- [x] 4.1 В `composeApp/src/commonMain/kotlin/com/atiurin/dailydo/ui/screen/CreateListScreen.kt` в `itemsIndexed(taskInputs)` оставить `testTag = "task_input_$index"` — позиционный индекс, не entity ID; добавить `contentDescription = taskText.ifBlank { "Task input" }` для пользовательских данных
- [x] 4.2 Добавить `contentDescription` в `.semantics { ... }` блок: при заполненном поле — текст задачи, при пустом — роль "Task input"
- [x] 4.3 Оставить `testTag = "list_name_field"` на поле имени списка без изменений (уже стабилен)
- [x] 4.4 Добавить импорт `androidx.compose.ui.semantics.contentDescription`

## 5. Add container testTags to LazyColumns

- [x] 5.1 В `composeApp/src/commonMain/kotlin/com/atiurin/dailydo/ui/screen/MyListsScreen.kt` на `LazyColumn` (строка ~111) добавить `.semantics { testTag = "my_lists_column" }` в цепочку `Modifier`
- [x] 5.2 В `composeApp/src/commonMain/kotlin/com/atiurin/dailydo/ui/screen/CreateListScreen.kt` на `LazyColumn` (строка ~92) добавить `.semantics { testTag = "create_list_column" }`
- [x] 5.3 В `composeApp/src/commonMain/kotlin/com/atiurin/dailydo/ui/screen/ProgressScreen.kt` на `LazyColumn` (строка ~102) добавить `.semantics { testTag = "progress_column" }`
- [x] 5.4 Добавить импорты `androidx.compose.ui.semantics.semantics` и `androidx.compose.ui.semantics.testTag` в `MyListsScreen.kt` и `ProgressScreen.kt` (в `CreateListScreen.kt` они уже есть)

## 6. Verify

- [x] 6.1 Запустить `./gradlew :composeApp:assembleDebug` — сборка проходит без ошибок компиляции
- [x] 6.2 Запустить `./gradlew :composeApp:allTests` — существующие тесты зелёные
- [ ] 6.3 Прогнать существующий Assertum e2e сценарий — зелёный, т. к. он не опирался на удалённые ID‑теги и новые контейнерные теги не конфликтуют с его локаторами
- [x] 6.4 Выполнить `openspec validate fix-compose-testtags --strict` — проходит без ошибок
