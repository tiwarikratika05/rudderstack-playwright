import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model for the Rudderstack "Connections" page.
 * This class contains all the locators and reusable actions
 * for working with the Connections page UI.
 */
export default class ConnectionsPage {
  page: Page;

  // Locators
  webhookLink: Locator;
  eventTab: Locator;
  dataPlaneLink: Locator;
  writeKeyOption: Locator;

  /**
   * @param page Playwright Page instance
   */
  constructor(page: Page) {
    this.page = page;

    // Define locators
    this.webhookLink = page.getByText('Test_WEBHOOK');
    this.eventTab = page.getByRole('tab', { name: 'Events' });
    this.dataPlaneLink = page.locator('.sc-hHvloA.dASOzL');
    this.writeKeyOption = page.locator(
      "div[class='sc-hHvloA kaxrgG'] span[class='sc-kDnyiN kWZpvc text-ellipsis']"
    );
  }

  /**
   * Retrieves the Data Plane URL from the page.
   * @returns Data Plane URL as string (trimmed)
   */
  async getDataPlaneURL(): Promise<string> {
    await this.dataPlaneLink.waitFor({ state: 'visible', timeout: 10000 });
    const value = await this.dataPlaneLink.textContent();
    const url = value?.trim() ?? '';
    console.log(`Data Plane URL: ${url}`);
    return url;
  }

  /**
   * Retrieves only the Write Key value from the UI.
   * Strips out the "Write Key" label text.
   * @returns Write Key string
   */
  async getWriteKey(): Promise<string> {
    await this.writeKeyOption.waitFor({ state: 'visible', timeout: 10000 });
    const fullText = await this.writeKeyOption.textContent();

    if (!fullText) {
      throw new Error('Write Key element not found or has no text');
    }

    // Match only the last alphanumeric token
    const match = fullText.match(/[A-Za-z0-9]+$/);
    if (!match) {
      throw new Error(`Could not parse write key from: ${fullText}`);
    }

    const keyOnly = match[0].trim();
    console.log(`Write Key: ${keyOnly}`);
    return keyOnly;
  }

  /**
   * Navigates to the Webhook Destination and opens the Events tab.
   * Waits for Delivered stats to be visible.
   */
  async navigateToWebhookDestination(): Promise<void> {
    await this.webhookLink.click();
    await this.eventTab.waitFor({ state: 'visible', timeout: 10000 });
    await this.eventTab.click();
    await this.page.getByText('Delivered', { exact: false }).waitFor({ timeout: 15000 });
  }

  /**
   * Fetches Delivered and Failed event counts from the Events tab.
   * Looks for the numeric value next to the labels.
   * @returns Object with delivered and failed counts
   */
  async getEventCounts(): Promise<{ delivered: string; failed: string }> {
    const deliveredLocator = this.page.getByText('Delivered', { exact: false });
    const failedLocator = this.page.getByText('Failed', { exact: false });

    await deliveredLocator.waitFor({ timeout: 15000 });
    await failedLocator.waitFor({ timeout: 15000 });

    const deliveredValue = await deliveredLocator
      .locator('xpath=following-sibling::*[1]')
      .textContent();
    const failedValue = await failedLocator
      .locator('xpath=following-sibling::*[1]')
      .textContent();

    return {
      delivered: deliveredValue?.trim() || '0',
      failed: failedValue?.trim() || '0',
    };
  }
}
