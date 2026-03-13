import { Page } from '@playwright/test';
import { loginData } from '../helper/loginData';

type LoginParams = {
  username?: string;
  password?: string;
};

export class LoginPage {
  constructor(private page: Page) {}

  async loginAsUser(params?: LoginParams) {
    const username = params?.username ?? loginData.username;
    const password = params?.password ?? loginData.password;

    await this.page.goto(
      'https://werkstattplanung.net/demo/api/kic/da/auth.html#/',
    );
    await this.fillUsernameAndPassword(username, password);
    await this.page.getByTestId('LoginView.login-button').click();
  }

  async fillUsernameAndPassword(
    username: string,
    password: string,
  ): Promise<void> {
    await this.page.getByTestId('LoginView.username-text-field').fill(username);
    await this.page
      .getByTestId('PasswordTextField.password-text-field')
      .fill(password);
  }
}
