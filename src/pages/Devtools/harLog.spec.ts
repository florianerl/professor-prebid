import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { isRecordableUrl, toLogEntry, collectHarLog, IHarLogEntry } from './harLog';
import { PRE_AUCTION_HAR } from '../Shared/constants';

describe('harLog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    global.chrome = {
      storage: {
        local: {
          set: vi.fn(),
          get: vi.fn(),
        },
      },
      devtools: {
        network: {
          onRequestFinished: {
            addListener: vi.fn(),
          },
        },
      },
      tabs: {
        onUpdated: {
          addListener: vi.fn(),
        },
      },
    } as any;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('isRecordableUrl', () => {
    it('returns true for http and https URLs', () => {
      expect(isRecordableUrl('http://example.com')).toBe(true);
      expect(isRecordableUrl('https://example.com/api/test')).toBe(true);
      expect(isRecordableUrl('HTTPS://EXAMPLE.COM')).toBe(true);
    });

    it('returns false for chrome-extension, data, ws, or empty URLs', () => {
      expect(isRecordableUrl('chrome-extension://abcdef/injected.js')).toBe(false);
      expect(isRecordableUrl('data:text/plain;base64,abc')).toBe(false);
      expect(isRecordableUrl('ws://example.com')).toBe(false);
      expect(isRecordableUrl('')).toBe(false);
      expect(isRecordableUrl(undefined as any)).toBe(false);
    });
  });

  describe('toLogEntry', () => {
    it('converts a standard harEntry to IHarLogEntry', () => {
      const harEntry = {
        request: {
          url: 'https://prebid.example.com/auction?id=1',
          method: 'POST',
        },
        response: {
          status: 200,
        },
        startedDateTime: '2026-08-17T10:00:00.000Z',
        time: 123.456,
        _resourceType: 'fetch',
      };

      const entry = toLogEntry(harEntry);
      expect(entry).toEqual({
        url: 'https://prebid.example.com/auction?id=1',
        host: 'prebid.example.com',
        method: 'POST',
        status: 200,
        startedDateTime: new Date('2026-08-17T10:00:00.000Z').getTime(),
        time: 123.46,
        resourceType: 'fetch',
      });
    });

    it('handles malformed URL and missing fields gracefully', () => {
      const harEntry = {
        request: {
          url: 'invalid-url',
        },
      };

      const entry = toLogEntry(harEntry);
      expect(entry.host).toBe('');
      expect(entry.method).toBe('GET');
      expect(entry.status).toBe(0);
      expect(entry.time).toBe(0);
      expect(entry.startedDateTime).toBe(0);
      expect(entry.resourceType).toBeUndefined();
    });

    it('handles undefined harEntry', () => {
      const entry = toLogEntry(undefined);
      expect(entry).toEqual({
        url: '',
        host: '',
        method: 'GET',
        status: 0,
        startedDateTime: 0,
        time: 0,
        resourceType: undefined,
      });
    });
  });

  describe('collectHarLog', () => {
    it('does nothing if chrome.devtools.network is unavailable', () => {
      global.chrome.devtools = {} as any;
      collectHarLog();
      expect(global.chrome.storage.local.set).not.toHaveBeenCalled();
    });

    it('initializes and records incoming requests when devtools network is available', () => {
      let networkListener: (entry: any) => void = () => {};
      let tabsListener: (tabId: number, info: any) => void = () => {};

      (global.chrome.devtools.network.onRequestFinished.addListener as any).mockImplementation((fn: any) => {
        networkListener = fn;
      });
      (global.chrome.tabs.onUpdated.addListener as any).mockImplementation((fn: any) => {
        tabsListener = fn;
      });

      collectHarLog();

      expect(global.chrome.storage.local.set).toHaveBeenCalledWith({
        [PRE_AUCTION_HAR]: JSON.stringify([]),
      });

      // Send a recordable request
      networkListener({
        request: { url: 'https://example.com/test', method: 'GET' },
        response: { status: 200 },
        startedDateTime: '2026-08-17T10:00:00.000Z',
        time: 50,
      });

      // Should not flush synchronously
      expect(global.chrome.storage.local.set).toHaveBeenCalledTimes(1);

      // Trigger debounce timer
      vi.advanceTimersByTime(500);

      expect(global.chrome.storage.local.set).toHaveBeenCalledTimes(2);
      const saved = JSON.parse(
        (global.chrome.storage.local.set as any).mock.calls[1][0][PRE_AUCTION_HAR]
      );
      expect(saved.length).toBe(1);
      expect(saved[0].url).toBe('https://example.com/test');

      // Send non-recordable URL
      networkListener({
        request: { url: 'chrome-extension://123/script.js' },
      });
      vi.advanceTimersByTime(500);
      expect(global.chrome.storage.local.set).toHaveBeenCalledTimes(2);

      // Test reset on tab loading
      tabsListener(1, { status: 'loading' });
      expect(global.chrome.storage.local.set).toHaveBeenLastCalledWith({
        [PRE_AUCTION_HAR]: JSON.stringify([]),
      });
    });

    it('caps entries at MAX_ENTRIES (2000)', () => {
      let networkListener: (entry: any) => void = () => {};
      (global.chrome.devtools.network.onRequestFinished.addListener as any).mockImplementation((fn: any) => {
        networkListener = fn;
      });

      collectHarLog();

      for (let i = 0; i < 2050; i++) {
        networkListener({
          request: { url: `https://example.com/req_${i}`, method: 'GET' },
          response: { status: 200 },
          startedDateTime: '2026-08-17T10:00:00.000Z',
          time: 10,
        });
      }

      vi.advanceTimersByTime(500);
      const saved = JSON.parse(
        (global.chrome.storage.local.set as any).mock.calls.slice(-1)[0][0][PRE_AUCTION_HAR]
      );
      expect(saved.length).toBe(2000);
      expect(saved[saved.length - 1].url).toBe('https://example.com/req_2049');
    });
  });
});
