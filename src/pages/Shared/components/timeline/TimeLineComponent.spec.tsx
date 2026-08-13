import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TimeLineComponent from './TimeLineComponent';
import AppStateContext from '../../contexts/appStateContext';

import * as utils from '../../utils';

vi.spyOn(utils, 'download').mockImplementation(() => {});

// Mock GanttChartComponent to simplify SVG rendering test
vi.mock('../../../Popup/components/timeline/GanttChartComponent', () => ({
  default: () => <div data-testid="gantt-chart">Gantt Chart View</div>,
}));

describe('TimeLineComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockAuctionEvents: any = [
    {
      args: {
        auctionId: 'auction-123456789',
        auctionEnd: 2000,
        timestamp: 1000,
        bidderRequests: [{ bidderCode: 'rubicon' }, { bidderCode: 'criteo' }],
      },
    },
    {
      args: {
        auctionId: 'auction-987654321',
        auctionEnd: 2500,
        timestamp: 1000,
        bidderRequests: [{ bidderCode: 'appnexus' }],
      },
    },
  ];

  const mockContext: any = {
    prebid: { events: mockAuctionEvents, config: { bidderTimeout: 3000 } },
    auctionEndEvents: mockAuctionEvents,
  };

  it('renders empty message when no auction events exist', () => {
    const emptyContext: any = {
      prebid: { events: [] },
      auctionEndEvents: [],
    };

    render(
      <AppStateContext.Provider value={emptyContext}>
        <TimeLineComponent />
      </AppStateContext.Provider>
    );

    expect(screen.getByText(/No auction timeline events detected/)).toBeTruthy();
  });

  it('renders header bar, switches auction sub-tabs and toggles JSON view', () => {
    render(
      <AppStateContext.Provider value={mockContext}>
        <TimeLineComponent />
      </AppStateContext.Provider>
    );

    expect(screen.getByText('Auctions: 2')).toBeTruthy();
    expect(screen.getByText('Max Duration: 1500ms')).toBeTruthy();
    expect(screen.getByText('Timeout: 3000ms')).toBeTruthy();
    expect(screen.getByTestId('gantt-chart')).toBeTruthy();

    // Click individual Auction #1 tab
    const auction1Btn = screen.getByText(/Auction #1/);
    fireEvent.click(auction1Btn);

    expect(screen.getByText('Duration: 1000ms')).toBeTruthy();

    // Toggle JSON View button
    const codeBtn = screen.getByLabelText('Switch to raw JSON view');
    fireEvent.click(codeBtn);

    expect(screen.getByText('auctions')).toBeTruthy();

    // Toggle back to Gantt view
    const svgBtn = screen.getByLabelText('Switch to SVG Timeline view');
    fireEvent.click(svgBtn);

    expect(screen.getByTestId('gantt-chart')).toBeTruthy();
  });

  it('handles search query input in AutoComplete filter', () => {
    render(
      <AppStateContext.Provider value={mockContext}>
        <TimeLineComponent />
      </AppStateContext.Provider>
    );

    const input = screen.getByPlaceholderText('Filter bidder timeline...');
    fireEvent.change(input, { target: { value: 'rubicon' } });

    expect(input).toHaveValue('rubicon');
  });

  it('triggers download auction events button click', () => {
    render(
      <AppStateContext.Provider value={mockContext}>
        <TimeLineComponent />
      </AppStateContext.Provider>
    );

    const downloadBtn = screen.getByLabelText('Download timeline auction events as JSON');
    fireEvent.click(downloadBtn);

    expect(utils.download).toHaveBeenCalledWith(mockAuctionEvents, 'timeline-auctions');
  });
});
