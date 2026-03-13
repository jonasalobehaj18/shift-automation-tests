import { test } from '@playwright/test';
import { LoginPage } from '../page-objects/LoginPage';
import { navigateToShifts } from '../helper/navigationHelper';
import { FakeData, generateFakeData } from '../helper/generateFakeDataHelper';
import { formattedTodayDate } from '../helper/date';
import { ScheduleShiftPage } from '../page-objects/ScheduleShiftPage';

let testData: FakeData;

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.loginAsUser();
  // TODO: Temporary fix because of a bug with rendering frontend components after login. Remove after bug is fixed.
  await page.waitForTimeout(2000);
  await page.reload();
  await navigateToShifts(page);

  testData = generateFakeData();
  const scheduleShiftPage = new ScheduleShiftPage(page);
  await scheduleShiftPage.openCreateShiftDialog();
});

test('Add a new shift', async ({ page }) => {
  const scheduleShiftPage = new ScheduleShiftPage(page);

  await test.step('Fill in shift details (description, type, resource, date and time)', async () => {
    await scheduleShiftPage.fillBasicShiftDetails({
      description: testData.description,
      shiftType: testData.shiftType,
      resource: testData.resource,
      date: formattedTodayDate,
      startTime: '10:00',
      endTime: '18:00',
    });
  });

  await test.step('Save the shift and confirm the form closes', async () => {
    await scheduleShiftPage.saveShiftAndCloseFormWithExistingTimeout();
  });

  await test.step('Reload the page and search for the employee the shift was assigned to', async () => {
    await scheduleShiftPage.reloadAndSearchEmployee(testData.employeeName);
  });

  await test.step('Open the newly created shift from the schedule grid', async () => {
    await scheduleShiftPage.openFirstShiftFromGrid();
  });

  await test.step('Verify the shift details panel shows the correct date, time, employee and shift type', async () => {
    await scheduleShiftPage.assertShiftDetails({
      date: formattedTodayDate,
      timeRange: '10:00 -18:00',
      employeeName: testData.employeeName,
      shiftType: testData.shiftType,
    });
  });

  await test.step('Clean up: delete the created shift and confirm it is removed', async () => {
    await scheduleShiftPage.deleteOpenedShiftAndConfirmRemoval();
  });
});

test('Add a new shift with empty fields', async ({ page }) => {
  const scheduleShiftPage = new ScheduleShiftPage(page);
  await scheduleShiftPage.saveWithEmptyFieldsShowsValidation();
});

// Bug: When shift is created with all fileds, save fails and the shift doesnt appear for that employee
test('Add shift with active events and pauses', async ({ page }) => {
  const scheduleShiftPage = new ScheduleShiftPage(page);

  await test.step('Fill in shift details (description, type, resource, date and time), events and pauses', async () => {
    await scheduleShiftPage.fillBasicShiftDetails({
      description: testData.description,
      shiftType: testData.shiftType,
      resource: testData.resource,
      date: formattedTodayDate,
      startTime: '10:00',
      endTime: '18:00',
    });

    await test.step('Activate Events', async () => {
      await scheduleShiftPage.activateEvents();
    });

    await test.step('Add pauses', async () => {
      await scheduleShiftPage.addPauses();
    });
  });

  await test.step('Save the shift and confirm the form closes', async () => {
    await scheduleShiftPage.saveShiftAndCloseFormWithExistingTimeout();
  });

  await test.step('Reload the page and search for the employee the shift was assigned to', async () => {
    await scheduleShiftPage.reloadAndSearchEmployee(testData.employeeName);
  });

  await test.step('Open the newly created shift from the schedule grid', async () => {
    await scheduleShiftPage.openFirstShiftFromGrid();
  });

  await test.step('Verify the shift details panel shows the correct date, time, employee and shift type', async () => {
    await scheduleShiftPage.assertShiftDetails({
      date: formattedTodayDate,
      timeRange: '10:00 -18:00',
      employeeName: testData.employeeName,
      shiftType: testData.shiftType,
    });

    // TODO: data for events and pauses are not saved in the form so assertions are missing until the bug is fixed
    await test.step('Clean up: delete the created shift and confirm it is removed', async () => {
      await scheduleShiftPage.deleteOpenedShiftAndConfirmRemoval();
    });
  });
});
