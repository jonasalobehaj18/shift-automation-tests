import { test, Page, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/LoginPage';
import { navigateToShifts } from '../helper/navigationHelper';
import { FakeData, generateFakeData } from '../helper/generateFakeDataHelper';
import { formattedTodayDate } from '../helper/date';

let testData: FakeData;

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.loginAsUser();
  // TODO: Temporary fix because of a bug with rendering frontend components after login. Remove after bug is fixed.
  await page.waitForTimeout(2000);
  await page.reload();
  await navigateToShifts(page);

  testData = generateFakeData();

});

test('', async ({ page }) => {
  await page.getByTestId('defaultfields-btn').click();
  await page.getByTestId('add-btn').click();

  await page.locator('#input-1045').fill('test1');
});
