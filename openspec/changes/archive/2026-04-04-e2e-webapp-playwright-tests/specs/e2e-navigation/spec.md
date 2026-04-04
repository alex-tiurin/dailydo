## ADDED Requirements

### Requirement: Навигация вперёд со всех экранов
Пользователь SHALL иметь возможность перейти с главного экрана на каждый дочерний экран через соответствующие элементы UI.

#### Scenario: My Lists → Create New List через кнопку "+ New List"
- **WHEN** пользователь находится на `/` и кликает кнопку `new-list-button`
- **THEN** приложение SHALL перейти на `/create` и отобразить экран создания списка

#### Scenario: My Lists → Create New List через empty state
- **WHEN** пользователь находится на `/` и список пуст, и кликает `create-first-list-button`
- **THEN** приложение SHALL перейти на `/create`

#### Scenario: My Lists → Progress View через карточку дня
- **WHEN** пользователь кликает на карточку дня `day-card-{id}`
- **THEN** приложение SHALL перейти на `/list/{id}` и отобразить Progress View

### Requirement: Навигация назад на главный экран
Пользователь SHALL иметь возможность вернуться на главный экран с любого дочернего экрана.

#### Scenario: Progress View → My Lists через кнопку Back
- **WHEN** пользователь находится на `/list/:id` и кликает `back-button`
- **THEN** приложение SHALL перейти на `/` и отобразить My Lists

#### Scenario: Create New List → My Lists после сохранения
- **WHEN** пользователь заполняет форму создания и нажимает `save-list-button`
- **THEN** приложение SHALL перейти на `/` и новый список SHALL быть виден в списке

### Requirement: Полный круг навигации
Приложение SHALL поддерживать полный цикл: My Lists → Create → My Lists → Progress View → My Lists без ошибок.

#### Scenario: Полный навигационный цикл
- **WHEN** пользователь проходит путь: `/` → `/create` (создаёт список) → `/` → `/list/:id` → `/` (кнопка Back)
- **THEN** на каждом шаге SHALL отображаться правильный экран без JS-ошибок и краша
