import { Given, When, Then } from '@cucumber/cucumber';
import LoginPage from '../pages/login.page';
import ConnectionsPage from '../pages/connections.page';
import { sendEvent } from '../utils/apiHelper';
import { CustomWorld } from '../support/world';
import dotenv from 'dotenv';
import logger from '../utils/logger';

dotenv.config();

let loginPage: LoginPage;
let connectionsPage: ConnectionsPage;
let dataPlaneUrl = '';
let writeKey = '';

Given('I log in to Rudderstack', async function (this: CustomWorld) {
  logger.info('Logging in to Rudderstack...');
  loginPage = new LoginPage(this.page);
  await loginPage.goto();
  await loginPage.login(process.env.EMAIL!, process.env.PASSWORD!);
});

When('I navigate to the connections page', async function (this: CustomWorld) {
  logger.info('Navigating to connections page...');
  await loginPage.skipTwoFactorAuthentication();
  connectionsPage = new ConnectionsPage(this.page);
  await this.page.waitForSelector('.sc-hHvloA.dASOzL', { state: 'visible' });
});

When('I store the data plane URL and write key', async function () {
  logger.info('Fetching Data Plane URL and Write Key...');
  dataPlaneUrl = await connectionsPage.getDataPlaneURL();
  writeKey = await connectionsPage.getWriteKey();
});

When('I send an API event', async function () {
  logger.info(`Sending API event to: ${dataPlaneUrl}`);
  const status = await sendEvent(
    dataPlaneUrl,
    writeKey,
    "Product Purchased new",
    "blaxion-jelime4167",
    undefined,
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

Then('I verify delivered and failed event counts', async function () {
  logger.info('Verifying event counts...');
  await connectionsPage.navigateToWebhookDestination();
  const counts = await connectionsPage.getEventCounts();
  logger.info(`Delivered: ${counts.delivered}, Failed: ${counts.failed}`);
});
