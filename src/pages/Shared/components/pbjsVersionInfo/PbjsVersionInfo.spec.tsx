import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PbjsVersionInfoComponent from './PbjsVersionInfoComponent';
import PbjsVersionInfoPopOver from './PbjsVersionInfoPopOver';
import PbjsVersionInfoContent from './PbjsVersionInfoContent';
import AppStateContext from '../../contexts/appStateContext';

describe('PbjsVersionInfo components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.chrome = {
      storage: {
        local: {
          get: vi.fn((key, cb) => cb({})),
          set: vi.fn((val, cb) => cb?.()),
        },
      },
    } as any;
  });

  const mockReleaseInfo: any = {
    latestVersion: '8.1.0',
    latestVersionPublishedAt: '2026-05-01T00:00:00Z',
    installedVersion: '8.0.0',
    installedVersionPublishedAt: '2023-01-01T00:00:00Z',
    featureCountSinceInstalledVersion: 5,
    maintenanceCountSinceInstalledVersion: 3,
    bugfixCountSinceInstalledVersion: 10,
    releasesSinceInstalledVersion: [
      {
        tag_name: '8.1.0',
        name: 'v8.1.0 Release',
        published_at: '2026-05-01T00:00:00Z',
        html_url: 'https://github.com/prebid/Prebid.js/releases/tag/v8.1.0',
        doc: { body: { innerHTML: '<p>Release details</p>' } },
      },
    ],
  };

  it('renders PbjsVersionInfoComponent with version data and handles close click', () => {
    const closeFn = vi.fn();
    const mockContext: any = {
      prebid: { version: '8.0.0' },
      prebidReleaseInfo: mockReleaseInfo,
      setPrebidReleaseInfo: vi.fn(),
    };

    render(
      <AppStateContext.Provider value={mockContext}>
        <PbjsVersionInfoComponent close={closeFn} />
      </AppStateContext.Provider>
    );

    expect(screen.getByText(/Installed PBJS Version/i)).toBeTruthy();

    const closeBtn = screen.getByRole('button');
    fireEvent.click(closeBtn);
    expect(closeFn).toHaveBeenCalled();
  });

  it('renders PbjsVersionInfoPopOver when open', () => {
    const mockContext: any = {
      prebid: { version: '8.0.0' },
      prebidReleaseInfo: mockReleaseInfo,
      setPrebidReleaseInfo: vi.fn(),
    };

    render(
      <AppStateContext.Provider value={mockContext}>
        <PbjsVersionInfoPopOver pbjsVersionPopUpOpen={true} setPbjsVersionPopUpOpen={vi.fn()} />
      </AppStateContext.Provider>
    );

    expect(screen.getByText(/Installed PBJS Version/i)).toBeTruthy();
  });

  it('renders latest version message when installed version matches latest version', () => {
    const latestReleaseInfo: any = {
      ...mockReleaseInfo,
      latestVersion: '8.0.0',
      installedVersion: 'v8.0.0',
    };

    const mockContext: any = {
      prebid: { version: 'v8.0.0' },
      prebidReleaseInfo: latestReleaseInfo,
      setPrebidReleaseInfo: vi.fn(),
    };

    render(
      <AppStateContext.Provider value={mockContext}>
        <PbjsVersionInfoContent />
      </AppStateContext.Provider>
    );

    expect(screen.getByText('You are using the latest version of Prebid.js!')).toBeTruthy();
  });

  it('toggles changelog view when installed version is older', () => {
    const mockContext: any = {
      prebid: { version: '8.0.0' },
      prebidReleaseInfo: mockReleaseInfo,
      setPrebidReleaseInfo: vi.fn(),
    };

    render(
      <AppStateContext.Provider value={mockContext}>
        <PbjsVersionInfoContent />
      </AppStateContext.Provider>
    );

    expect(screen.getByText('New Features:')).toBeTruthy();
    expect(screen.getByText('5')).toBeTruthy();

    const changelogLink = screen.getByText(/View Full Release Changelog/);
    fireEvent.click(changelogLink);

    expect(screen.getByText('v8.1.0 Release')).toBeTruthy();
  });

  it('fetches release info from GitHub API when cached data is missing and processes markdown headers', async () => {
    const setPrebidReleaseInfo = vi.fn();
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve([
          {
            tag_name: '8.0.0',
            published_at: '2023-01-01T00:00:00Z',
            body: '<h2 id="newfeatures">New Features</h2><ul><li>Feature 1</li></ul><h2 id="maintenance">Maintenance</h2><ul><li>Maint 1</li></ul><h2 id="bugfixes">Bug Fixes</h2><ul><li>Bug 1</li></ul>',
          },
        ]),
    });
    global.fetch = mockFetch;

    const mockContext: any = {
      prebid: { version: 'v8.0.0' },
      prebidReleaseInfo: {},
      setPrebidReleaseInfo,
    };

    await act(async () => {
      render(
        <AppStateContext.Provider value={mockContext}>
          <PbjsVersionInfoContent />
        </AppStateContext.Provider>
      );
    });

    expect(mockFetch).toHaveBeenCalled();
    expect(setPrebidReleaseInfo).toHaveBeenCalled();
  });

  it('handles paginated releases when first page has 100 items and installed version is on page 2', async () => {
    const setPrebidReleaseInfo = vi.fn();
    const page1Releases = Array.from({ length: 100 }, (_, i) => ({
      tag_name: `9.${i}.0`,
      published_at: '2026-01-01T00:00:00Z',
      body: '<h2 id="newfeatures">New</h2><ul><li>F</li></ul>',
    }));
    const page2Releases = [
      {
        tag_name: '8.0.0',
        published_at: '2025-05-01T00:00:00Z',
        body: '<h2 id="newfeatures">New</h2><ul><li>F</li></ul>',
      },
    ];

    const mockFetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('&page=1&')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(page1Releases) });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve(page2Releases) });
    });
    global.fetch = mockFetch;

    const mockContext: any = {
      prebid: { version: 'v8.0.0' },
      prebidReleaseInfo: {},
      setPrebidReleaseInfo,
    };

    await act(async () => {
      render(
        <AppStateContext.Provider value={mockContext}>
          <PbjsVersionInfoContent />
        </AppStateContext.Provider>
      );
    });

    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('uses cached release info from chrome.storage when valid and unexpired, and falls back to fetch when not in cache', async () => {
    const cachedData = [
      {
        tag_name: '7.50.0', // does not match installed v8.0.0 -> triggers !page fallback fetch
        published_at: '2025-01-01T00:00:00Z',
        cached_at: Date.now(),
        body: '<h2 id="newfeatures">New Features</h2><ul><li>Feature 1</li></ul>',
      },
    ];

    global.chrome.storage.local.get = vi.fn((key, cb) => cb({ pbjsReleasesData: JSON.stringify(cachedData) }));

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve([
          {
            tag_name: '8.0.0',
            published_at: '2025-01-01T00:00:00Z',
            body: '<h2 id="newfeatures">New</h2>',
          },
        ]),
    });
    global.fetch = mockFetch;

    const setPrebidReleaseInfo = vi.fn();
    const mockContext: any = {
      prebid: { version: 'v8.0.0' },
      prebidReleaseInfo: {},
      setPrebidReleaseInfo,
    };

    await act(async () => {
      render(
        <AppStateContext.Provider value={mockContext}>
          <PbjsVersionInfoContent />
        </AppStateContext.Provider>
      );
    });

    expect(mockFetch).toHaveBeenCalled();
  });

  it('handles expired cache and fetches new releases from GitHub', async () => {
    const expiredData = [
      {
        tag_name: '8.0.0',
        published_at: '2024-01-01T00:00:00Z',
        cached_at: Date.now() - 1000 * 60 * 60 * 48, // 2 days ago
        body: '',
      },
    ];

    global.chrome.storage.local.get = vi.fn((key, cb) => cb({ pbjsReleasesData: JSON.stringify(expiredData) }));
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve([
          {
            tag_name: '8.0.0',
            published_at: '2024-01-01T00:00:00Z',
            body: '<h2 id="newfeatures">New</h2><ul><li>1</li></ul>',
          },
        ]),
    });
    global.fetch = mockFetch;

    const mockContext: any = {
      prebid: { version: 'v8.0.0' },
      prebidReleaseInfo: {},
      setPrebidReleaseInfo: vi.fn(),
    };

    await act(async () => {
      render(
        <AppStateContext.Provider value={mockContext}>
          <PbjsVersionInfoContent />
        </AppStateContext.Provider>
      );
    });

    expect(mockFetch).toHaveBeenCalled();
  });

  it('handles fetch API errors gracefully', async () => {
    global.chrome.storage.local.get = vi.fn((key, cb) => cb({}));
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    const mockContext: any = {
      prebid: { version: 'v8.0.0' },
      prebidReleaseInfo: {},
      setPrebidReleaseInfo: vi.fn(),
    };

    await act(async () => {
      render(
        <AppStateContext.Provider value={mockContext}>
          <PbjsVersionInfoContent />
        </AppStateContext.Provider>
      );
    });

    expect(screen.getByText('Attempting to fetch data about PBJS releases..')).toBeTruthy();
  });
});
