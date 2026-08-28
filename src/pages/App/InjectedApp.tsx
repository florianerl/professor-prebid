import React, { useEffect, useState, useRef } from 'react';
import { EVENTS, CONSOLE_TOGGLE, SAVE_MASKS } from '../Shared/constants';
import { EventBus } from '../Shared/utils';
import AdOverlayPortal from './components/AdOverlayPortal';
import { AdOverlayComponentProps } from './components/AdOverlayComponent';
import { IPrebidAuctionEndEventData, IPrebidBidWonEventData } from '../Injected/prebid';

declare global {
  interface Window {
    [key: string]: any;
  }
}

export const findAdContainer = (adUnitCode: string): HTMLElement | null => {
  if (!adUnitCode) return null;

  // 1. Direct ID match
  let el = document.getElementById(adUnitCode);
  if (el) {
    return el.tagName === 'IFRAME' ? el.parentElement : el;
  }

  // 2. GAM Slot matching
  if (window.googletag && typeof window.googletag.pubads === 'function') {
    try {
      const slots = window.googletag.pubads().getSlots ? window.googletag.pubads().getSlots() : [];
      const matchedSlot = slots.find((s: any) => {
        const path = s.getAdUnitPath ? s.getAdUnitPath() : '';
        const elementId = s.getSlotElementId ? s.getSlotElementId() : '';
        return (path && path.includes(adUnitCode)) || (elementId && elementId.includes(adUnitCode)) || (path && adUnitCode.includes(path)) || (elementId && adUnitCode.includes(elementId));
      });
      if (matchedSlot && matchedSlot.getSlotElementId) {
        const slotEl = document.getElementById(matchedSlot.getSlotElementId());
        if (slotEl) {
          return slotEl.tagName === 'IFRAME' ? slotEl.parentElement : slotEl;
        }
      }
    } catch (e) {
      // Ignored
    }
  }

  // 3. Fallback querySelector (exclude masks, scripts, styles)
  const candidate = document.querySelector(`[id*="${adUnitCode}"]:not([id^=prpb-mask--container-]):not(script):not(style)`) as HTMLElement;
  if (candidate) {
    return candidate.tagName === 'IFRAME' ? candidate.parentElement : candidate;
  }

  return null;
};

export const isContainerVisible = (el: HTMLElement | null): boolean => {
  if (!el || !el.isConnected) return false;
  try {
    const style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden') {
      return false;
    }
  } catch (e) {
    // Ignored
  }
  return true;
};

const InjectedApp = (): JSX.Element => {
  const [consoleState, setConsoleState] = useState(false);
  const [masks, setMasks] = useState<AdOverlayComponentProps[]>([]);
  const [pbjsNameSpace, setPbjsNameSpace] = useState<string>();

  const consoleStateRef = useRef(consoleState);
  const lastGetEventsRef = useRef<number>(0);
  const getEventsTimeoutRef = useRef<number | null>(null);
  const pendingNamespaceRef = useRef<string | null>(null);

  const handleConsoleStateChange = (event: Event) => {
    const checked = (event as CustomEvent).detail;
    setConsoleState(checked);
  };

  const updateMasksFromPbjs = (pbjsNameSpace: string) => {
    setPbjsNameSpace(pbjsNameSpace);
    const pbsjsEvents = (window[pbjsNameSpace]?.getEvents ? window[pbjsNameSpace].getEvents() : []) as unknown[];
    const adUnitCodesSet = new Set<string>();

    // 1. From auctionEnd events
    (pbsjsEvents as IPrebidAuctionEndEventData[])
      .filter((event) => event.eventType === 'auctionEnd')
      .forEach((event) => {
        if (Array.isArray(event.args?.adUnitCodes)) {
          event.args.adUnitCodes.forEach((code) => adUnitCodesSet.add(code));
        }
      });

    // 2. From bidWon events
    (pbsjsEvents as IPrebidBidWonEventData[])
      .filter((event) => event.eventType === 'bidWon')
      .forEach((event) => {
        if (event.args?.adUnitCode) {
          adUnitCodesSet.add(event.args.adUnitCode);
        }
      });

    // 3. From pbjs.adUnits array
    if (Array.isArray(window[pbjsNameSpace]?.adUnits)) {
      window[pbjsNameSpace].adUnits.forEach((unit: any) => {
        if (unit?.code) adUnitCodesSet.add(unit.code);
      });
    }

    // 4. From pbjs.getAdUnits() if available
    if (typeof window[pbjsNameSpace]?.getAdUnits === 'function') {
      try {
        const units = window[pbjsNameSpace].getAdUnits();
        if (Array.isArray(units)) {
          units.forEach((unit: any) => {
            if (unit?.code) adUnitCodesSet.add(unit.code);
          });
        }
      } catch (e) {
        // Ignored
      }
    }

    const allAdunitCodes = Array.from(adUnitCodesSet);
    const masks = allAdunitCodes
      .filter((adUnitCode) => {
        const container = findAdContainer(adUnitCode);
        return isContainerVisible(container);
      })
      .map((adUnitCode) => {
        const slotsBidWonEvent = (pbsjsEvents as IPrebidBidWonEventData[])
          .filter((event) => event.eventType === 'bidWon' && (event.args.adUnitCode === adUnitCode || adUnitCode.includes(event.args.adUnitCode) || event.args.adUnitCode.includes(adUnitCode)))
          .sort((a, b) => (a.args.responseTimestamp < b.args.responseTimestamp ? 1 : -1))[0];

        return {
          elementId: adUnitCode,
          winningCPM: slotsBidWonEvent?.args.cpm ? Math.round(slotsBidWonEvent?.args.cpm * 100) / 100 : undefined,
          winningBidder: slotsBidWonEvent?.args.bidder || slotsBidWonEvent?.args.bidderCode,
          currency: slotsBidWonEvent?.args.currency,
          timeToRespond: slotsBidWonEvent?.args.timeToRespond,
        };
      });
    setMasks(masks);
  };

  const handleNewMasks = (event: Event) => {
    const customEvent = event as CustomEvent;
    const pbjsNameSpace: string = customEvent.detail;

    if (!pbjsNameSpace || !consoleStateRef.current) {
      return;
    }

    pendingNamespaceRef.current = pbjsNameSpace;

    const now = Date.now();
    const interval = 1000;
    const last = lastGetEventsRef.current;

    if (!last || now - last >= interval) {
      lastGetEventsRef.current = now;
      const ns = pendingNamespaceRef.current;
      pendingNamespaceRef.current = null;
      if (ns) {
        updateMasksFromPbjs(ns);
      }
      return;
    }

    if (getEventsTimeoutRef.current == null) {
      const remaining = interval - (now - last);
      getEventsTimeoutRef.current = window.setTimeout(() => {
        lastGetEventsRef.current = Date.now();
        const ns = pendingNamespaceRef.current;
        pendingNamespaceRef.current = null;
        getEventsTimeoutRef.current = null;

        if (ns && consoleStateRef.current) {
          updateMasksFromPbjs(ns);
        }
      }, remaining);
    }
  };

  useEffect(() => {
    consoleStateRef.current = consoleState;
  }, [consoleState]);

  useEffect(() => {
    EventBus.emit(EVENTS.REQUEST_CONSOLE_STATE, null);
    document.addEventListener(CONSOLE_TOGGLE, handleConsoleStateChange);
    document.addEventListener(SAVE_MASKS, handleNewMasks);
    return () => {
      document.removeEventListener(CONSOLE_TOGGLE, handleConsoleStateChange);
      document.removeEventListener(SAVE_MASKS, handleNewMasks);
      if (getEventsTimeoutRef.current !== null) {
        clearTimeout(getEventsTimeoutRef.current);
        getEventsTimeoutRef.current = null;
      }
    };
  }, []);

  return (
    <React.Fragment>
      {masks.map((mask) => {
        const container = findAdContainer(mask.elementId);
        return <AdOverlayPortal key={mask.elementId} mask={mask} consoleState={consoleState} container={container} pbjsNameSpace={pbjsNameSpace} />;
      })}
    </React.Fragment>
  );
};

export default InjectedApp;
