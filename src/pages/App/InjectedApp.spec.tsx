import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import InjectedApp from './InjectedApp';
import { EVENTS, CONSOLE_TOGGLE, SAVE_MASKS } from '../Shared/constants';
import { EventBus } from '../Shared/utils';

vi.mock('./components/AdOverlayPortal', () => ({
  default: ({ mask, consoleState, container, pbjsNameSpace }: any) => (
    <div data-testid={`overlay-portal-${mask.elementId}`} data-console-state={consoleState} data-pbjs-namespace={pbjsNameSpace}>
      AdOverlayPortal: {mask.elementId} | CPM: {mask.winningCPM ?? 'none'} | Bidder: {mask.winningBidder ?? 'none'}
    </div>
  ),
}));

// Mock EventBus
vi.mock('../Shared/utils', async () => {
  const original = await vi.importActual<typeof import('../Shared/utils')>('../Shared/utils');
  return {
    ...original,
    EventBus: {
      emit: vi.fn(),
    },
  };
});

describe('InjectedApp Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    // Clean up window pbjs mock properties
    delete (window as any).pbjs;
    delete (window as any).customPbjs;
    document.body.innerHTML = '';
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('emits REQUEST_CONSOLE_STATE on mount and attaches event listeners', () => {
    const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
    render(<InjectedApp />);

    expect(EventBus.emit).toHaveBeenCalledWith(EVENTS.REQUEST_CONSOLE_STATE, null);
    expect(addEventListenerSpy).toHaveBeenCalledWith(CONSOLE_TOGGLE, expect.any(Function));
    expect(addEventListenerSpy).toHaveBeenCalledWith(SAVE_MASKS, expect.any(Function));
  });

  it('removes event listeners on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
    const { unmount } = render(<InjectedApp />);

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(CONSOLE_TOGGLE, expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith(SAVE_MASKS, expect.any(Function));
  });

  it('updates consoleState when CONSOLE_TOGGLE event is dispatched', () => {
    render(<InjectedApp />);

    act(() => {
      document.dispatchEvent(new CustomEvent(CONSOLE_TOGGLE, { detail: true }));
    });

    // When consoleState is true, SAVE_MASKS should process
    // Setup window.pbjs mock
    const mockAdUnitDiv = document.createElement('div');
    mockAdUnitDiv.id = 'div-gpt-ad-1';
    document.body.appendChild(mockAdUnitDiv);

    (window as any).pbjs = {
      getEvents: () => [
        {
          eventType: 'auctionEnd',
          args: { adUnitCodes: ['div-gpt-ad-1'] },
        },
        {
          eventType: 'bidWon',
          args: {
            adUnitCode: 'div-gpt-ad-1',
            cpm: 2.456,
            bidder: 'rubicon',
            currency: 'USD',
            responseTimestamp: 100,
          },
        },
      ],
    };

    act(() => {
      document.dispatchEvent(new CustomEvent(SAVE_MASKS, { detail: 'pbjs' }));
    });

    expect(screen.getByTestId('overlay-portal-div-gpt-ad-1')).toBeTruthy();
    expect(screen.getByText(/CPM: 2.46/)).toBeTruthy();
    expect(screen.getByText(/Bidder: rubicon/)).toBeTruthy();
  });

  it('ignores SAVE_MASKS event if detail is missing or consoleState is false', () => {
    render(<InjectedApp />);

    // consoleState is false initially
    act(() => {
      document.dispatchEvent(new CustomEvent(SAVE_MASKS, { detail: 'pbjs' }));
    });

    expect(screen.queryByTestId(/overlay-portal-/)).toBeNull();

    // Enable console state, but pass empty namespace detail
    act(() => {
      document.dispatchEvent(new CustomEvent(CONSOLE_TOGGLE, { detail: true }));
      document.dispatchEvent(new CustomEvent(SAVE_MASKS, { detail: '' }));
    });

    expect(screen.queryByTestId(/overlay-portal-/)).toBeNull();
  });

  it('handles window[pbjsNamespace] being undefined or lacking getEvents', () => {
    render(<InjectedApp />);

    act(() => {
      document.dispatchEvent(new CustomEvent(CONSOLE_TOGGLE, { detail: true }));
      // 'nonExistentPbjs' is not defined on window
      document.dispatchEvent(new CustomEvent(SAVE_MASKS, { detail: 'nonExistentPbjs' }));
    });

    expect(screen.queryByTestId(/overlay-portal-/)).toBeNull();
  });

  it('filters out ad units that are not present in the DOM', () => {
    render(<InjectedApp />);

    (window as any).pbjs = {
      getEvents: () => [
        {
          eventType: 'auctionEnd',
          args: { adUnitCodes: ['missing-ad-unit'] },
        },
      ],
    };

    act(() => {
      document.dispatchEvent(new CustomEvent(CONSOLE_TOGGLE, { detail: true }));
      document.dispatchEvent(new CustomEvent(SAVE_MASKS, { detail: 'pbjs' }));
    });

    expect(screen.queryByTestId('overlay-portal-missing-ad-unit')).toBeNull();
  });

  it('matches DOM elements using document.querySelector selector fallback', () => {
    const elem = document.createElement('div');
    elem.id = 'slot_123_banner';
    document.body.appendChild(elem);

    (window as any).pbjs = {
      getEvents: () => [
        {
          eventType: 'auctionEnd',
          args: { adUnitCodes: ['slot_123'] },
        },
        {
          eventType: 'bidWon',
          args: {
            adUnitCode: 'slot_123',
            cpm: 1.5,
            bidderCode: 'appnexus',
            responseTimestamp: 50,
          },
        },
      ],
    };

    render(<InjectedApp />);

    act(() => {
      document.dispatchEvent(new CustomEvent(CONSOLE_TOGGLE, { detail: true }));
    });

    act(() => {
      document.dispatchEvent(new CustomEvent(SAVE_MASKS, { detail: 'pbjs' }));
    });

    expect(screen.getByTestId('overlay-portal-slot_123')).toBeTruthy();
    expect(screen.getByText(/Bidder: appnexus/)).toBeTruthy();
  });

  it('resolves parent container when matched element is an iframe', () => {
    const parentDiv = document.createElement('div');
    parentDiv.id = 'gpt-slot-wrapper';
    const iframe = document.createElement('iframe');
    iframe.id = 'google_ads_iframe_/1234/slot_iframe_0';
    parentDiv.appendChild(iframe);
    document.body.appendChild(parentDiv);

    (window as any).pbjs = {
      getEvents: () => [
        {
          eventType: 'auctionEnd',
          args: { adUnitCodes: ['slot_iframe'] },
        },
      ],
    };

    render(<InjectedApp />);

    act(() => {
      document.dispatchEvent(new CustomEvent(CONSOLE_TOGGLE, { detail: true }));
    });

    act(() => {
      document.dispatchEvent(new CustomEvent(SAVE_MASKS, { detail: 'pbjs' }));
    });

    expect(screen.getByTestId('overlay-portal-slot_iframe')).toBeTruthy();
  });

  it('sorts multiple bidWon events by responseTimestamp descending to pick the winning bid', () => {
    const elem = document.createElement('div');
    elem.id = 'slot_multi';
    document.body.appendChild(elem);

    (window as any).pbjs = {
      getEvents: () => [
        {
          eventType: 'auctionEnd',
          args: { adUnitCodes: ['slot_multi'] },
        },
        {
          eventType: 'bidWon',
          args: {
            adUnitCode: 'slot_multi',
            cpm: 1.0,
            bidder: 'bidderA',
            responseTimestamp: 100,
          },
        },
        {
          eventType: 'bidWon',
          args: {
            adUnitCode: 'slot_multi',
            cpm: 3.75,
            bidder: 'bidderB',
            responseTimestamp: 250, // latest response
          },
        },
      ],
    };

    render(<InjectedApp />);

    act(() => {
      document.dispatchEvent(new CustomEvent(CONSOLE_TOGGLE, { detail: true }));
    });

    act(() => {
      document.dispatchEvent(new CustomEvent(SAVE_MASKS, { detail: 'pbjs' }));
    });

    expect(screen.getByTestId('overlay-portal-slot_multi')).toBeTruthy();
    expect(screen.getByText(/CPM: 3.75/)).toBeTruthy();
    expect(screen.getByText(/Bidder: bidderB/)).toBeTruthy();
  });

  it('throttles rapid SAVE_MASKS events and executes scheduled update when interval passes', () => {
    const elem = document.createElement('div');
    elem.id = 'slot_throttle';
    document.body.appendChild(elem);

    const getEventsMock = vi.fn(() => [
      {
        eventType: 'auctionEnd',
        args: { adUnitCodes: ['slot_throttle'] },
      },
    ]);

    (window as any).pbjs = {
      getEvents: getEventsMock,
    };

    render(<InjectedApp />);

    act(() => {
      document.dispatchEvent(new CustomEvent(CONSOLE_TOGGLE, { detail: true }));
    });

    act(() => {
      document.dispatchEvent(new CustomEvent(SAVE_MASKS, { detail: 'pbjs' }));
    });

    expect(getEventsMock).toHaveBeenCalledTimes(1);

    act(() => {
      document.dispatchEvent(new CustomEvent(SAVE_MASKS, { detail: 'pbjs' }));
    });

    act(() => {
      vi.advanceTimersByTime(1100);
    });

    expect(getEventsMock).toHaveBeenCalledTimes(2);
  });

  it('does not update masks on timeout if consoleState becomes false before timeout fires', () => {
    const elem = document.createElement('div');
    elem.id = 'slot_cancel';
    document.body.appendChild(elem);

    const getEventsMock = vi.fn(() => [
      {
        eventType: 'auctionEnd',
        args: { adUnitCodes: ['slot_cancel'] },
      },
    ]);

    (window as any).pbjs = {
      getEvents: getEventsMock,
    };

    render(<InjectedApp />);

    act(() => {
      document.dispatchEvent(new CustomEvent(CONSOLE_TOGGLE, { detail: true }));
      document.dispatchEvent(new CustomEvent(SAVE_MASKS, { detail: 'pbjs' }));
    });

    act(() => {
      document.dispatchEvent(new CustomEvent(SAVE_MASKS, { detail: 'pbjs' }));
      document.dispatchEvent(new CustomEvent(CONSOLE_TOGGLE, { detail: false }));
    });

    act(() => {
      vi.advanceTimersByTime(1100);
    });

    expect(getEventsMock).toHaveBeenCalledTimes(1);
  });

  it('clears scheduled timeout when unmounting', () => {
    const { unmount } = render(<InjectedApp />);

    act(() => {
      document.dispatchEvent(new CustomEvent(CONSOLE_TOGGLE, { detail: true }));
      document.dispatchEvent(new CustomEvent(SAVE_MASKS, { detail: 'pbjs' }));
      // Second dispatch within throttle window creates a scheduled timeout
      document.dispatchEvent(new CustomEvent(SAVE_MASKS, { detail: 'pbjs' }));
    });

    unmount();
  });
});
