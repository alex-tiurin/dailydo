## 1. Предварительная валидация гипотезы (блокирующая)

- [ ] 1.1 Запустить webapp локально (`cd webapp && npm run dev`), убедиться, что `http://localhost:3000` доступен.
- [ ] 1.2 Открыть Assertum web-рекордер на двух URL с отличающимся query: `/list?probe=abc`, `/list?probe=def` (страница отрендерит fallback-редирект — это ок, важен сам факт посещения URL рекордером).
- [ ] 1.3 Осмотреть `src/page-objects/localhost_3000/` после записи. Зафиксировать результат:
  - один файл/бакет → гипотеза подтверждена, продолжаем.
  - два файла/бакета → гипотеза опровергнута, **останавливаемся**: переход с path на query не даёт стабильного бакета, change отменяется или переосмысливается.
- [ ] 1.4 Результат валидации записать в шапку `proposal.md` (дата, итог, краткий вывод).

## 2. Тесты «красные» до кода (TDD)

- [x] 2.1 Обновить `webapp/tests/page-objects/ProgressViewPage.ts` — `goto(\`/list/${listId}\`)` → `goto(\`/list?id=${listId}\`)` в методах `open` и `attemptOpen` (строки 28 и 34).
- [x] 2.2 Обновить `webapp/tests/page-objects/MyListsPage.ts:51` — `toHaveURL(\`/list/${listId}\`)` → `toHaveURL(\`/list?id=${listId}\`)`.
- [x] 2.3 Обновить `webapp/tests/page-objects/CreateListPage.ts:48` — `toHaveURL('/')` → `toHaveURL(/\/list\?id=.+$/)` (id заранее неизвестен, проверяем паттерн URL).
- [x] 2.4 Обновить заголовок теста в `webapp/tests/integration/navigation.spec.ts:32` — формулировку `/list/:id` → `/list?id=...`.
- [x] 2.5 Переписать тест `webapp/tests/integration/create-list.spec.ts:68` ("navigates to / after successful POST"): переименовать в "navigates to /list?id=<newId> after successful POST", ожидать `toHaveURL(/\/list\?id=.+$/)`.
- [x] 2.6 Привести downstream-шаги всех e2e-тестов к новому landing (Progress View нового списка). Конкретно:
  - `webapp/tests/e2e/list-crud.spec.ts` TC-L-01 (строки 27-32): после `submitList()` нажать Back, потом `verifyDayCardWithNameVisible`. TC-L-03 skipped — не трогаем.
  - `webapp/tests/e2e/navigation.spec.ts` (строки 39-44, 62-64, 94-100): после `submitList()` пользователь уже на Progress View — убрать лишние `clickDayCardByName(listName)` между submit и следующими действиями; если тест требует вернуться на MyLists для проверки карточки, добавить `clickBackButton()` явно.
  - `webapp/tests/e2e/task-crud.spec.ts` (строки 33-39, 61-67, 96-100, 132-134): аналогично — после submit пропускать шаг "open Progress View", так как уже там. Шаг "save and verify redirect to My Lists" переименовать в "save and verify redirect to Progress View".
- [x] 2.7 Запустить тесты — 7 failed (TDD red: `submitList()` ждёт `/list?id=`, приложение отдаёт `/`), 2 passed (TC-L-02, TC-N-01), 4 skipped. Зафиксировано.
- [x] CodeReview: нашёл 2 дефекта — `MyListsPage.clickDayCardByName` старый regex `/\/list\//`, и orphaned step в TC-N-04. Оба исправлены.

## 3. Реструктуризация роута под Suspense

- [x] 3.1 Создать `webapp/app/list/page.tsx` как server-компонент: `<Suspense fallback={<p>Loading...</p>}>` вокруг клиентского child.
- [x] 3.2 Создать `webapp/app/list/ProgressView.tsx` (`"use client"`) — перенести всё содержимое текущего `webapp/app/list/[id]/page.tsx`, заменив `useParams` на `useSearchParams`.
- [x] 3.3 Обработать `id === null` / `!list`: редирект только в `useEffect`, НЕ в теле компонента. При `loading` показывать fallback; при `!list` после загрузки — `router.replace('/')`.
- [x] 3.4 Удалить папку `webapp/app/list/[id]/` целиком.
- [x] 3.5 `npm run build` — зелёный. `/list` — static, Suspense boundary корректен.
- [x] CodeReview: OK. Исправлены: разделён `if (loading || !list)` на два guard'а; добавлен `if (!task) return` в `handleToggle`.

## 4. Навигация с My Lists и из Create

- [x] 4.1 В `webapp/app/page.tsx:54` заменить `router.push(\`/list/${list.id}\`)` на `router.push(\`/list?id=${list.id}\`)`.
- [x] 4.2 В `webapp/app/create/page.tsx`: сохранён `newList`, `router.push(\`/list?id=${newList.id}\`)`. Нет дополнительных `await` между createList и push.
- [x] 4.3 Grep — `/list/` литералов в UI-коде нет. API-роуты `/api/lists/` не затронуты.
- [x] 4.4 e2e: 9 passed, 4 skipped, 0 failed.
- [ ] 4.5 Вручную прокликать сценарий: создать список с задачей → URL `/list?id=<id>`, Progress View с задачей в Pending.
- [ ] 4.6 Вручную прокликать edge case: создать список с 0 задач → URL `/list?id=<id>`, пустые секции.
- [x] CodeReview через lint: warning `listId unused` исправлен; pre-existing ошибки в API роутах не в scope.

## 5. Обновление спеков

- [x] 5.1 Применить delta `openspec/changes/webapp-list-url-query-param/specs/webapp-screens/spec.md` — обновлены «Progress View screen», «Navigate to progress view», «Save list», добавлен «Save list with no tasks», обновлен navbar scenario.
- [x] 5.2 Применить delta `openspec/changes/webapp-list-url-query-param/specs/e2e-navigation/spec.md` — обновлены сценарии перехода, «Create → Progress View», полный круг.
- [x] 5.3 Grep — все `/list/:id` в openspec/specs/ обновлены на `/list?id=<listId>`.

## 6. Финальная валидация

- [x] 6.1 lint — 3 pre-existing errors в API routes (не мой scope). Мои файлы без ошибок и warnings.
- [x] 6.2 build — зелёный. `/list` — static route.
- [x] 6.3 e2e: 9 passed, 4 skipped, 0 failed.
- [x] 6.4 integration: 34 passed, 4 skipped, 0 failed.
- [ ] 6.5 Вручную или через Assertum перезаписать один сценарий с Progress View (на двух разных списках) — подтвердить, что `src/page-objects/localhost_3000/` содержит один бакет для Progress View, не два.
- [x] 6.6 `docs/user_stories.md` обновлён: TC-L-01, TC-N-02, TC-N-03, TC-N-04.

## 7. Финализация

- [ ] 7.1 Список изменённых файлов:
  - `webapp/app/page.tsx`
  - `webapp/app/create/page.tsx`
  - `webapp/app/list/page.tsx` (новый)
  - `webapp/app/list/ProgressView.tsx` (новый)
  - `webapp/app/list/[id]/` (удалён)
  - `webapp/tests/page-objects/MyListsPage.ts`
  - `webapp/tests/page-objects/ProgressViewPage.ts`
  - `webapp/tests/page-objects/CreateListPage.ts`
  - `webapp/tests/integration/navigation.spec.ts`
  - `openspec/specs/webapp-screens/spec.md` (через delta)
  - `openspec/specs/e2e-navigation/spec.md` (через delta)
  - `docs/user_stories.md`
- [ ] 7.2 Итоговая проверка: lint / build / e2e — всё зелёное; валидатор PO (`bash .claude/skills/playwright-page-object/scripts/validate.sh webapp/tests`) — PASS.
- [ ] 7.3 Архивировать change: `openspec archive webapp-list-url-query-param`.
