import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import InitiatorComponent from './InitiatorComponent';
import AppStateContext from '../../contexts/appStateContext';
import InspectedPageContext from '../../contexts/inspectedPageContext';
import { INITIATOR_TOGGLE, INITIATOR_ROOT_URL } from '../../constants';

describe('InitiatorComponent', () => {
  let tabUpdatedListener: ((tabId: number, info: any) => void) | null = null;

  beforeEach(() => {
    vi.clearAllMocks();
    tabUpdatedListener = null;

    global.chrome = {
      storage: {
        local: {
          get: vi.fn((key, cb) => {
            if (key === INITIATOR_TOGGLE) cb({ [INITIATOR_TOGGLE]: true });
            else if (key === INITIATOR_ROOT_URL) cb({ [INITIATOR_ROOT_URL]: 'https://example.com/sync' });
            else cb({});
          }),
          set: vi.fn((val, cb) => cb?.()),
        },
      },
      tabs: {
        onUpdated: {
          addListener: vi.fn((fn) => {
            tabUpdatedListener = fn;
          }),
        },
        query: vi.fn((q, cb) => cb([{ id: 1 }])),
        sendMessage: vi.fn(),
      },
      devtools: {
        inspectedWindow: {
          reload: vi.fn(),
        },
      },
    } as any;
  });

  it('renders instructions and controls, and initializes storage values', () => {
    const mockAppState: any = {
      isRefresh: false,
      initDataLoaded: false,
      setInitiatorOutput: vi.fn(),
      setInitDataLoaded: vi.fn(),
      setIsRefresh: vi.fn(),
    };
    const mockInspectedState: any = { initReqChainResult: {} };

    render(
      <AppStateContext.Provider value={mockAppState}>
        <InspectedPageContext.Provider value={mockInspectedState}>
          <InitiatorComponent />
        </InspectedPageContext.Provider>
      </AppStateContext.Provider>
    );

    expect(screen.getByText(/Use Case:/)).toBeTruthy();
    expect(screen.getByLabelText('Enter Root URL')).toBeTruthy();
  });

  it('handles feature switch toggle and root URL setting', async () => {
    const mockAppState: any = {
      isRefresh: false,
      initDataLoaded: false,
      setInitiatorOutput: vi.fn(),
      setInitDataLoaded: vi.fn(),
      setIsRefresh: vi.fn(),
    };

    render(
      <AppStateContext.Provider value={mockAppState}>
        <InspectedPageContext.Provider value={{ initReqChainResult: {} }}>
          <InitiatorComponent />
        </InspectedPageContext.Provider>
      </AppStateContext.Provider>
    );

    // Toggle switch
    const switchEl = screen.getByRole('checkbox');
    fireEvent.click(switchEl);

    expect(chrome.storage.local.set).toHaveBeenCalledWith({ [INITIATOR_TOGGLE]: false }, expect.any(Function));

    // Change root URL text input
    const input = screen.getByLabelText('Enter Root URL');
    fireEvent.change(input, { target: { value: 'https://example.com/new-sync' } });

    const setButton = screen.getByText('Set URL');
    expect(setButton.hasAttribute('disabled')).toBe(false);

    await act(async () => {
      fireEvent.click(setButton);
    });

    expect(chrome.storage.local.set).toHaveBeenCalledWith({ [INITIATOR_ROOT_URL]: 'https://example.com/new-sync' }, expect.any(Function));
  });

  it('handles refresh icon click when enabled vs disabled', async () => {
    const setInitiatorOutput = vi.fn();
    const setInitDataLoaded = vi.fn();
    const setIsRefresh = vi.fn();

    const mockAppState: any = {
      isRefresh: false,
      initDataLoaded: false,
      setInitiatorOutput,
      setInitDataLoaded,
      setIsRefresh,
    };

    render(
      <AppStateContext.Provider value={mockAppState}>
        <InspectedPageContext.Provider value={{ initReqChainResult: {} }}>
          <InitiatorComponent />
        </InspectedPageContext.Provider>
      </AppStateContext.Provider>
    );

    // Refresh icon click when feature is enabled and rootUrl is present
    const refreshIcon = document.querySelector('.initiator__refresh-icon');
    expect(refreshIcon).toBeTruthy();

    if (refreshIcon) {
      fireEvent.click(refreshIcon);
    }

    expect(setInitiatorOutput).toHaveBeenCalledWith({});
    expect(setInitDataLoaded).toHaveBeenCalledWith(false);
    expect(setIsRefresh).toHaveBeenCalledWith(true);
    expect(chrome.devtools.inspectedWindow.reload).toHaveBeenCalledWith({ ignoreCache: true });
  });

  it('shows and closes toast message when clicking refresh while feature or root URL is disabled', async () => {
    global.chrome.storage.local.get = vi.fn((key, cb) => cb({ [INITIATOR_TOGGLE]: false, [INITIATOR_ROOT_URL]: '' }));

    render(
      <AppStateContext.Provider value={{ isRefresh: false, initDataLoaded: false, setInitiatorOutput: vi.fn(), setInitDataLoaded: vi.fn(), setIsRefresh: vi.fn() }}>
        <InspectedPageContext.Provider value={{ initReqChainResult: {} }}>
          <InitiatorComponent />
        </InspectedPageContext.Provider>
      </AppStateContext.Provider>
    );

    const refreshIcon = document.querySelector('.initiator__refresh-icon')!;
    fireEvent.click(refreshIcon);

    expect(screen.getByText(/Make sure that the Network Inspector tool is enabled/)).toBeTruthy();

    // Click refresh again to trigger active toast message dismissal
    fireEvent.click(refreshIcon);

    // Test clicking Set URL when rootUrl is empty
    const setUrlBtn = screen.getByText('Set URL');
    fireEvent.click(setUrlBtn);

    const closeToastBtn = screen.getByRole('button', { name: /close/i });
    act(() => {
      fireEvent.click(closeToastBtn);
    });
  });

  it('renders loading state when isRefresh is true', () => {
    const mockAppState: any = {
      isRefresh: true,
      initDataLoaded: false,
      setInitiatorOutput: vi.fn(),
      setInitDataLoaded: vi.fn(),
      setIsRefresh: vi.fn(),
    };

    render(
      <AppStateContext.Provider value={mockAppState}>
        <InspectedPageContext.Provider value={{ initReqChainResult: {} }}>
          <InitiatorComponent />
        </InspectedPageContext.Provider>
      </AppStateContext.Provider>
    );

    expect(screen.getByText('Generating initiator request chain...')).toBeTruthy();
  });

  it('renders request chain result when present', () => {
    const mockAppState: any = {
      isRefresh: false,
      initDataLoaded: true,
      setInitiatorOutput: vi.fn(),
      setInitDataLoaded: vi.fn(),
      setIsRefresh: vi.fn(),
    };

    const mockInspectedState: any = {
      initReqChainResult: { 'https://example.com/sync': { status: 200 } },
    };

    render(
      <AppStateContext.Provider value={mockAppState}>
        <InspectedPageContext.Provider value={mockInspectedState}>
          <InitiatorComponent />
        </InspectedPageContext.Provider>
      </AppStateContext.Provider>
    );

    expect(screen.getByText(/example\.com/)).toBeTruthy();
  });

  it('handles tabs.onUpdated complete event', () => {
    const setInitDataLoaded = vi.fn();
    render(
      <AppStateContext.Provider value={{ isRefresh: false, initDataLoaded: false, setInitiatorOutput: vi.fn(), setInitDataLoaded, setIsRefresh: vi.fn() }}>
        <InspectedPageContext.Provider value={{ initReqChainResult: {} }}>
          <InitiatorComponent />
        </InspectedPageContext.Provider>
      </AppStateContext.Provider>
    );

    expect(tabUpdatedListener).not.toBeNull();
    if (tabUpdatedListener) {
      tabUpdatedListener(1, { status: 'complete' });
      expect(setInitDataLoaded).toHaveBeenCalledWith(true);
    }
  });
});
