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

describe('Config Tiles components', () => {
  const mockPrebid: any = {
    installedModules: ['rubiconBidAdapter', 'userId'],
    bidderSettings: { rubicon: { storageAllowed: true } },
    config: {
      analytics: [{ provider: 'rubicon', options: { endpoint: 'https://example.com' } }],
      bidderSettings: { rubicon: { storageAllowed: true } },
      currency: { adServerCurrency: 'USD', granularityMultiplier: 1, rates: { EUR: 0.9 } },
      ortb2: { site: { name: 'example' }, user: { gender: 'M' } },
      floors: { enabled: true, data: { currency: 'USD' } },
      gptPreAuction: { enabled: true },
      s2sConfig: [{ bidder: 'rubicon', accountId: '123' }],
      priceGranularity: { buckets: [{ precision: 2, min: 0, max: 5, increment: 0.1 }] },
      consentManagement: {
        gdpr: { cmpApi: 'iab' },
        usp: { cmpApi: 'iab' },
        gpp: { cmpApi: 'iab' },
        coppa: true,
      },
      userSync: {
        userIds: [{ name: 'criteo', storage: { type: 'cookie', name: 'ct' } }],
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

  const renderWithContext = (Component: React.ComponentType, prebidObj: any = mockPrebid) => {
    return render(
      <AppStateContext.Provider value={{ prebid: prebidObj }}>
        <Component />
      </AppStateContext.Provider>
    );
  };

  it('renders AnalyticsComponent with data and empty fallback', () => {
    const { unmount } = renderWithContext(AnalyticsComponent);
    expect(screen.getByText('Analytics')).toBeTruthy();
    unmount();

    renderWithContext(AnalyticsComponent, emptyPrebid);
    expect(screen.queryByText('Analytics')).toBeNull();
  });

  it('renders BidderSettingsComponent with data and empty fallback', () => {
    const { unmount } = renderWithContext(BidderSettingsComponent);
    expect(screen.getByText('Bidder Settings')).toBeTruthy();
    unmount();

    renderWithContext(BidderSettingsComponent, emptyPrebid);
    expect(screen.queryByText('Bidder Settings')).toBeNull();
  });

  it('renders CurrencyComponent with data and empty fallback', () => {
    const { unmount } = renderWithContext(CurrencyComponent);
    expect(screen.getByText('Currency')).toBeTruthy();
    unmount();

    renderWithContext(CurrencyComponent, emptyPrebid);
    expect(screen.queryByText('Currency')).toBeNull();
  });

  it('renders FirstPartyDataComponent with data and empty fallback', () => {
    const { unmount } = renderWithContext(FirstPartyDataComponent);
    expect(screen.getByText('First Party Data (ortb2)')).toBeTruthy();
    unmount();

    renderWithContext(FirstPartyDataComponent, emptyPrebid);
    expect(screen.queryByText('First Party Data (ortb2)')).toBeNull();
  });

  it('renders FloorsModuleComponent with data and empty fallback', () => {
    const { unmount } = renderWithContext(FloorsModuleComponent);
    expect(screen.getByText('Floors Module')).toBeTruthy();
    unmount();

    renderWithContext(FloorsModuleComponent, emptyPrebid);
    expect(screen.queryByText('Floors Module')).toBeNull();
  });

  it('renders GptPreAuctionComponent with data and empty fallback', () => {
    const { unmount } = renderWithContext(GptPreAuctionComponent);
    expect(screen.getByText('GPT Pre-Auction Module')).toBeTruthy();
    unmount();

    renderWithContext(GptPreAuctionComponent, emptyPrebid);
    expect(screen.queryByText('GPT Pre-Auction Module')).toBeNull();
  });

  it('renders InstalledModulesComponent with data and empty fallback', () => {
    const { unmount } = renderWithContext(InstalledModulesComponent);
    expect(screen.getByText('Installed Modules')).toBeTruthy();
    unmount();

    renderWithContext(InstalledModulesComponent, emptyPrebid);
    expect(screen.queryByText('Installed Modules')).toBeNull();
  });

  it('renders OtherConfigsComponent with data and empty fallback', () => {
    const { unmount } = renderWithContext(OtherConfigsComponent);
    expect(screen.getByText('Additional Configs')).toBeTruthy();
    unmount();

    renderWithContext(OtherConfigsComponent, emptyPrebid);
    expect(screen.queryByText('Additional Configs')).toBeNull();
  });

  it('renders PrebidServerComponent with data and empty fallback', () => {
    const { unmount } = renderWithContext(PrebidServerComponent);
    expect(screen.getByText('Prebid Server')).toBeTruthy();
    unmount();

    renderWithContext(PrebidServerComponent, emptyPrebid);
    expect(screen.queryByText('Prebid Server')).toBeNull();
  });

  it('renders PriceGranularityComponent with preset string granularity and object granularity', () => {
    const presetPrebid: any = { config: { priceGranularity: 'medium' } };
    const { unmount } = renderWithContext(PriceGranularityComponent, presetPrebid);
    expect(screen.getByText('Price Granularity')).toBeTruthy();
    unmount();

    renderWithContext(PriceGranularityComponent, mockPrebid);
    expect(screen.getByText('Price Granularity')).toBeTruthy();
  });

  it('renders PrivacyComponent with data and empty fallback', () => {
    const { unmount } = renderWithContext(PrivacyComponent);
    expect(screen.getByText('Consent Management')).toBeTruthy();
    unmount();

    renderWithContext(PrivacyComponent, emptyPrebid);
    expect(screen.queryByText('Consent Management')).toBeNull();
  });

  it('renders RtdComponent with data and empty fallback', () => {
    const { unmount } = renderWithContext(RtdComponent);
    expect(screen.getByText('Real-Time Data (RTD)')).toBeTruthy();
    unmount();

    renderWithContext(RtdComponent, emptyPrebid);
    expect(screen.queryByText('Real-Time Data (RTD)')).toBeNull();
  });

  it('renders UserIdModule with data and empty fallback', () => {
    const { unmount } = renderWithContext(UserIdModule);
    expect(screen.getByText('User IDs')).toBeTruthy();
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
});
