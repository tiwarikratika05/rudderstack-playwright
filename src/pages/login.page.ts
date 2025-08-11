import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for the Rudderstack Login Page.
 * Contains all selectors and reusable methods for login flows.
 */
export default class LoginPage {
  page: Page;

  // Locators
  userEmailInput: Locator;
  passwordInput: Locator;
  loginButton: Locator;
  skipLink: Locator;
  goToDashboardButton: Locator;
  closeAnimationButton: Locator;

  /**
   * @param page Playwright Page instance
   */
  constructor(page: Page) {
    this.page = page;

    // Element locators
    this.userEmailInput = page.locator('#text-input-email');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Log in', exact: true });
    this.skipLink = page.locator("a[href='/addmfalater']");
    this.goToDashboardButton = page.getByRole('button', { name: 'Go to dashboard', exact: true });
    this.closeAnimationButton = page.getByRole('button', { name: 'Close' });
  }

  /**
   * Navigates to the login page using BASE_URL from environment variables.
   */
  async goto(): Promise<void> {
    if (!process.env.BASE_URL) {
      throw new Error('BASE_URL environment variable is not set');
    }
    await this.page.goto(process.env.BASE_URL);
  }

  /**
   * Performs login using given credentials.
   * @param email - User email address
   * @param password - User password
   */
  async login(email: string, password: string): Promise<void> {
    await this.userEmailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /**
   * Skips Two-Factor Authentication (2FA) flow and navigates to dashboard.
   * Waits until Data Plane URL element is visible.
   */
  async skipTwoFactorAuthentication(): Promise<void> {
    await this.skipLink.waitFor({ state: 'visible', timeout: 10000 });
    await this.skipLink.click();

    await this.goToDashboardButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.goToDashboardButton.click();

    await this.closeAnimationButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.closeAnimationButton.click();

    // Wait until connections section is loaded
    await this.page.waitForSelector('.sc-hHvloA.dASOzL', { state: 'visible', timeout: 15000 });
  }
}
