## 1. Подготовка окружения

- [x] 1.1 Убедиться, что Android эмулятор запущен и доступен через adb
- [x] 1.2 Проверить статус Assertum MCP через assertum_status
- [x] 1.3 Настроить adb port forwarding для Assertum MCP (если требуется)

## 2. Тест 1: empty_state_create_list

- [x] 2.1 Вызвать assertum_restart_test для чистого состояния
- [x] 2.2 Сделать скриншот и верифицировать empty state с кнопкой "Create First List"
- [x] 2.3 Нажать "Create First List" через assertum_action
- [x] 2.4 Ввести имя списка "Morning Routine" и добавить задачи "Exercise" и "Breakfast"
- [x] 2.5 Нажать "Save List" и верифицировать карточку на My Lists через assertum_assertion
- [x] 2.6 Сохранить тест через assertum_save_test

## 3. Тест 2: task_toggle_completion

- [x] 3.1 Вызвать assertum_restart_test
- [x] 3.2 Создать тестовый список с задачами (setup данных)
- [x] 3.3 Нажать на карточку списка, верифицировать открытие Progress View
- [x] 3.4 Убедиться, что все задачи в секции Pending через assertum_assertion
- [x] 3.5 Нажать чекбокс первой задачи через assertum_action
- [x] 3.6 Верифицировать, что задача появилась в секции Completed и счётчик обновился
- [x] 3.7 Сохранить тест через assertum_save_test

## 4. Тест 3: navigation_flow

- [x] 4.1 Вызвать assertum_restart_test
- [x] 4.2 Создать хотя бы один список (для тестирования навигации в Progress View)
- [x] 4.3 Нажать кнопку создания нового списка, верифицировать экран Create New List
- [x] 4.4 Нажать "Back", верифицировать возврат на My Lists
- [x] 4.5 Нажать на карточку списка, верифицировать открытие Progress View
- [x] 4.6 Нажать "Back", верифицировать возврат на My Lists
- [x] 4.7 Сохранить тест через assertum_save_test

## 5. Тест 4: create_list_multiple_tasks

- [x] 5.1 Вызвать assertum_restart_test
- [x] 5.2 Создать список "Work Tasks" с задачами "Email", "Meeting", "Report"
- [x] 5.3 Верифицировать карточку "Work Tasks" с 3 задачами на My Lists
- [x] 5.4 Открыть список и верифицировать счётчик "0/3" и 3 задачи в Pending
- [x] 5.5 Сохранить тест через assertum_save_test

## 6. Тест 5: full_day_workflow

- [x] 6.1 Вызвать assertum_restart_test
- [x] 6.2 Создать список "Daily Goals" с задачами "Reading" и "Exercise"
- [x] 6.3 Открыть список и верифицировать начальное состояние "0/2"
- [x] 6.4 Переключить чекбокс задачи "Reading", верифицировать перемещение в Completed
- [x] 6.5 Переключить чекбокс задачи "Exercise", верифицировать перемещение в Completed
- [x] 6.6 Верифицировать финальный счётчик "2/2" и отсутствие задач в Pending
- [x] 6.7 Сохранить тест через assertum_save_test
