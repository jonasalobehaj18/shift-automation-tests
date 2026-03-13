import { Page } from '@playwright/test';

export async function navigateToCapacities(page: Page): Promise<void> {
  await page.getByTestId('NavItems.capacity-planning-group').click();
}

export async function navigateToShifts(page: Page): Promise<void> {
  await navigateToCapacities(page);
  await page.getByTestId('NavItems.shift').click();
}
