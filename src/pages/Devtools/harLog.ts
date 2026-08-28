import { PRE_AUCTION_HAR } from '../Shared/constants';

/**
 * Records a rich log of network requests the inspected page makes, powering both:
 * - The Pre-Auction tab (latency and timing correlation with RTD/ID providers)
 * - The modernized Network Inspector tab (Prebid traffic categories, visual initiator cascades, privacy auditing)
 *
 * Performance-optimized:
 * - Bound to MAX_ENTRIES ring buffer to prevent memory leaks on long sessions
 * - Batched writes to chrome.storage.local
 * - String and payload truncation to keep storage serialization lightweight
 */

const MAX_ENTRIES = 1000;
const MAX_POST_TEXT_LENGTH = 10000;
const MAX_ARRAY_ITEMS = 50;

let entries: IHarLogEntry[] = [];
let flushTimeout: ReturnType<typeof setTimeout> | null = null;
let idCounter = 1;

export interface IHarTimingBreakdown {
  blocked?: number;
  dns?: number;
  connect?: number;
  send?: number;
  wait?: number;
  receive?: number;
  ssl?: number;
}

export interface IInitiatorInfo {
  type: string;
  url?: string;
  lineNumber?: number;
  stack?: any;
}

export interface IHarLogEntry {
  id: string;
  url: string;
  host: string;
  pathname: string;
  method: string;
  status: number;
  statusText?: string;
  startedDateTime: number;
  time: number;
  /** devtools resource type ('script', 'xhr', 'fetch', 'image', 'document'...). */
  resourceType?: string;
  mimeType?: string;
  queryString?: Array<{ name: string; value: string }>;
  requestHeaders?: Array<{ name: string; value: string }>;
  responseHeaders?: Array<{ name: string; value: string }>;
  requestCookies?: Array<{ name: string; value: string }>;
  responseCookies?: Array<{ name: string; value: string }>;
  redirectURL?: string;
  initiator?: IInitiatorInfo;
  postData?: {
    mimeType?: string;
    text?: string;
    params?: Array<{ name: string; value: string }>;
  };
  timings?: IHarTimingBreakdown;
  contentSize?: number;
  bodySize?: number;
}

export const hostOf = (url: string): string => {
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
};

export const pathOf = (url: string): string => {
  try {
    return new URL(url).pathname;
  } catch {
    return '';
  }
};

/**
 * Only real network traffic belongs in the log. Excludes internal chrome extensions or data URIs.
 */
export const isRecordableUrl = (url: string): boolean => /^https?:\/\//i.test(url || '');

const truncate = (str?: string, maxLen = MAX_POST_TEXT_LENGTH): string | undefined => {
  if (typeof str !== 'string') return undefined;
  return str.length > maxLen ? str.slice(0, maxLen) + '... [truncated]' : str;
};

const sanitizeNameValuePairs = (arr?: any[]): Array<{ name: string; value: string }> | undefined => {
  if (!Array.isArray(arr) || arr.length === 0) return undefined;
  return arr.slice(0, MAX_ARRAY_ITEMS).map((item) => ({
    name: String(item?.name ?? '').slice(0, 150),
    value: String(item?.value ?? '').slice(0, 2000),
  }));
};

const extractQueryParams = (harEntry: any, url: string): Array<{ name: string; value: string }> | undefined => {
  const fromHar = sanitizeNameValuePairs(harEntry?.request?.queryString);
  if (fromHar && fromHar.length > 0) return fromHar;

  if (url) {
    try {
      const parsed = new URL(url);
      const params: Array<{ name: string; value: string }> = [];
      parsed.searchParams.forEach((val, key) => {
        if (params.length < MAX_ARRAY_ITEMS) {
          params.push({ name: key.slice(0, 150), value: val.slice(0, 2000) });
        }
      });
      return params.length > 0 ? params : undefined;
    } catch {
      return undefined;
    }
  }
  return undefined;
};

const extractPostData = (postData: any): IHarLogEntry['postData'] => {
  if (!postData) return undefined;
  return {
    mimeType: postData.mimeType,
    text: truncate(postData.text),
    params: sanitizeNameValuePairs(postData.params),
  };
};

const extractTimings = (timings: any): IHarTimingBreakdown | undefined => {
  if (!timings || typeof timings !== 'object') return undefined;
  return {
    blocked: typeof timings.blocked === 'number' ? Math.max(0, Math.round(timings.blocked * 10) / 10) : undefined,
    dns: typeof timings.dns === 'number' ? Math.max(0, Math.round(timings.dns * 10) / 10) : undefined,
    connect: typeof timings.connect === 'number' ? Math.max(0, Math.round(timings.connect * 10) / 10) : undefined,
    send: typeof timings.send === 'number' ? Math.max(0, Math.round(timings.send * 10) / 10) : undefined,
    wait: typeof timings.wait === 'number' ? Math.max(0, Math.round(timings.wait * 10) / 10) : undefined,
    receive: typeof timings.receive === 'number' ? Math.max(0, Math.round(timings.receive * 10) / 10) : undefined,
    ssl: typeof timings.ssl === 'number' ? Math.max(0, Math.round(timings.ssl * 10) / 10) : undefined,
  };
};

export const toLogEntry = (harEntry: any): IHarLogEntry => {
  const url = harEntry?.request?.url || '';
  const now = Date.now();
  const entryId = `req_${idCounter++}_${now}`;

  return {
    id: entryId,
    url,
    host: hostOf(url),
    pathname: pathOf(url),
    method: harEntry?.request?.method || 'GET',
    status: harEntry?.response?.status ?? 0,
    statusText: harEntry?.response?.statusText || '',
    startedDateTime: new Date(harEntry?.startedDateTime).getTime() || 0,
    time: Math.round((Number(harEntry?.time) || 0) * 100) / 100,
    resourceType: harEntry?._resourceType,
    mimeType: harEntry?.response?.content?.mimeType,
    queryString: extractQueryParams(harEntry, url),
    requestHeaders: sanitizeNameValuePairs(harEntry?.request?.headers),
    responseHeaders: sanitizeNameValuePairs(harEntry?.response?.headers),
    requestCookies: sanitizeNameValuePairs(harEntry?.request?.cookies),
    responseCookies: sanitizeNameValuePairs(harEntry?.response?.cookies),
    redirectURL: harEntry?.response?.redirectURL || undefined,
    initiator: harEntry?._initiator || undefined,
    postData: extractPostData(harEntry?.request?.postData),
    timings: extractTimings(harEntry?.timings),
    contentSize: harEntry?.response?.content?.size,
    bodySize: harEntry?.response?.bodySize,
  };
};

/** Batched so high-frequency network bursts do not cause redundant writes. */
const flush = () => {
  flushTimeout = null;
  chrome.storage.local.set({ [PRE_AUCTION_HAR]: JSON.stringify(entries) });
};

const scheduleFlush = () => {
  if (flushTimeout) return;
  flushTimeout = setTimeout(flush, 300);
};

const record = (harEntry: any) => {
  const entry = toLogEntry(harEntry);
  if (!isRecordableUrl(entry.url)) return;
  entries.push(entry);
  if (entries.length > MAX_ENTRIES) entries = entries.slice(-MAX_ENTRIES);
  scheduleFlush();
};

export const reset = () => {
  entries = [];
  idCounter = 1;
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
