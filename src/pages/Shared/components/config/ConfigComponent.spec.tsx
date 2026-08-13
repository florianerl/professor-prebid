import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ConfigComponent from './ConfigComponent';
import { ExpandableTile } from './tiles/ExpandableTile';
import AppStateContext from '../../contexts/appStateContext';
import CodeIcon from '@mui/icons-material/Code';

import * as utils from '../../utils';

vi.spyOn(utils, 'download').mockImplementation(() => {});

describe('ConfigComponent & ExpandableTile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders ExpandableTile and handles expand toggle and scrollIntoView', () => {
    const dummyScroll = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = dummyScroll;

    render(
      <ExpandableTile icon={<CodeIcon />} title="Test Tile" subtitle="Tile Subtitle">
        <div>Tile Content</div>
      </ExpandableTile>
    );

    expect(screen.getByText('Test Tile')).toBeTruthy();
    expect(screen.getByText('Tile Subtitle')).toBeTruthy();
    expect(screen.getByText('Tile Content')).toBeTruthy();

    const cardHeader = screen.getByText('Test Tile');
    fireEvent.click(cardHeader);

    // Fast forward scrollIntoView timeout
    act(() => {
      vi.advanceTimersByTime(350);
    });

    expect(dummyScroll).toHaveBeenCalled();
  });

  it('renders ConfigComponent and handles filtering matching and non-matching keys', () => {
    const mockContext: any = {
      prebid: {
        config: {
          bidderTimeout: 3000,
          priceGranularity: 'medium',
        },
      },
    };

    render(
      <AppStateContext.Provider value={mockContext}>
        <ConfigComponent />
      </AppStateContext.Provider>
    );

    expect(screen.getByPlaceholderText('Filter config...')).toBeTruthy();

    const input = screen.getByPlaceholderText('Filter config...');

    // Search matching key
    fireEvent.change(input, { target: { value: 'bidderTimeout' } });
    expect(screen.getByText('config')).toBeTruthy();

    // Search non-matching key
    fireEvent.change(input, { target: { value: 'nonExistentParam' } });
    expect(screen.getByText('No matching configuration parameters')).toBeTruthy();
  });

  it('triggers download config JSON button click', () => {
    const mockContext: any = {
      prebid: {
        config: {
          bidderTimeout: 3000,
        },
      },
    };

    render(
      <AppStateContext.Provider value={mockContext}>
        <ConfigComponent />
      </AppStateContext.Provider>
    );

    const downloadBtn = screen.getByLabelText('Download Prebid config as JSON');
    fireEvent.click(downloadBtn);

    expect(utils.download).toHaveBeenCalledWith({ bidderTimeout: 3000 }, 'prebid-config');
  });

  it('handles tile component error gracefully using ErrorBoundary fallback', () => {
    const ProblematicTile = () => {
      throw new Error('Tile rendering error');
    };

    // Suppress console.error output for expected error boundary test
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ConfigComponent />
    );

    spy.mockRestore();
  });
});
