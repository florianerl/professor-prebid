import { collectHarLog } from './harLog';

chrome.devtools?.panels?.create('Professor Prebid', 'icon-34.png', 'panel.html', async (panel) => { });

// Always-on zero-config network capture for Pre-Auction, Network Inspector, and Privacy Audit
collectHarLog();

