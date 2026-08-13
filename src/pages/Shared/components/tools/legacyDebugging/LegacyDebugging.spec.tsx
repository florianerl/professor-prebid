import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ModifyBidResponsesComponent from './ModifyBidResponsesComponent';
import BidderFilter from './BidderFilter';
import BidOverWriteComponent from './BidOverWriteComponent';
import AppStateContext from '../../../contexts/appStateContext';

vi.mock('../../../../Shared/utils', () => ({
  getTabId: vi.fn().mockResolvedValue(1),
}));

describe('LegacyDebugging components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.chrome = {
      scripting: {
        executeScript: vi.fn().mockResolvedValue([
          {
            result: JSON.stringify({
              enabled: true,
              bidders: ['rubicon'],
              bids: [{ bidder: 'rubicon', adUnitCode: 'slot-1', cpm: 5 }],
            }),
          },
        ]),
      },
    } as any;
  });

  it('renders BidderFilter component and handles adding/removing bidders', () => {
    const mockConfig: any = { enabled: true, bidders: ['rubicon'] };
    const mockAppState: any = { events: [] };
    const setDebugConfigState = vi.fn();

    render(
      <AppStateContext.Provider value={mockAppState}>
        <BidderFilter debugConfigState={mockConfig} setDebugConfigState={setDebugConfigState} />
      </AppStateContext.Provider>
    );

    expect(screen.getByText('Filter Bidder(s)')).toBeTruthy();
    expect(screen.getByText('rubicon')).toBeTruthy();

    const switchBtn = screen.getByRole('checkbox');
    fireEvent.click(switchBtn);

    expect(setDebugConfigState).toHaveBeenCalled();
  });

  it('renders BidOverWriteComponent component and handles adding/editing overwrites', () => {
    const mockConfig: any = { enabled: true, bids: [{ bidder: 'rubicon', adUnitCode: 'slot-1', cpm: 5 }] };
    const mockAppState: any = { events: [] };
    const setDebugConfigState = vi.fn();

    render(
      <AppStateContext.Provider value={mockAppState}>
        <BidOverWriteComponent debugConfigState={mockConfig} setDebugConfigState={setDebugConfigState} />
      </AppStateContext.Provider>
    );

    expect(screen.getByDisplayValue('5')).toBeTruthy();

    const switchBtn = screen.getAllByRole('checkbox')[0];
    fireEvent.click(switchBtn);

    expect(setDebugConfigState).toHaveBeenCalled();
  });

  it('renders ModifyBidResponsesComponent and toggles switch', async () => {
    const mockAppState: any = { pbjsNamespace: 'pbjs', isSmallScreen: false, events: [] };

    await act(async () => {
      render(
        <AppStateContext.Provider value={mockAppState}>
          <ModifyBidResponsesComponent />
        </AppStateContext.Provider>
      );
    });

    expect(screen.getByText('Enable Debugging')).toBeTruthy();

    const toggleSwitch = screen.getAllByRole('checkbox')[0];
    await act(async () => {
      fireEvent.click(toggleSwitch);
    });

    expect(chrome.scripting.executeScript).toHaveBeenCalled();
  });
});
