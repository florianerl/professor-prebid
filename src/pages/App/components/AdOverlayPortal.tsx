import React, { useEffect, useRef, useState } from 'react';
import AdOverlayComponent, { AdOverlayComponentProps } from './AdOverlayComponent';
import { createPortal } from 'react-dom';

export const getMaxZIndex = () => Math.max(...Array.from(document.querySelectorAll('*'), (el) => parseFloat(window.getComputedStyle(el).zIndex)).filter((zIndex) => !Number.isNaN(zIndex)), 0);

const AdOverlayPortal: React.FC<AdOverlayPortalComponentProps> = ({ container, mask, consoleState, pbjsNameSpace }) => {
  const { elementId, winningCPM, winningBidder, currency, timeToRespond } = mask;
  const element = useRef<HTMLDivElement>(document.createElement('div'));
  const [shadowRoot, setShadowRoot] = useState<ShadowRoot | null>(null);
  
  useEffect(() => {
    if (!element.current.shadowRoot) {
      setShadowRoot(element.current.attachShadow({ mode: 'open' }));
    }
  }, []);

  const closePortal = () => {
    document.getElementById(`prpb-mask--container-${mask.elementId}`).style.display = 'none';
  };

  useEffect(() => {
    const slotMaskElement = document.getElementById(`prpb-mask--container-${mask.elementId}`);
    if (consoleState) {
      if (!slotMaskElement) {
        element.current.style.zIndex = `${getMaxZIndex() + 1}`;
        element.current.style.position = 'absolute';
        element.current.style.wordBreak = 'break-all';
        element.current.style.pointerEvents = 'none'; // Allow clicks to pass through
        element.current.id = `prpb-mask--container-${mask.elementId}`;
        element.current.style.top = '0';
        element.current.style.left = '0';
        if (container.style.position === '') {
          container.style.position = 'relative';
        }
        container?.append(element.current);
      }
      
      const targetElement = slotMaskElement || element.current;
      if (targetElement) {
        targetElement.style.width = `${container?.offsetWidth || container?.clientWidth}px`;
        targetElement.style.height = `${container?.offsetHeight || container?.clientHeight}px`;
      }
    } else {
      slotMaskElement?.parentNode?.removeChild(slotMaskElement);
    }
  }, [mask, consoleState, container]);

  return shadowRoot ? createPortal(
    <AdOverlayComponent
      key={`AdMask-${elementId}`}
      elementId={elementId}
      winningCPM={winningCPM}
      winningBidder={winningBidder}
      currency={currency}
      timeToRespond={timeToRespond}
      closePortal={closePortal}
      shadowRoot={shadowRoot}
      pbjsNameSpace={pbjsNameSpace}
    />,
    shadowRoot
  ) : null;
};

interface AdOverlayPortalComponentProps {
  mask: AdOverlayComponentProps;
  consoleState: boolean;
  container: HTMLElement;
  pbjsNameSpace: string;
}

export default AdOverlayPortal;
