import { test, expect } from '@playwright/test';
import { launchExtensionContext, ExtensionContextInfo, getExtensionStorage } from '../helpers/extensionTestUtils';
import { LiveSitePage } from '../pom/LiveSitePage';
import { attachAiDiagnosticOnFailure } from '../helpers/mcpTestHelpers';
import { LIVE_SITES_CATALOG } from '../fixtures/liveSitesCatalog';

test.describe('08 - Real Sites Multi-Publisher Stress Matrix', () => {
  let extInfo: ExtensionContextInfo;

  test.beforeAll(async () => {
    extInfo = await launchExtensionContext();
  });

  test.afterAll(async () => {
    if (extInfo?.browserContext) {
      await extInfo.browserContext.close();
    }
  });

  test.afterEach(async ({ page }, testInfo) => {
    await attachAiDiagnosticOnFailure(testInfo, page);
  });

  test('survives sequential navigation across multiple distinct publisher setups', async () => {
    test.setTimeout(240000);
    const targetSites = LIVE_SITES_CATALOG;

    for (const site of targetSites) {
      console.log(`[Stress Test] Navigating to ${site.name} (${site.url})...`);
      const page = await extInfo.browserContext.newPage();
      const liveSite = new LiveSitePage(page);

      await liveSite.navigateAndHandleConsent(site.url, 15000);
      await liveSite.waitForMcpBridge(6000);

      const snapshot = await liveSite.getMcpSnapshot();
      console.log(`  -> Status on ${site.name}: Prebid Version=${snapshot?.prebidVersion || 'none'}, Installed Modules=${snapshot?.installedModules?.length || 0}`);

      await page.close();
    }

    // Verify service worker is still alive and responsive
    const storage = await getExtensionStorage(extInfo.serviceWorker);
    expect(storage).toBeDefined();
    console.log('✅ Service worker is alive and responsive after multi-site stress navigation.');
  });
});
