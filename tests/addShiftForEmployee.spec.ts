import { test, expect } from '@playwright/test';
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
  await page.locator('button.v-btn.primary:has(i.mdi-plus)').click();
});

test('Add a new shift', async ({ page }) => {
  await test.step('Fill in shift details (description, type, resource, date and time)', async () => {
    await page
      .locator('[data-testid="shift-description-input"]')
      .nth(1)
      .fill(testData.description);

    await page.getByTestId('shift-type-select').nth(0).click();
    await page.getByRole('option', { name: testData.shiftType }).click();

    await page.getByTestId('shift-resources-select').first().click();
    await page.getByRole('option', { name: testData.resource }).click();

    await page.getByTestId('Date-datepicker-trigger').fill(formattedTodayDate);
    await page.getByTestId('Start time-timepicker').fill('10:00');
    await page.getByTestId('End time-timepicker').fill('18:00');
  });

  await test.step('Save the shift and confirm the form closes', async () => {
    await page.waitForTimeout(3000);
    await page.getByTestId('save-shift-btn').click();
    await expect(page.getByText('Details')).not.toBeVisible();
  });

  await test.step('Reload the page and search for the employee the shift was assigned to', async () => {
    await page.reload();
    await page
      .locator('#b-textfield-1-input')
      .fill(testData.employeeName || '');

    const employeeRow = page
      .locator('.b-grid-cell.b-resourceinfo-cell dt')
      .filter({ hasText: testData.employeeName });
    await expect(employeeRow).toBeVisible();
  });

  await test.step('Open the newly created shift from the schedule grid', async () => {
    await page.locator('[data-resource-id="4"] .b-sch-event').first().click();
    await page.locator('[data-resource-id="4"] .b-sch-event').first().click();
    await page.waitForTimeout(3000);
  });

  await test.step('Verify the shift details panel shows the correct date, time, employee and shift type', async () => {
    await expect(page.locator('.v-toolbar__title').nth(1)).toContainText(
      formattedTodayDate,
    );

    const card = page.locator('.v-card__text.primary.white--text');
    await expect(
      card.locator('.row.row--dense').nth(0).locator('.col'),
    ).toContainText('10:00 -18:00');
    await expect(
      card.locator('.row.row--dense').nth(1).locator('.col'),
    ).toContainText(testData.employeeName);
    await expect(
      card.locator('.row.row--dense').nth(3).locator('.col'),
    ).toContainText(testData.shiftType);
  });

  await test.step('Clean up: delete the created shift and confirm it is removed', async () => {
    await page.getByTestId('open-btn').click();
    await page.getByTestId('delete-shift-btn').click();
    await page.waitForTimeout(2000);
    await expect(page.getByText('0 Ereignisse')).toBeVisible();
  });
});

test('Add a new shift with empty fields', async ({ page }) => {
  await page.getByTestId('save-shift-btn').click();

  await expect(
    page.getByText('Mindestens eine Resource auswählen.'),
  ).toBeVisible();
});

// Bug: When shift is created with all fileds, save fails and the shift doesnt appear for that employee
test('Add shift with active events and pauses', async ({ page }) => {
  await test.step('Fill in shift details (description, type, resource, date and time), events and pauses', async () => {
    await page
      .locator('[data-testid="shift-description-input"]')
      .nth(1)
      .fill(testData.description);

    await page.getByTestId('shift-type-select').nth(0).click();
    await page.getByRole('option', { name: testData.shiftType }).click();

    await page.getByTestId('shift-resources-select').first().click();
    await page.getByRole('option', { name: testData.resource }).click();

    await page.getByTestId('Date-datepicker-trigger').fill(formattedTodayDate);
    await page.getByTestId('Start time-timepicker').fill('10:00');
    await page.getByTestId('End time-timepicker').fill('18:00');

    await test.step('Activate Events', async () => {
      await page.locator('.v-input--selection-controls__ripple').click();

      await page.getByTestId('Repeats on-select').first().click();
      await page.getByRole('option', { name: 'Monday' }).click();

      await page.getByTestId('Regularly-select').first().click();
      await page.getByRole('option', { name: 'Week' }).first().click();
    });

    await test.step('Add pauses', async () => {
      await page.getByTestId('add-pause-btn').click();

      await page.getByTestId('add-pause-btn').click();
      await page
        .locator('[data-testid="pause-checkbox-0"]')
        .locator(
          'xpath=ancestor::div[contains(@class,"v-input--selection-controls")]',
        )
        .locator('.v-input--selection-controls__ripple')
        .click();
    });
  });

  await test.step('Save the shift and confirm the form closes', async () => {
    await page.waitForTimeout(3000);
    await page.getByTestId('save-shift-btn').click();
    await expect(page.getByText('Details')).not.toBeVisible();
  });

  await test.step('Reload the page and search for the employee the shift was assigned to', async () => {
    await page.reload();
    await page
      .locator('#b-textfield-1-input')
      .fill(testData.employeeName || '');

    const employeeRow = page
      .locator('.b-grid-cell.b-resourceinfo-cell dt')
      .filter({ hasText: testData.employeeName });
    await expect(employeeRow).toBeVisible();
  });

  await test.step('Open the newly created shift from the schedule grid', async () => {
    await page.locator('[data-resource-id="4"] .b-sch-event').first().click();
    await page.locator('[data-resource-id="4"] .b-sch-event').first().click();
    await page.waitForTimeout(3000);
  });

  await test.step('Verify the shift details panel shows the correct date, time, employee and shift type', async () => {
    await expect(page.locator('.v-toolbar__title').nth(1)).toContainText(
      formattedTodayDate,
    );

    const card = page.locator('.v-card__text.primary.white--text');
    await expect(
      card.locator('.row.row--dense').nth(0).locator('.col'),
    ).toContainText('10:00 -18:00');
    await expect(
      card.locator('.row.row--dense').nth(1).locator('.col'),
    ).toContainText(testData.employeeName);
    await expect(
      card.locator('.row.row--dense').nth(3).locator('.col'),
    ).toContainText(testData.shiftType);

    // TODO: data for events and pauses are not saved in the form so assertions are missing until the bug is fixed
    await test.step('Clean up: delete the created shift and confirm it is removed', async () => {
      await page.getByTestId('open-btn').click();
      await page.getByTestId('delete-shift-btn').click();
      await page.waitForTimeout(2000);
      await expect(page.getByText('0 Ereignisse')).toBeVisible();
    });
  });
});
// shton nje shift
// // search punon
// test('', async ({ page }) => {});
