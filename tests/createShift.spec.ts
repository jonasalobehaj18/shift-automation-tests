import { test, Page, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/LoginPage';
import { navigateToShifts } from '../helper/navigationHelper';
import { FakeData, generateFakeData } from '../helper/generateFakeDataHelper';

let testData: FakeData;

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.loginAsUser();
  // TODO: Temporary fix because of a bug with rendering frontend components after login. Remove after bug is fixed.
  await page.waitForTimeout(2000);
  await page.reload();
  await navigateToShifts(page);

  testData = generateFakeData();
  await page.getByTestId('defaultfields-btn').first().click();
});

test('Create shift will all the required data', async ({ page }) => {
  await page.getByTestId('add-btn').click();

  await page.locator('[data-testid="Name-textfield"] input').fill('test1');
  await page
    .locator('[data-testid="Description-textfield"] input')
    .fill('Description');
  await page.getByTestId('Begin-timepicker').first().click();
  await page.getByRole('option', { name: '07:00' }).click();

  await page.getByTestId('End-timepicker').first().click();
  await page.getByRole('option', { name: '17:00' }).click();

  // add pause
  await page.getByTestId('add-btn').click();

  await page
    .getByRole('dialog')
    .getByTestId('Begin-timepicker')
    .first()
    .click();
  await page.getByRole('option', { name: '07:15' }).click();

  await page.getByRole('dialog').getByTestId('End-timepicker').first().click();
  await page.getByRole('option', { name: '07:30' }).click();

  await page.locator('.v-card').getByRole('button').last().click();

  await page.locator('button.v-btn.primary').nth(0).click();
  await page.waitForTimeout(3000);

  // assertions
  await page
    .locator('.v-text-field__slot input')
    .last()
    .pressSequentially('test1');
  const rowLocator = page.locator('tbody tr:first-of-type:has-text("test1")');
  await expect(
    page.locator('tbody tr:first-of-type:has-text("test1")'),
  ).toBeVisible();
  await page.locator('.v-input--selection-controls__ripple').nth(1).click();
  await page.locator('i.mdi-delete').click();

  await page.waitForTimeout(2000);
  await expect(page.getByText('No entries found')).toBeVisible();
});
