import { Page, expect } from '@playwright/test';

export class ScheduleShiftPage {
  constructor(private page: Page) {}

  async openCreateShiftDialog(): Promise<void> {
    await this.page
      .locator('button.v-btn.primary:has(i.mdi-plus)')
      .click();
  }

  async fillBasicShiftDetails(params: {
    description: string;
    shiftType: string;
    resource: string;
    date: string;
    startTime: string;
    endTime: string;
  }): Promise<void> {
    const { description, shiftType, resource, date, startTime, endTime } = params;

    await this.page
      .locator('[data-testid="shift-description-input"]')
      .nth(1)
      .fill(description);

    await this.page.getByTestId('shift-type-select').nth(0).click();
    await this.page.getByRole('option', { name: shiftType }).click();

    await this.page.getByTestId('shift-resources-select').first().click();
    await this.page.getByRole('option', { name: resource }).click();

    await this.page.getByTestId('Date-datepicker-trigger').fill(date);
    await this.page.getByTestId('Start time-timepicker').fill(startTime);
    await this.page.getByTestId('End time-timepicker').fill(endTime);
  }

  async activateEvents(): Promise<void> {
    await this.page.locator('.v-input--selection-controls__ripple').click();

    await this.page.getByTestId('Repeats on-select').first().click();
    await this.page.getByRole('option', { name: 'Monday' }).click();

    await this.page.getByTestId('Regularly-select').first().click();
    await this.page.getByRole('option', { name: 'Week' }).first().click();
  }

  async addPauses(): Promise<void> {
    await this.page.getByTestId('add-pause-btn').click();
    await this.page.getByTestId('add-pause-btn').click();
    await this.page
      .locator('[data-testid="pause-checkbox-0"]')
      .locator(
        'xpath=ancestor::div[contains(@class,"v-input--selection-controls")]',
      )
      .locator('.v-input--selection-controls__ripple')
      .click();
  }

  async saveShiftAndCloseFormWithExistingTimeout(): Promise<void> {
    await this.page.waitForTimeout(3000);
    await this.page.getByTestId('save-shift-btn').click();
    await expect(this.page.getByText('Details')).not.toBeVisible();
  }

  async reloadAndSearchEmployee(employeeName: string | undefined): Promise<void> {
    await this.page.reload();
    await this.page.locator('#b-textfield-1-input').fill(employeeName || '');
    const employeeRow = this.page
      .locator('.b-grid-cell.b-resourceinfo-cell dt')
      .filter({ hasText: employeeName });
    await expect(employeeRow).toBeVisible();
  }

  async openFirstShiftFromGrid(): Promise<void> {
    await this.page.locator('[data-resource-id="4"] .b-sch-event').first().click();
    await this.page.locator('[data-resource-id="4"] .b-sch-event').first().click();
    await this.page.waitForTimeout(3000);
  }

  async assertShiftDetails(params: {
    date: string;
    timeRange: string;
    employeeName: string;
    shiftType: string;
  }): Promise<void> {
    const { date, timeRange, employeeName, shiftType } = params;

    await expect(this.page.locator('.v-toolbar__title').nth(1)).toContainText(
      date,
    );

    const card = this.page.locator('.v-card__text.primary.white--text');
    await expect(
      card.locator('.row.row--dense').nth(0).locator('.col'),
    ).toContainText(timeRange);
    await expect(
      card.locator('.row.row--dense').nth(1).locator('.col'),
    ).toContainText(employeeName);
    await expect(
      card.locator('.row.row--dense').nth(3).locator('.col'),
    ).toContainText(shiftType);
  }

  async deleteOpenedShiftAndConfirmRemoval(): Promise<void> {
    await this.page.getByTestId('open-btn').click();
    await this.page.getByTestId('delete-shift-btn').click();
    await this.page.waitForTimeout(2000);
    await expect(this.page.getByText('0 Ereignisse')).toBeVisible();
  }

  async saveWithEmptyFieldsShowsValidation(): Promise<void> {
    await this.page.getByTestId('save-shift-btn').click();
    await expect(
      this.page.getByText('Mindestens eine Resource auswählen.'),
    ).toBeVisible();
  }
}

