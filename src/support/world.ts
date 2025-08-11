import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, Page, chromium } from 'playwright';
import logger from '../utils/logger';

export class CustomWorld extends World {
  browser!: Browser;
  page!: Page;

  constructor(options: IWorldOptions) {
    super(options);
  }

  async launchBrowser() {
    logger.info('Launching browser...');
    this.browser = await chromium.launch({ headless: false });
    this.page = await this.browser.newPage();
  }

  async closeBrowser() {
    logger.info('Closing browser...');
    await this.browser?.close();
  }
}

setWorldConstructor(CustomWorld);
