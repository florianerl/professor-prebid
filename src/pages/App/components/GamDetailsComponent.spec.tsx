import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import GamDetailsComponent from './GamDetailsComponent';

describe('GamDetailsComponent', () => {
  const mockAddEventListener = vi.fn();
  const mockRemoveEventListener = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
    document.body.innerHTML = '';
    
    const mockGoogletag = {
      pubads: vi.fn().mockReturnValue({
        getSlots: vi.fn().mockReturnValue([{
          getSlotElementId: () => 'div-gpt-ad-1234567-0',
          getAdUnitPath: () => '/12345/ad-unit',
          getTargetingKeys: () => ['test-key'],
          getTargeting: (key: string) => key === 'test-key' ? ['test-value'] : [],
          getResponseInformation: () => ({
            creativeId: 98765,
            lineItemId: 43210
          })
        }]),
        addEventListener: mockAddEventListener,
        removeEventListener: mockRemoveEventListener,
      })
    };
    
    (window as any).parent = { googletag: mockGoogletag };
    (global as any).googletag = mockGoogletag;
    (window as any).googletag = mockGoogletag;
  });

  it('renders nothing when elementId does not match any slot', () => {
    const { container } = render(
      <GamDetailsComponent elementId="non-existent-id" inPopOver={false} truncate={false} />
    );
    expect(container.innerHTML).toBe('');
  });

  it('renders line item, creative, and ad unit details when elementId matches', () => {
    // Mock the DOM element for queryId
    const div = document.createElement('div');
    div.id = 'div-gpt-ad-1234567-0';
    div.setAttribute('data-google-query-id', 'query-123');
    document.body.appendChild(div);

    render(
      <GamDetailsComponent elementId="div-gpt-ad-1234567-0" inPopOver={false} truncate={false} />
    );

    expect(screen.getByText('LineItem-ID:')).toBeDefined();
    expect(screen.getByText('43210')).toBeDefined();
    
    expect(screen.getByText('Creative-ID:')).toBeDefined();
    expect(screen.getByText('98765')).toBeDefined();
    
    expect(screen.getByText('AdUnit Path:')).toBeDefined();
    expect(screen.getByText('/12345/ad-unit')).toBeDefined();

    expect(screen.getByText('Element-ID:')).toBeDefined();
    expect(screen.getByText('div-gpt-ad-1234567-0')).toBeDefined();

    expect(screen.getByText('Query-ID:')).toBeDefined();
    expect(screen.getByText('query-123')).toBeDefined();
  });

  it('truncates query ID when truncate is true', () => {
    const div = document.createElement('div');
    div.id = 'div-gpt-ad-1234567-0';
    div.setAttribute('data-google-query-id', 'long-query-id-1234567890');
    document.body.appendChild(div);

    render(
      <GamDetailsComponent elementId="div-gpt-ad-1234567-0" inPopOver={false} truncate={true} />
    );

    // Should truncate "long-query-id-1234567890" -> "long...7890"
    expect(screen.getByText('long...7890')).toBeDefined();
  });

  it('renders additional popover details when inPopOver is true', () => {
    render(
      <GamDetailsComponent elementId="div-gpt-ad-1234567-0" inPopOver={true} truncate={false} />
    );

    // In popover it displays Response-Info and Targeting
    expect(screen.getByText('Response-Info:')).toBeDefined();
    expect(screen.getByText('Targeting:')).toBeDefined();
    expect(screen.getByText('test-key')).toBeDefined();
    expect(screen.getByText('test-value')).toBeDefined();
  });

  it('adds and removes event listeners correctly', () => {
    const { unmount } = render(
      <GamDetailsComponent elementId="div-gpt-ad-1234567-0" inPopOver={false} truncate={false} />
    );
    
    expect(mockAddEventListener).toHaveBeenCalledWith('slotResponseReceived', expect.any(Function));
    expect(mockAddEventListener).toHaveBeenCalledWith('slotRenderEnded', expect.any(Function));

    unmount();

    expect(mockRemoveEventListener).toHaveBeenCalledWith('slotResponseReceived', expect.any(Function));
    expect(mockRemoveEventListener).toHaveBeenCalledWith('slotRenderEnded', expect.any(Function));
  });
});
