import { test } from '@playwright/test';
import { LoginPage } from '../page-objects/LoginPage';
import { navigateToShifts } from '../helper/navigationHelper';
import { FakeData, generateFakeData } from '../helper/generateFakeDataHelper';
import { ShiftFormPage } from '../page-objects/ShiftFormPage';

let testData: FakeData;

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.loginAsUser();
  // TODO: Temporary fix because of a bug with rendering frontend components after login. Remove after bug is fixed.
  await page.waitForTimeout(2000);
  await page.reload();
  await navigateToShifts(page);

  testData = generateFakeData();
  const shiftFormPage = new ShiftFormPage(page);
  await shiftFormPage.openCreateShiftDialogFromTemplate();
});

test('Create shift will all the required data', async ({ page }) => {
  const shiftFormPage = new ShiftFormPage(page);
  await shiftFormPage.fillRequiredTemplateFields(testData.shiftName);
  await shiftFormPage.setTemplateMainTimes('07:00', '17:00');
  await shiftFormPage.addPause('07:15', '07:30');
  await shiftFormPage.saveTemplateShiftAndWait();
  await shiftFormPage.assertTemplateShiftCreated(testData.shiftName);
  await shiftFormPage.deleteFirstTemplateShiftAndConfirmRemoval();
});

test('Add a new shift with empty fields', async ({ page }) => {
  const shiftFormPage = new ShiftFormPage(page);
  await shiftFormPage.trySaveWithEmptyFields();
  await shiftFormPage.assertRequiredFieldErrors();
});
