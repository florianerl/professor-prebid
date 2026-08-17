import { PRE_AUCTION_HAR } from '../Shared/constants';

/**
 * Records a flat log of every request the inspected page makes, for the Pre-Auction tab to correlate
 * with RTD and identity providers.
 *
 * Deliberately independent of the Network Inspector's `initReqChain` collector: no root URL, no
 * feature toggle and no devtools restart, because this needs to work the moment the panel is opened.
 * The one unavoidable limitation is that `onRequestFinished` only fires while devtools is open, so a
 * page loaded beforehand yields a partial log.
 */

/** Guards against unbounded growth on long-lived pages with heavy ad refresh. */
const MAX_ENTRIES = 2000;

let entries: IHarLogEntry[] = [];
let flushTimeout: ReturnType<typeof setTimeout> | null = null;

export interface IHarLogEntry {
  url: string;
  host: string;
  method: string;
  status: number;
  startedDateTime: number;
  time: number;
  /** devtools resource type ('script', 'xhr', 'fetch', 'image'...). */
  resourceType?: string;
}

const hostOf = (url: string): string => {
  try {
    return new URL(url).hostname;
  } catch (error) {
    return '';
  }
};

/**
 * Only real network traffic belongs in the log. `chrome-extension://` in particular would otherwise
 * include Professor Prebid injecting itself, which then gets attributed to whichever provider
 * happened to load a script nearby.
 */
export const isRecordableUrl = (url: string): boolean => /^https?:\/\//i.test(url || '');

export const toLogEntry = (harEntry: any): IHarLogEntry => {
  return {
    url: harEntry?.request?.url || '',
    host: hostOf(harEntry?.request?.url || ''),
    method: harEntry?.request?.method || 'GET',
    status: harEntry?.response?.status ?? 0,
    startedDateTime: new Date(harEntry?.startedDateTime).getTime() || 0,
    // HAR reports sub-millisecond precision that is noise here and unreadable when displayed raw
    time: Math.round((Number(harEntry?.time) || 0) * 100) / 100,
    resourceType: harEntry?._resourceType,
  };
};

/** Batched so a burst of requests does not cause a write per request. */
const flush = () => {
  flushTimeout = null;
  chrome.storage.local.set({ [PRE_AUCTION_HAR]: JSON.stringify(entries) });
};

const scheduleFlush = () => {
  if (flushTimeout) return;
  flushTimeout = setTimeout(flush, 500);
};

const record = (harEntry: any) => {
  const entry = toLogEntry(harEntry);
  if (!isRecordableUrl(entry.url)) return;
  entries.push(entry);
  if (entries.length > MAX_ENTRIES) entries = entries.slice(-MAX_ENTRIES);
  scheduleFlush();
};

const reset = () => {
  entries = [];
  chrome.storage.local.set({ [PRE_AUCTION_HAR]: JSON.stringify(entries) });
};

export const collectHarLog = () => {
  if (!chrome.devtools?.network?.onRequestFinished) return;
  reset();
  chrome.devtools.network.onRequestFinished.addListener(record);
  chrome.tabs?.onUpdated.addListener((tabId, info) => {
    if (info.status === 'loading') reset();
  });
};
