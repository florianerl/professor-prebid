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
    installedVersionPublishedAt: '2026-01-01T00:00:00Z',
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

    // Click close button
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

  it('fetches release info from GitHub API when cached data is missing', async () => {
    const setPrebidReleaseInfo = vi.fn();
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve([
          {
            tag_name: '8.0.0',
            published_at: '2026-01-01T00:00:00Z',
            body: '## <h2 id="newfeatures">New Features</h2><ul><li>Feature 1</li></ul>',
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
  });
});
