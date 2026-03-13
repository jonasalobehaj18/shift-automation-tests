import { Page, expect } from '@playwright/test';

export class ShiftFormPage {
  constructor(private page: Page) {}

  async openCreateShiftDialogFromTemplate(): Promise<void> {
    await this.page.getByTestId('defaultfields-btn').first().click();
    await this.page.getByTestId('add-btn').click();
  }

  async fillRequiredTemplateFields(shiftName: string): Promise<void> {
    await this.page
      .locator('[data-testid="Name-textfield"] input')
      .fill(shiftName);
    await this.page
      .locator('[data-testid="Description-textfield"] input')
      .fill('Description');
  }

  async setTemplateMainTimes(begin: string, end: string): Promise<void> {
    await this.page.getByTestId('Begin-timepicker').first().click();
    await this.page.getByRole('option', { name: begin }).click();

    await this.page.getByTestId('End-timepicker').first().click();
    await this.page.getByRole('option', { name: end }).click();
  }

  async addPause(begin: string, end: string): Promise<void> {
    await this.page.getByTestId('add-btn').click();

    await this.page
      .getByRole('dialog')
      .getByTestId('Begin-timepicker')
      .first()
      .click();
    await this.page.getByRole('option', { name: begin }).click();

    await this.page
      .getByRole('dialog')
      .getByTestId('End-timepicker')
      .first()
      .click();
    await this.page.getByRole('option', { name: end }).click();

    await this.page.locator('.v-card').getByRole('button').last().click();
  }

  async saveTemplateShiftAndWait(): Promise<void> {
    await this.page.locator('button.v-btn.primary').nth(0).click();
    await this.page.waitForTimeout(3000);
  }

  async assertTemplateShiftCreated(shiftName: string): Promise<void> {
    await this.page
      .locator('.v-text-field__slot input')
      .last()
      .pressSequentially(shiftName);

    await expect(
      this.page.locator(`tbody tr:first-of-type:has-text("${shiftName}")`),
    ).toBeVisible();
  }

  async deleteFirstTemplateShiftAndConfirmRemoval(): Promise<void> {
    await this.page.locator('.v-input--selection-controls__ripple').nth(1).click();
    await this.page.locator('i.mdi-delete').click();

    await this.page.waitForTimeout(2000);
    await expect(this.page.getByText('No entries found')).toBeVisible();
  }

  async trySaveWithEmptyFields(): Promise<void> {
    await this.page.waitForTimeout(1000);
    await this.page.locator('button.v-btn.primary').nth(0).click();
  }

  async assertRequiredFieldErrors(): Promise<void> {
    await expect(
      this.page.locator('[data-testid="Name-textfield"] .v-messages__message'),
    ).toContainText('Field required');
    await expect(
      this.page.locator('[data-testid="Begin-timepicker"] .v-messages__message'),
    ).toContainText('Field required');
    await expect(
      this.page.locator('[data-testid="End-timepicker"] .v-messages__message'),
    ).toContainText('Field required');
  }
}
