import { test, expect, chromium } from '@playwright/test';
import path from 'path';

test.describe('Professor Prebid Extension', () => {
    let browserContext;
    let extensionId;

    test.beforeAll(async () => {
        const pathToExtension = path.join(__dirname, '../build');
        const userDataDir = '/tmp/test_user_data_dir_' + Date.now();

        browserContext = await chromium.launchPersistentContext(userDataDir, {
            headless: false, // Set to false to see if it runs (in CI headless might be forced via environment or config)
            // Actually, in this environment I must run headless. 
            // But passing 'headless: false' to launchPersistentContext might be overridden or I should use args.
            // Let's use args for headless=new
            args: [
                `--disable-extensions-except=${pathToExtension}`,
                `--load-extension=${pathToExtension}`,
                '--headless=new', // Explicit new headless mode
            ],
        });

        // Wait for the extension to load (serviceworker)
        console.log('Waiting for service worker...');
        // Poll for service worker
        let retries = 10;
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
            // Try waitForEvent as backup
            try {
                serviceWorker = await browserContext.waitForEvent('serviceworker', { timeout: 5000 });
            } catch (e) {
                console.log('Service worker not found via waitForEvent either.');
            }
        }

        if (!serviceWorker) {
            throw new Error('Service worker not found');
        }

        extensionId = serviceWorker.url().split('/')[2];
        console.log(`Extension loaded with ID: ${extensionId}`);
    });

    test.afterAll(async () => {
        await browserContext.close();
    });

    test('injects content script and detects Prebid', async () => {
        const page = await browserContext.newPage();

        // Create a mock page that defines pbjs
        await page.route('https://example.com/mock-prebid', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'text/html',
                body: `
          <html>
            <head>
              <script>
                window.pbjs = window.pbjs || {};
                // Mock que to auto-execute commands
                window.pbjs.que = window.pbjs.que || [];
                window.pbjs.que.push = function(...args) {
                    args.forEach(fn => {
                        if (typeof fn === 'function') {
                            try {
                                fn();
                            } catch (e) {
                                console.error('Error executing queued function:', e);
                            }
                        }
                    });
                    return Array.prototype.push.apply(this, args);
                };
                // Process existing items
                window.pbjs.que.forEach(fn => {
                    if (typeof fn === 'function') {
                         try {
                                fn();
                            } catch (e) {
                                console.error('Error executing queued function:', e);
                            }
                    }
                });
                window._pbjsGlobals = ['pbjs'];
                
                // Simple event emitter mock
                const listeners = {};
                const storedEvents = [];
                
                window.pbjs.onEvent = (event, handler) => {
                    if (!listeners[event]) listeners[event] = [];
                    listeners[event].push(handler);
                };
                
                window.triggerEvent = (event, data) => {
                    // Store event for getEvents()
                    storedEvents.push({ eventType: event, args: data, elapsedTime: Date.now() });
                    
                    if (listeners[event]) {
                        listeners[event].forEach(fn => fn(data));
                    }
                };
                
                window.listenerCount = (event) => {
                    return listeners[event] ? listeners[event].length : 0;
                };

                // Mock required Prebid API methods
                window.pbjs.getEvents = () => storedEvents;
                window.pbjs.getConfig = () => ({});
                window.pbjs.getUserIdsAsEids = () => [];
                window.pbjs.installedModules = [];
                window.pbjs.version = '1.0.0';
                window.pbjs.bidderSettings = {};
              </script>
            </head>
            <body>
              <h1>Mock Prebid Page</h1>
            </body>
          </html>
        `
            });
        });

        page.on('console', msg => console.log('PAGE LOG:', msg.text()));
        page.on('pageerror', err => console.log('PAGE ERROR:', err));
        await page.goto('https://example.com/mock-prebid');

        // Verify injected script runs by checking if it communicates or modifies DOM
        // For now, let's check if the generic content script logic fired by inspecting console logs or events
        // But better: check if the badge update logic would have been triggered in background.
        // We can verify this via the Service Worker.

        const serviceWorker = browserContext.serviceWorkers().find(sw => sw.url().includes(extensionId));
        expect(serviceWorker).toBeTruthy();

        // Evaluate in Service Worker to check if tab data was stored
        // We need to wait a bit for message passing
        await page.waitForTimeout(1000);

        const tabId = page.mainFrame().page().context().pages().indexOf(page);
        // Wait, tabId in extension != index. 
        // We can get the tabId from the page handle in some ways, or just query storage in SW.

        // Let's just check if ANY data is stored in storage
        const storageData = await serviceWorker.evaluate(async () => {
            return await chrome.storage.local.get(null);
        });

        console.log('Storage Data:', JSON.stringify(storageData));

        // We expect *some* data if the content script detected prebid and sent a message
        // The previous logic sends POPUP_LOADED or detected events.
        // actually, `prebid.ts` detects `window._pbjsGlobals` and instantiates `Prebid`.
        // It sends "POPUP_LOADED" only when popup opens? No.
        // It sends details on specific events.
        // However, `addEventListenersForPrebid` runs immediately.
        // It creates `new Prebid()`. 
        // That doesn't automatically send data unless an event happens.
        // But `detectPrebid` loops or uses defineProperty.

        // Check if content script injected the bundle
        const scriptTag = await page.$('#professor\\ prebid\\ injected\\ bundle');
        if (scriptTag) {
            console.log('Injected script tag found.');
        } else {
            console.log('Injected script tag NOT found.');
        }

        // Listen for messages from injected script
        await page.evaluate(() => {
            window.addEventListener('message', (event) => {
                if (event.data && event.data.profPrebid) {
                    console.log('PAGE RECEIVED MSG:', JSON.stringify(event.data));
                }
            });
        });

        // Wait for the injected script to register listeners
        await page.waitForFunction(() => {
            // @ts-ignore
            return window.pbjs && window.listenerCount && window.listenerCount('auctionInit') > 0;
        }, null, { timeout: 10000 });

        // Trigger a prebid event in the page using our mock
        await page.evaluate(() => {
            // @ts-ignore
            window.triggerEvent('auctionInit', { auctionId: 'test-auction' });
        });

        // Wait for message passing and storage write
        await page.waitForTimeout(2000);

        // Check storage again
        const finalStorageData = await serviceWorker.evaluate(async () => {
            return await chrome.storage.local.get(null);
        });

        console.log('Final Storage Data:', JSON.stringify(finalStorageData));

        // Expect tabInfos to exist and contain data
        expect(finalStorageData.tabInfos).toBeDefined();
        const tabKeys = Object.keys(finalStorageData.tabInfos);
        expect(tabKeys.length).toBeGreaterThan(0);
    });
});
