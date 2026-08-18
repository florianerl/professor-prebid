import { Page, expect } from '@playwright/test';

export class PopupPage {
  constructor(readonly page: Page) {}

  /**
   * Checks if No Prebid banner is shown.
   */
  async isNoPrebidCardVisible(): Promise<boolean> {
    return await this.page.locator('text="No Prebid.js detected"').isVisible();
  }

  /**
   * Clicks on a navigation tab in the popup (e.g. "Ad Units", "Config", "Timeline", etc.)
   */
  async selectTab(tabLabel: string): Promise<void> {
    const tabButton = this.page.locator(`button:has-text("${tabLabel}")`).first();
    if (await tabButton.isVisible()) {
      await tabButton.click();
      await this.page.waitForTimeout(300);
    }
  }

  /**
   * Checks if the navbar is present.
   */
  async isNavBarVisible(): Promise<boolean> {
    return await this.page.locator('.MuiTabs-root').isVisible();
  }
}
