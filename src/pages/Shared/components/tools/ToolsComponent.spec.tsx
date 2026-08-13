import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ToolsComponent from './ToolsComponent';
import OverlayControlComponent from './OverlayControlComponent';
import AppStateContext from '../../contexts/appStateContext';

vi.mock('../../../Shared/utils', () => ({
  getTabId: vi.fn().mockResolvedValue(1),
  sendChromeTabsMessage: vi.fn(),
}));

describe('Tools & OverlayControl components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.chrome = {
      storage: {
        local: {
          get: vi.fn((key, cb) => cb({ consoleState: true })),
          set: vi.fn((val, cb) => cb?.()),
        },
      },
      scripting: {
        executeScript: vi.fn().mockImplementation(({ func }, cb) => {
          if (typeof func === 'function') {
            const mockWin: any = { location: { href: 'http://example.com' } };
            // Simulate main world script execution
            func();
          }
          cb?.([]);
          return Promise.resolve([]);
        }),
      },
    } as any;
  });

  it('renders OverlayControlComponent and toggles overlay switch', () => {
    render(<OverlayControlComponent />);
    expect(screen.getByText(/On-Page AdUnit Info Overlay/i)).toBeTruthy();

    const switchEl = screen.getByRole('checkbox');
    fireEvent.click(switchEl);

    expect(chrome.storage.local.set).toHaveBeenCalled();
  });

  it('renders ToolsComponent with version >= 7.3.0 (DebuggingModuleComponent)', async () => {
    const mockAppState: any = {
      prebid: { version: '7.30.0', eventsUrl: 'https://test.domain.com/events' },
      prebids: { test: 'data' },
    };

    render(
      <AppStateContext.Provider value={mockAppState}>
        <ToolsComponent />
      </AppStateContext.Provider>
    );

    expect(screen.getByText('Quick Actions & Utilities')).toBeTruthy();
    expect(screen.getByText('Google GAM Console')).toBeTruthy();

    // Click Google GAM Console button
    const gamBtn = screen.getByText('Google GAM Console');
    await act(async () => {
      fireEvent.click(gamBtn);
    });

    expect(chrome.scripting.executeScript).toHaveBeenCalled();

    // Click Download Session JSON button
    const downloadBtn = screen.getByText('Download Session JSON');
    fireEvent.click(downloadBtn);

    // Click Reset Extension Storage button
    const resetBtn = screen.getByText('Reset Extension Storage');
    fireEvent.click(resetBtn);
    expect(chrome.storage.local.set).toHaveBeenCalledWith({ tabInfos: null });
  });

  it('renders ToolsComponent with version < 7.3.0 (ModifyBidResponsesComponent)', () => {
    const legacyAppState: any = {
      prebid: { version: '6.0.0' },
      prebids: {},
      events: [],
    };

    render(
      <AppStateContext.Provider value={legacyAppState}>
        <ToolsComponent />
      </AppStateContext.Provider>
    );

    expect(screen.getByText('Quick Actions & Utilities')).toBeTruthy();
  });
});
