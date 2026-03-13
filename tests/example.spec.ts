import { test } from '@playwright/test';
import { LoginPage } from './page-objects/LoginPage';

test('Login in as a User', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.loginAsUser();
});
