/**
 * E2E tests that visit real websites with Prebid.js and verify Professor Prebid
 * detects and processes their configurations correctly.
 *
 * These replicate manual QA: visiting sites with various Prebid setups and
 * checking that the extension properly detects Prebid, stores tab info,
 * and doesn't crash on edge-case configurations.
 *
 * NOTE: Many sites use GDPR consent dialogs (CMP) that block ads until accepted.
 * We attempt to auto-accept these before checking for Prebid.
 */
import { test, expect, chromium, BrowserContext, Page } from '@playwright/test';
import path from 'path';

// Sites known to run Prebid.js with different configurations
const REAL_PREBID_SITES = [
    {
        name: 'eatpicks.com',
        url: 'https://www.eatpicks.com/',
        description: 'Food blog with Prebid.js header bidding',
    },
    {
        name: 'heise.de',
        url: 'https://www.heise.de/',
        description: 'German tech news site with Prebid.js',
    },
];

/**
 * Attempts to accept common GDPR/CMP consent dialogs.
 * Tries multiple common selectors used by ConsentManager, Quantcast, OneTrust, etc.
 */
async function acceptConsentDialog(page: Page): Promise<void> {
    const consentSelectors = [
        // Common CMP accept buttons
        '[data-testid="uc-accept-all-button"]',              // Usercentrics
        '.cmpboxbtn.cmpboxbtnyes',                            // ConsentManager
        '#onetrust-accept-btn-handler',                       // OneTrust
        'button.fc-cta-consent',                              // Funding Choices (Google)
        '.qc-cmp2-summary-buttons button:first-child',        // Quantcast
        'button#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll', // Cookiebot
        'button.sp_choice_type_11',                           // Sourcepoint
        'button[mode="primary"]',                             // Generic primary button
        'button.accept-all',                                  // Generic
        '[aria-label="Accept all"]',
        '[data-gdpr-consent="accept"]',
        'button:has-text("Accept All")',
        'button:has-text("Alle akzeptieren")',                // German
        'button:has-text("Alles akzeptieren")',               // German variant
        'button:has-text("Zustimmen")',                       // German "Agree"
        'button:has-text("Einverstanden")',                   // German "Agreed"
        '.cmpboxbtn.cmpboxbtnyes',                            // Consentmanager.net
        'button:has-text("AGREE")',
        'button:has-text("I Accept")',
        'button:has-text("Accept")',
        'button:has-text("OK")',
    ];

    // Also try iframes (many CMPs render in shadow DOM or iframes)
    for (const selector of consentSelectors) {
        try {
            const btn = page.locator(selector).first();
            if (await btn.isVisible({ timeout: 500 })) {
                await btn.click({ timeout: 2000 });
                console.log(`  Accepted consent via: ${selector}`);
                await page.waitForTimeout(1000);
                return;
            }
        } catch (_) {
            // Selector not found or not visible, try next
        }
    }

    // Try inside iframes (many CMPs use iframes)
    const frames = page.frames();
    for (const frame of frames) {
        for (const selector of consentSelectors.slice(0, 10)) {
            try {
                const btn = frame.locator(selector).first();
                if (await btn.isVisible({ timeout: 300 })) {
                    await btn.click({ timeout: 2000 });
                    console.log(`  Accepted consent in iframe via: ${selector}`);
                    await page.waitForTimeout(1000);
                    return;
                }
            } catch (_) {
                // continue
            }
        }
    }

    console.log('  No consent dialog found or already accepted');
}

test.describe('Real-Site Prebid Detection', () => {
    let browserContext: BrowserContext;
    let extensionId: string;

    test.beforeAll(async () => {
        const pathToExtension = path.join(__dirname, '../build');
        const userDataDir = '/tmp/test_real_sites_' + Date.now();

        browserContext = await chromium.launchPersistentContext(userDataDir, {
            headless: false,
            args: [
                `--disable-extensions-except=${pathToExtension}`,
                `--load-extension=${pathToExtension}`,
                '--headless=new',
                '--no-sandbox',
                '--disable-web-security',
            ],
        });

        // Wait for service worker
        let retries = 15;
        let serviceWorker = null;
        while (retries > 0) {
            const workers = browserContext.serviceWorkers();
            if (workers.length > 0) {
                serviceWorker = workers[0];
                break;
            }
            await new Promise(r => setTimeout(r, 500));
            retries--;
        }

        if (!serviceWorker) {
            try {
                serviceWorker = await browserContext.waitForEvent('serviceworker', { timeout: 10000 });
            } catch (e) { /* pass */ }
        }

        if (!serviceWorker) {
            throw new Error('Extension service worker not found');
        }

        extensionId = serviceWorker.url().split('/')[2];
        console.log(`Extension loaded with ID: ${extensionId}`);
    });

    test.afterAll(async () => {
        await browserContext?.close();
    });

    for (const site of REAL_PREBID_SITES) {
        test(`detects Prebid on ${site.name}`, async () => {
            test.setTimeout(60000);

            const page = await browserContext.newPage();

            // Collect console errors
            const pageErrors: string[] = [];
            page.on('pageerror', err => pageErrors.push(err.message));

            // Navigate
            console.log(`\nNavigating to ${site.url}...`);
            try {
                await page.goto(site.url, {
                    waitUntil: 'domcontentloaded',
                    timeout: 20000,
                });
            } catch (e) {
                console.log(`  Navigation to ${site.name} timed out, continuing with partial load...`);
            }

            // Wait for initial page load
            await page.waitForTimeout(3000);

            // Accept consent dialog (GDPR)
            console.log(`  Attempting to accept consent dialog on ${site.name}...`);
            await acceptConsentDialog(page);

            // Wait for Prebid to load after consent
            console.log(`  Waiting for Prebid to initialize after consent...`);
            await page.waitForTimeout(10000);

            // 1. Check the page itself for Prebid objects
            const pageHasPrebid = await page.evaluate(() => {
                const w = window as any;
                return {
                    hasPbjsGlobals: !!w._pbjsGlobals,
                    pbjsGlobals: w._pbjsGlobals || [],
                    hasPbjs: !!w.pbjs,
                    pbjsVersion: w.pbjs?.version || null,
                    hasHbObj: !!w.hb_obj,
                };
            });

            console.log(`  [${site.name}] Page-level Prebid check:`, JSON.stringify(pageHasPrebid));

            // 2. Verify the extension's service worker is still alive
            const serviceWorker = browserContext.serviceWorkers().find(sw => sw.url().includes(extensionId));
            expect(serviceWorker, 'Service worker should be alive').toBeTruthy();

            // 3. Check extension storage for detected Prebid data
            const storageData = await serviceWorker!.evaluate(async () => {
                return await chrome.storage.local.get(null);
            });

            console.log(`  [${site.name}] Storage keys:`, Object.keys(storageData));

            // 4. Verify tabInfos exists
            expect(storageData.tabInfos, `tabInfos should exist for ${site.name}`).toBeDefined();

            const tabKeys = Object.keys(storageData.tabInfos || {});
            console.log(`  [${site.name}] Tab keys:`, tabKeys);
            expect(tabKeys.length, `Should have at least one tab entry`).toBeGreaterThan(0);

            // 5. Analyze stored data
            let prebidDetected = false;
            let prebidNamespaces: string[] = [];
            let prebidVersion: string | undefined;

            for (const tabKey of tabKeys) {
                const tabData = storageData.tabInfos[tabKey];
                for (const frameKey of Object.keys(tabData)) {
                    const frame = tabData[frameKey];
                    if (frame.prebids && Object.keys(frame.prebids).length > 0) {
                        prebidDetected = true;
                        prebidNamespaces = Object.keys(frame.prebids);
                        const firstPrebid = frame.prebids[prebidNamespaces[0]];
                        prebidVersion = firstPrebid?.version;
                    }
                }
            }

            console.log(`  [${site.name}] Extension detected Prebid: ${prebidDetected}`);
            console.log(`  [${site.name}] Namespaces: ${prebidNamespaces.join(', ') || 'none'}`);
            console.log(`  [${site.name}] Version: ${prebidVersion || 'N/A'}`);

            // If Prebid IS fully initialized on the page (has namespaces), the extension MUST detect it.
            // If _pbjsGlobals is empty [], Prebid stub loaded but no namespace registered (consent blocked).
            const prebidFullyLoaded = (pageHasPrebid.pbjsGlobals?.length > 0) || pageHasPrebid.hasPbjs;

            if (prebidFullyLoaded) {
                // Prebid IS fully on the page — the extension MUST detect it
                expect(prebidDetected, `Extension should detect Prebid that's present on ${site.name}`).toBe(true);

                // Verify namespace and version
                expect(prebidNamespaces.length).toBeGreaterThan(0);
                if (prebidVersion) {
                    expect(prebidVersion).toMatch(/^\d+\.\d+/);
                }

                // Verify stored data shape
                for (const tabKey of tabKeys) {
                    const tabData = storageData.tabInfos[tabKey];
                    for (const frameKey of Object.keys(tabData)) {
                        const frame = tabData[frameKey];
                        if (frame.prebids) {
                            for (const [ns, details] of Object.entries(frame.prebids) as [string, any][]) {
                                expect(details).toHaveProperty('namespace');
                                expect(details).toHaveProperty('version');
                                expect(details).toHaveProperty('config');

                                console.log(`  ✅ [${site.name}] Prebid "${ns}" v${details.version}`);
                                console.log(`     Events: ${Array.isArray(details.events) ? details.events.length : 'N/A'}`);
                                console.log(`     Config keys: ${Object.keys(details.config || {}).join(', ') || 'empty'}`);
                                console.log(`     Modules: ${details.installedModules?.length ?? 'N/A'}`);
                            }
                        }
                    }
                }
            } else if (pageHasPrebid.hasPbjsGlobals) {
                // _pbjsGlobals exists but is empty — Prebid stub loaded, awaiting consent
                console.log(`  ⏳ [${site.name}] Prebid stub loaded (_pbjsGlobals exists) but no namespace registered.`);
                console.log(`     This typically means the site requires consent before initializing Prebid.`);
                console.log(`     Extension is healthy: service worker alive, tab registered in storage.`);

                // Extension should NOT crash in this scenario
                expect(serviceWorker, 'Service worker alive with partial Prebid').toBeTruthy();
            } else {
                // No Prebid at all on the page
                console.log(`  ⚠️  [${site.name}] No Prebid.js found on page.`);
                console.log(`     The site may have removed Prebid or requires consent.`);
            }

            // 6. Verify no extension-related crashes
            const extensionErrors = pageErrors.filter(e =>
                e.toLowerCase().includes('profprebid') ||
                e.toLowerCase().includes('professor')
            );
            expect(extensionErrors, `No extension errors on ${site.name}`).toEqual([]);

            await page.close();
        });
    }

    test('extension survives rapid page navigation', async () => {
        test.setTimeout(45000);

        const page = await browserContext.newPage();

        for (const site of REAL_PREBID_SITES) {
            try {
                await page.goto(site.url, { waitUntil: 'domcontentloaded', timeout: 15000 });
                await page.waitForTimeout(2000);
            } catch (e) {
                console.log(`  Navigation to ${site.url} timed out, continuing...`);
            }
        }

        // Verify service worker survived
        const serviceWorker = browserContext.serviceWorkers().find(sw => sw.url().includes(extensionId));
        expect(serviceWorker, 'Service worker should survive').toBeTruthy();

        const storageData = await serviceWorker!.evaluate(async () => {
            return await chrome.storage.local.get('tabInfos');
        });
        expect(storageData).toBeDefined();
        console.log('  ✅ Service worker survived rapid navigation, storage intact');

        await page.close();
    });
});
