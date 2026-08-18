import { Page, Locator, expect } from '@playwright/test';

export class DevToolsPanelPage {
  constructor(readonly page: Page) {}

  /**
   * Clicks on a navigation tab by name (e.g. "Ad Units", "Bids", "Config", "Events", "Tools", etc.)
   */
  async selectTab(tabLabel: string): Promise<void> {
    const tabButton = this.page.locator(`button:has-text("${tabLabel}")`).first();
    await tabButton.click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Checks if a tab is currently active.
   */
  async isTabActive(tabLabel: string): Promise<boolean> {
    const tabButton = this.page.locator(`button:has-text("${tabLabel}")`).first();
    const variant = await tabButton.getAttribute('class');
    return variant?.includes('MuiButton-contained') ?? false;
  }

  /**
   * In Tools Tab: Toggles the On-Page AdUnit Info Overlay switch.
   */
  async toggleAdOverlay(): Promise<void> {
    await this.selectTab('Tools');
    const overlaySwitch = this.page.locator('input[type="checkbox"]').first();
    await overlaySwitch.click();
    await this.page.waitForTimeout(400);
  }

  /**
   * In Tools Tab: Injects standalone DevTools MCP bridge.
   */
  async injectDevtoolsMcp(): Promise<void> {
    await this.selectTab('Tools');
    const injectBtn = this.page.locator('button:has-text("Inject Standalone MCP")').first();
    if (await injectBtn.isVisible()) {
      await injectBtn.click();
      await this.page.waitForTimeout(500);
    }
  }

  /**
   * In Tools Tab: Generates AI diagnostic snapshot.
   */
  async generateAiDiagnosticPrompt(): Promise<void> {
    await this.selectTab('Tools');
    const aiBtn = this.page.locator('button:has-text("Generate AI Prompt"), button:has-text("Copy Diagnostic Snapshot")').first();
    if (await aiBtn.isVisible()) {
      await aiBtn.click();
      await this.page.waitForTimeout(300);
    }
  }

  /**
   * Gets all table rows or list cards on the current tab.
   */
  async getTableRowsCount(): Promise<number> {
    return await this.page.locator('tbody tr, .MuiTableRow-root').count();
  }

  /**
   * Checks if JSON viewer is displayed and expanded on the page.
   */
  async hasJsonViewerContent(): Promise<boolean> {
    return (await this.page.locator('pre, .w-json-view-container, code').count()) > 0;
  }
}
