import { test, expect } from '@playwright/test'
import { HomePage } from '../page-objects/localhost_3000/home'
import { CreatePage } from '../page-objects/localhost_3000/create'
import { ListPage } from '../page-objects/localhost_3000/list'

test('TcL01ListCrudCreate', async ({ page }) => {
  await page.goto('http://localhost:3000/')
  const homePage = new HomePage(page)
  await homePage.newListButton.click()
  const createPage = new CreatePage(page)
  await createPage.morningRoutineTextbox.click()
  await createPage.morningRoutineTextbox.fill('TC-L-01 DailyDo List')
  await createPage.task1NameTextbox.click()
  await createPage.task1NameTextbox.fill('First task user story')
  await createPage.saveListButton.click()
  const listPage = new ListPage(page)
  await expect(listPage.tcL01DailydoListHeading).toHaveText('TC-L-01 DailyDo List')
  await expect(listPage.taskNameGeneric).toHaveText('First task user story')
  await expect(listPage.backButton).toBeVisible()
  await listPage.backButton.click()
  await expect(homePage.myListsHeading).toHaveText('My Lists')
  await expect(homePage.listsContainerGeneric).toBeVisible()
})
