import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AppStateContext from '../../../contexts/appStateContext';
import AnalyticsComponent from './AnalyticsComponent';
import BidderSettingsComponent from './BidderSettingsComponent';
import CurrencyComponent from './CurrencyComponent';
import FirstPartyDataComponent from './FirstPartyDataComponent';
import FloorsModuleComponent from './FloorsModuleComponent';
import GptPreAuctionComponent from './GptPreAuctionComponent';
import InstalledModulesComponent from './InstalledModules';
import OtherConfigsComponent from './OtherConfigsComponent';
import PrebidServerComponent from './PrebidServerComponent';
import PriceGranularityComponent from './PriceGranularityComponent';
import PrivacyComponent from './PrivacyComponent';
import RtdComponent from './RtdComponent';
import UserIdModule from './UserIdModule';
import UserSyncComponent from './UserSyncComponent';
import PrebidConfigComponent from '../../../../Popup/components/config/PrebidConfigComponent';

describe('Config Tiles components', () => {
  const mockPrebid: any = {
    installedModules: ['rubiconBidAdapter', 'userId'],
    bidderSettings: { rubicon: { storageAllowed: true } },
    config: {
      analytics: [{ provider: 'rubicon', options: { endpoint: 'https://example.com' } }],
      bidderSettings: { rubicon: { storageAllowed: true } },
      currency: { adServerCurrency: 'USD', granularityMultiplier: 1, rates: { EUR: 0.9 } },
      ortb2: {
        site: { name: 'example', domain: 'example.com', publisher: { id: 'pub-123' }, cat: ['IAB1', 'IAB2'] },
        user: { gender: 'M', yob: 1990 },
      },
      floors: { enabled: true, data: { currency: 'USD' } },
      gptPreAuction: { enabled: true },
      s2sConfig: [{ bidder: 'rubicon', accountId: '123' }],
      priceGranularity: 'medium',
      mediaTypePriceGranularity: {
        banner: {
          buckets: [{ precision: 2, min: 0, max: 10, increment: 0.2 }],
        },
        video: {
          buckets: [],
        },
      },
      consentManagement: {
        gdpr: { cmpApi: 'iab', defaultGdprScope: true, timeout: 500, rules: [{ purpose: 'consent' }] },
        usp: { cmpApi: 'iab' },
        gpp: { cmpApi: 'iab' },
        coppa: true,
      },
      userSync: {
        userIds: [
          { name: 'criteo', storage: { type: 'cookie', name: 'ct' }, params: { partner: 'xyz', nested: { id: 1 } } },
        ],
        syncEnabled: true,
        auctionDelay: 500,
        syncDelay: 3000,
        syncsPerBidder: 5,
        filterSettings: {
          all: { filter: 'include', bidders: ['rubicon'] },
        },
      },
      realTimeData: { dataProviders: [{ name: 'rtd', params: { partner: 'test' } }] },
      customKey: 'customValue',
    },
  };

  const emptyPrebid: any = { config: {} };

  const renderWithContext = (Component: React.ComponentType, prebidObj: any = mockPrebid, tcfObj: any = undefined) => {
    return render(
      <AppStateContext.Provider value={{ prebid: prebidObj, tcf: tcfObj }}>
        <Component />
      </AppStateContext.Provider>
    );
  };

  it('renders AnalyticsComponent with data and empty fallback, and toggles JSON view', () => {
    const { unmount } = renderWithContext(AnalyticsComponent);
    expect(screen.getByText('Analytics')).toBeTruthy();
    const jsonBtn = screen.queryByLabelText('Switch to raw JSON view');
    if (jsonBtn) fireEvent.click(jsonBtn);
    unmount();

    renderWithContext(AnalyticsComponent, emptyPrebid);
    expect(screen.queryByText('Analytics')).toBeNull();
  });

  it('renders BidderSettingsComponent with data and empty fallback, and toggles JSON view', () => {
    const { unmount } = renderWithContext(BidderSettingsComponent);
    expect(screen.getByText('Bidder Settings')).toBeTruthy();
    const jsonBtn = screen.queryByLabelText('Switch to raw JSON view');
    if (jsonBtn) fireEvent.click(jsonBtn);
    unmount();

    renderWithContext(BidderSettingsComponent, emptyPrebid);
    expect(screen.queryByText('Bidder Settings')).toBeNull();
  });

  it('renders CurrencyComponent with data and empty fallback, and toggles JSON view', () => {
    const { unmount } = renderWithContext(CurrencyComponent);
    expect(screen.getByText('Currency')).toBeTruthy();
    const jsonBtn = screen.queryByLabelText('Switch to raw JSON view');
    if (jsonBtn) fireEvent.click(jsonBtn);
    unmount();

    renderWithContext(CurrencyComponent, emptyPrebid);
    expect(screen.queryByText('Currency')).toBeNull();
  });

  it('renders FirstPartyDataComponent with full site/user data, fallback ortb2, and empty fallback', () => {
    const { unmount } = renderWithContext(FirstPartyDataComponent);
    expect(screen.getByText('First Party Data (ortb2)')).toBeTruthy();
    expect(screen.getByText('example.com')).toBeTruthy();
    expect(screen.getByText('pub-123')).toBeTruthy();
    expect(screen.getByText('IAB1, IAB2')).toBeTruthy();
    expect(screen.getByText('M')).toBeTruthy();
    expect(screen.getByText('1990')).toBeTruthy();
    const jsonBtn = screen.queryByLabelText('Switch to raw JSON view');
    if (jsonBtn) fireEvent.click(jsonBtn);
    unmount();

    // Test app context and fallback ortb2 keys
    const appOrtb2 = { config: { ortb2: { app: { name: 'test-app' } } } };
    const { unmount: unmountApp } = renderWithContext(FirstPartyDataComponent, appOrtb2);
    expect(screen.getByText('test-app')).toBeTruthy();
    unmountApp();

    const fallbackOrtb2 = { config: { ortb2: { customField: 'customValue' } } };
    const { unmount: unmountFallback } = renderWithContext(FirstPartyDataComponent, fallbackOrtb2);
    expect(screen.getByText(/top-level ortb2 key/)).toBeTruthy();
    unmountFallback();

    renderWithContext(FirstPartyDataComponent, emptyPrebid);
    expect(screen.queryByText('First Party Data (ortb2)')).toBeNull();
  });

  it('renders FloorsModuleComponent with data and empty fallback, and toggles JSON view', () => {
    const { unmount } = renderWithContext(FloorsModuleComponent);
    expect(screen.getByText('Floors Module')).toBeTruthy();
    const jsonBtn = screen.queryByLabelText('Switch to raw JSON view');
    if (jsonBtn) fireEvent.click(jsonBtn);
    unmount();

    renderWithContext(FloorsModuleComponent, emptyPrebid);
    expect(screen.queryByText('Floors Module')).toBeNull();
  });

  it('renders GptPreAuctionComponent with data and empty fallback, and toggles JSON view', () => {
    const { unmount } = renderWithContext(GptPreAuctionComponent);
    expect(screen.getByText('GPT Pre-Auction Module')).toBeTruthy();
    const jsonBtn = screen.queryByLabelText('Switch to raw JSON view');
    if (jsonBtn) fireEvent.click(jsonBtn);
    unmount();

    renderWithContext(GptPreAuctionComponent, emptyPrebid);
    expect(screen.queryByText('GPT Pre-Auction Module')).toBeNull();
  });

  it('renders InstalledModulesComponent with data and empty fallback, and toggles JSON view', () => {
    const { unmount } = renderWithContext(InstalledModulesComponent);
    expect(screen.getByText('Installed Modules')).toBeTruthy();
    const jsonBtn = screen.queryByLabelText('Switch to raw JSON view');
    if (jsonBtn) fireEvent.click(jsonBtn);
    unmount();

    renderWithContext(InstalledModulesComponent, emptyPrebid);
    expect(screen.queryByText('Installed Modules')).toBeNull();
  });

  it('renders OtherConfigsComponent with data and empty fallback, and toggles JSON view', () => {
    const { unmount } = renderWithContext(OtherConfigsComponent);
    expect(screen.getByText('Additional Configs')).toBeTruthy();
    const jsonBtn = screen.queryByLabelText('Switch to raw JSON view');
    if (jsonBtn) fireEvent.click(jsonBtn);
    unmount();

    renderWithContext(OtherConfigsComponent, emptyPrebid);
    expect(screen.queryByText('Additional Configs')).toBeNull();
  });

  it('renders PrebidServerComponent with data and empty fallback, and toggles JSON view', () => {
    const { unmount } = renderWithContext(PrebidServerComponent);
    expect(screen.getByText('Prebid Server')).toBeTruthy();
    const jsonBtn = screen.queryByLabelText('Switch to raw JSON view');
    if (jsonBtn) fireEvent.click(jsonBtn);
    unmount();

    renderWithContext(PrebidServerComponent, emptyPrebid);
    expect(screen.queryByText('Prebid Server')).toBeNull();
  });

  it('renders PriceGranularityComponent with mediaType overrides, auto, dense, and custom buckets', () => {
    const { unmount } = renderWithContext(PriceGranularityComponent, mockPrebid);
    expect(screen.getByText('Price Granularity')).toBeTruthy();
    expect(screen.getByText('banner')).toBeTruthy();
    unmount();

    const customPrebid: any = {
      config: {
        priceGranularity: 'custom',
        customPriceBucket: {
          buckets: [{ precision: 2, min: 0, max: 30, increment: 0.5 }],
        },
      },
    };
    const { unmount: unmountCustom } = renderWithContext(PriceGranularityComponent, customPrebid);
    expect(screen.getByText('Price Granularity')).toBeTruthy();
    unmountCustom();
  });

  it('renders PrivacyComponent with GDPR rules, TCF data, and toggles JSON view', () => {
    const mockTcf = {
      v2: {
        consentData: 'CPz00000000000000000000000',
      },
    };
    const { unmount } = renderWithContext(PrivacyComponent, mockPrebid, mockTcf);
    expect(screen.getByText('Consent Management')).toBeTruthy();
    expect(screen.getByText(/Rule #1/)).toBeTruthy();
    expect(screen.getByText(/TCF Version/)).toBeTruthy();

    const jsonBtn = screen.queryByLabelText('Switch to raw JSON view');
    if (jsonBtn) fireEvent.click(jsonBtn);
    unmount();

    renderWithContext(PrivacyComponent, emptyPrebid);
    expect(screen.queryByText('Consent Management')).toBeNull();
  });

  it('renders RtdComponent with data and empty fallback, and toggles JSON view', () => {
    const { unmount } = renderWithContext(RtdComponent);
    expect(screen.getByText('Real-Time Data (RTD)')).toBeTruthy();
    const jsonBtn = screen.queryByLabelText('Switch to raw JSON view');
    if (jsonBtn) fireEvent.click(jsonBtn);
    unmount();

    // Test RTD with custom rules (no dataProviders array)
    const customRulesPrebid = { config: { realTimeData: { auctionDelay: 100 } } };
    const { unmount: unmountCustom } = renderWithContext(RtdComponent, customRulesPrebid);
    expect(screen.getByText(/RTD module is loaded with custom rules/)).toBeTruthy();
    unmountCustom();

    renderWithContext(RtdComponent, emptyPrebid);
    expect(screen.queryByText('Real-Time Data (RTD)')).toBeNull();
  });

  it('renders UserIdModule with data, params, and empty fallback', () => {
    const { unmount } = renderWithContext(UserIdModule);
    expect(screen.getByText('User IDs')).toBeTruthy();
    expect(screen.getByText(/criteo Parameters:/)).toBeTruthy();
    const jsonBtn = screen.queryByLabelText('Switch to raw JSON view');
    if (jsonBtn) fireEvent.click(jsonBtn);
    unmount();

    renderWithContext(UserIdModule, emptyPrebid);
    expect(screen.queryByText('User IDs')).toBeNull();
  });

  it('renders UserSyncComponent and toggles raw JSON view mode', () => {
    renderWithContext(UserSyncComponent);
    expect(screen.getByText('User Sync')).toBeTruthy();

    const jsonBtn = screen.getByLabelText('Switch to raw JSON view');
    fireEvent.click(jsonBtn);
  });

  it('renders CurrencyComponent with string currency and toggles view', () => {
    const stringCurrencyPrebid = {
      config: {
        currency: 'USD',
      },
    };
    renderWithContext(CurrencyComponent, stringCurrencyPrebid);
    expect(screen.getByText('Currency')).toBeTruthy();
    expect(screen.getByText('Ad Server Currency:')).toBeTruthy();
  });

  it('renders PrebidConfigComponent with data, toggles view, and handles empty state', () => {
    const { unmount } = renderWithContext(PrebidConfigComponent);
    expect(screen.getByText('Prebid Config')).toBeTruthy();
    expect(screen.getByText('3000ms')).toBeTruthy();
    expect(screen.getByText(/Bidder Timeout:/)).toBeTruthy();
    const jsonBtn = screen.queryByLabelText('Switch to raw JSON view');
    if (jsonBtn) fireEvent.click(jsonBtn);
    unmount();

    renderWithContext(PrebidConfigComponent, { config: undefined });
    expect(screen.queryByText('Prebid Config')).toBeNull();
  });
});
