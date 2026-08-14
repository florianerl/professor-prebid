import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PopOverComponent from './PopOverComponent';

// Mock child components to isolate PopOverComponent testing
vi.mock('./GamDetailsComponent', () => {
  return {
    default: ({ elementId, inPopOver }: any) => (
      <div data-testid="mock-gam-details">
        GamDetails: {elementId} - inPopOver: {inPopOver ? 'true' : 'false'}
      </div>
    )
  };
});

vi.mock('../../Shared/components/adUnits/AdUnitsComponent', () => {
  return {
    default: ({ elementId }: any) => (
      <div data-testid="mock-ad-units">
        AdUnits: {elementId}
      </div>
    )
  };
});

describe('PopOverComponent', () => {
  const defaultProps = {
    elementId: 'div-gpt-ad-1234567-0',
    winningBidder: 'appnexus',
    winningCPM: 2.5,
    currency: 'USD',
    timeToRespond: 300,
    setAnchorEl: vi.fn(),
    anchorEl: document.createElement('button')
  };

  it('renders correctly when anchorEl is provided', () => {
    render(<PopOverComponent {...defaultProps} />);
    
    // Check header
    expect(screen.getByText('div-gpt-ad-1234567-0')).toBeDefined();
    
    // Check prebid winning bid details
    expect(screen.getByText('appnexus')).toBeDefined();
    expect(screen.getByText('2.5 USD')).toBeDefined();
    expect(screen.getByText('300ms')).toBeDefined();
    
  });

  it('does not render content when anchorEl is null', () => {
    const { container } = render(<PopOverComponent {...defaultProps} anchorEl={null} />);
    
    // MUI Popover is not open, but might render empty div in DOM depending on keepMounted prop, usually it renders nothing or hidden
    expect(screen.queryByText('div-gpt-ad-1234567-0')).toBeNull();
  });

  it('calls setAnchorEl when close button is clicked', () => {
    render(<PopOverComponent {...defaultProps} />);
    
    // Find the close IconButton (it's the only button in the popover header)
    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);
    
    expect(defaultProps.setAnchorEl).toHaveBeenCalled();
  });
});
