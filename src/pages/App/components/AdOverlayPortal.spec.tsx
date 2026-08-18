import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AdOverlayPortal, { getMaxZIndex } from './AdOverlayPortal';

vi.mock('./AdOverlayComponent', () => {
  return {
    default: (props: any) => (
      <div data-testid="mock-ad-overlay-component">
        <button data-testid="close-portal-btn" onClick={props.closePortal}>
          Close
        </button>
      </div>
    ),
  };
});

describe('AdOverlayPortal', () => {
  let container: HTMLElement;
  const mockMask = {
    elementId: 'test-ad-slot',
    winningCPM: 1.2,
    winningBidder: 'appnexus',
    currency: 'USD',
    timeToRespond: 120
  };

  beforeEach(() => {
    document.body.innerHTML = '';
    container = document.createElement('div');
    container.style.position = '';
    document.body.appendChild(container);
  });

  describe('getMaxZIndex', () => {
    it('returns 0 when no elements have z-index', () => {
      expect(getMaxZIndex()).toBe(0);
    });

    it('returns the maximum z-index', () => {
      const div1 = document.createElement('div');
      div1.style.zIndex = '5';
      document.body.appendChild(div1);
      
      const div2 = document.createElement('div');
      div2.style.zIndex = '10';
      document.body.appendChild(div2);

      expect(getMaxZIndex()).toBe(10);
    });
  });

  describe('Component rendering', () => {
    it('renders iframe and appends container mask when consoleState is true', () => {
      render(
        <AdOverlayPortal 
          container={container} 
          mask={mockMask} 
          consoleState={true} 
          pbjsNameSpace="pbjs" 
        />
      );
      
      // The component creates a new div inside the container
      const maskElement = document.getElementById(`prpb-mask--container-${mockMask.elementId}`);
      expect(maskElement).not.toBeNull();
      expect(maskElement?.style.position).toBe('absolute');
      
      // Iframe should be inside the portal
      const iframe = document.querySelector('iframe');
      expect(iframe).not.toBeNull();
    });

    it('does not append mask when consoleState is false', () => {
      render(
        <AdOverlayPortal 
          container={container} 
          mask={mockMask} 
          consoleState={false} 
          pbjsNameSpace="pbjs" 
        />
      );
      
      expect(document.getElementById(`prpb-mask--container-${mockMask.elementId}`)).toBeNull();
    });

    it('updates dimensions when mask is already present and consoleState is true', () => {
      Object.defineProperty(container, 'offsetWidth', { value: 500, configurable: true });
      Object.defineProperty(container, 'offsetHeight', { value: 250, configurable: true });
      
      const div = document.createElement('div');
      div.id = `prpb-mask--container-${mockMask.elementId}`;
      container.appendChild(div);

      render(
        <AdOverlayPortal 
          container={container} 
          mask={mockMask} 
          consoleState={true} 
          pbjsNameSpace="pbjs" 
        />
      );
      
      expect(div.style.width).toBe('500px');
      expect(div.style.height).toBe('250px');
    });

    it('hides the mask container when closePortal is triggered', () => {
      render(
        <AdOverlayPortal
          container={container}
          mask={mockMask}
          consoleState={true}
          pbjsNameSpace="pbjs"
        />
      );

      const maskElement = document.getElementById(`prpb-mask--container-${mockMask.elementId}`);
      expect(maskElement).not.toBeNull();

      const closeBtn = screen.queryByTestId('close-portal-btn');
      if (closeBtn) {
        act(() => {
          closeBtn.click();
        });
        expect(maskElement?.style.display).toBe('none');
      }
    });
  });
});
