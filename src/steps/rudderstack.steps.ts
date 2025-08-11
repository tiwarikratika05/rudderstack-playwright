import { Given, When, Then } from '@cucumber/cucumber';
import { chromium, Browser, Page } from 'playwright';
import LoginPage from '../pages/login.page';
import ConnectionsPage from '../pages/connections.page';
import { sendEvent } from '../utils/apiHelper';
import logger from '../utils/logger';
import dotenv from 'dotenv';
dotenv.config();

let browser: Browser;
let page: Page;
let loginPage: LoginPage;
let connectionsPage: ConnectionsPage;
let dataPlaneUrl = '';
let writeKey = '';

Given('I log in to Rudderstack', { timeout: 60000 }, async () => {
    browser = await chromium.launch({ headless: false });
    page = await browser.newPage();

    loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(process.env.EMAIL!, process.env.PASSWORD!);
});

When('I navigate to the connections page', { timeout: 30000 }, async () => {
    await loginPage.skipTwoFactorAuthentication();
    connectionsPage = new ConnectionsPage(page);
    await page.waitForSelector('.sc-hHvloA.dASOzL', { state: 'visible' });
});

When('I store the data plane URL and write key', async () => {
    // Wait for both elements to be visible
    await page.waitForSelector('.sc-hHvloA.dASOzL', { state: 'visible' });
    await page.waitForSelector("div[class='sc-hHvloA kaxrgG'] span[class='sc-kDnyiN kWZpvc text-ellipsis']", { state: 'visible' });

    dataPlaneUrl = await connectionsPage.getDataPlaneURL();
    writeKey = await connectionsPage.getWriteKey();
});

When('I send an API event', async () => {
    const status = await sendEvent(
        dataPlaneUrl,
        writeKey,
        "Product Purchased new", // event name
        "blaxion-jelime4167",   // userId
        undefined,               // anonymousId (not used here)
        {
            properties: { name: "Shirt", revenue: 4.99 },
            traits: { email: "jelime4167@blaxion.com" },
            context: {
                ip: "14.5.67.21",
                library: { name: "http" }
            },
            timestamp: "2020-02-02T00:23:09.544Z"
        }
    );
    logger.info(`API call returned status: ${status}`);
});

Then('I verify delivered and failed event counts', { timeout: 60000 }, async () => {
    await connectionsPage.navigateToWebhookDestination();
    const counts = await connectionsPage.getEventCounts();
    logger.info(`Delivered: ${counts.delivered}, Failed: ${counts.failed}`);
    await browser.close();
  });