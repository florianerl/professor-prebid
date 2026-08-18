import { Page } from '@playwright/test';

/**
 * Robust consent dialog acceptance handler for real websites.
 * Supports OneTrust, Sourcepoint, Usercentrics, ConsentManager, Quantcast,
 * Cookiebot, Didomi, and Google Funding Choices.
 */
export async function autoAcceptConsent(page: Page, timeoutMs: number = 3000): Promise<boolean> {
  const consentSelectors = [
    // OneTrust
    '#onetrust-accept-btn-handler',
    '#onetrust-accept-all-handler',
    'button#onetrust-accept-btn-handler',

    // Usercentrics
    '[data-testid="uc-accept-all-button"]',
    'button[data-testid="uc-accept-all-button"]',

    // Sourcepoint / Generic CMP
    'button.sp_choice_type_11',
    'button[title="AGREE"]',
    'button[title="Agree"]',
    'button[title="Accept All"]',
    'button[title="Accept"]',

    // ConsentManager
    '.cmpboxbtn.cmpboxbtnyes',
    '#cmpboxbtnyes',

    // Quantcast
    '.qc-cmp2-summary-buttons button:first-child',
    '.qc-cmp-button:first-child',

    // Cookiebot
    '#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll',
    '#CybotCookiebotDialogBodyButtonAccept',

    // Google Funding Choices
    'button.fc-cta-consent',
    '.fc-consent-root button.fc-cta-consent',

    // Didomi
    '#didomi-notice-agree-button',

    // Heise / German specific
    'button[name="agree"]',
    'button[value="agree"]',
    'button:has-text("Alle akzeptieren")',
    'button:has-text("Alles akzeptieren")',
    'button:has-text("Zustimmen")',
    'button:has-text("Einverstanden")',
    'button:has-text("Akzeptieren")',

    // French specific (e.g. voici.fr, Prisma Media)
    'button:has-text("Accepter")',
    'button:has-text("Tout accepter")',
    'button:has-text("Accepter & Fermer")',
    'button:has-text("Continuer sans accepter")',
    '#didomi-notice-agree-button',
    '.didomi-continue-without-agreeing',

    // Dutch specific (e.g. welingelichtekringen.nl)
    'button:has-text("Akkoord")',
    'button:has-text("Alles accepteren")',
    'button:has-text("Accepteren")',
    'button:has-text("Ga akkoord")',

    // Generic English
    'button:has-text("Accept All")',
    'button:has-text("Accept all")',
    'button:has-text("ACCEPT ALL")',
    'button:has-text("I Accept")',
    'button:has-text("I agree")',
    'button:has-text("Accept Cookies")',
    'button:has-text("Agree & Proceed")',
    'button:has-text("Got it")',
    '[aria-label="Accept all"]',
    '[data-gdpr-consent="accept"]',
  ];

  // Try direct DOM first
  for (const selector of consentSelectors) {
    try {
      const btn = page.locator(selector).first();
      if (await btn.isVisible({ timeout: 250 })) {
        await btn.click({ timeout: 1500 });
        console.log(`[CMP] Accepted consent via selector: ${selector}`);
        await page.waitForTimeout(500);
        return true;
      }
    } catch {
      // Continue to next selector
    }
  }

  // Try inside any active iframes
  const frames = page.frames();
  for (const frame of frames) {
    for (const selector of consentSelectors.slice(0, 15)) {
      try {
        const btn = frame.locator(selector).first();
        if (await btn.isVisible({ timeout: 150 })) {
          await btn.click({ timeout: 1500 });
          console.log(`[CMP] Accepted consent in iframe via selector: ${selector}`);
          await page.waitForTimeout(500);
          return true;
        }
      } catch {
        // Continue
      }
    }
  }

  return false;
}
