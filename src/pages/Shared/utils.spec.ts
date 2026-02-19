import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
    decycle, getTabId, conditionalPluralization, detectIframe, generateUniqueId,
    createRangeArray, getMinAndMaxNumber, sendWindowPostMessage, sendChromeTabsMessage,
    reloadPage, download
} from './utils';

describe('Shared Utils', () => {
    describe('decycle', () => {
        it('handles simple objects', () => {
            const obj = { a: 1, b: 'test' };
            const result = JSON.parse(decycle(obj));
            expect(result).toEqual(obj);
        });

        it('handles circular references', () => {
            const obj: any = { a: 1 };
            obj.self = obj;
            const result = JSON.parse(decycle(obj));
            expect(result.a).toBe(1);
            expect(result.self).toBeUndefined();
        });

        it('removes DOM elements (location/document)', () => {
            const obj = { a: 1, dom: { location: 'some-location' } };
            const result = JSON.parse(decycle(obj));
            expect(result.a).toBe(1);
            expect(result.dom).toBeUndefined();
        });

        it('handles nested objects', () => {
            const obj = { a: { b: { c: 42 } } };
            const result = JSON.parse(decycle(obj));
            expect(result.a.b.c).toBe(42);
        });

        it('handles arrays', () => {
            const obj = { items: [1, 2, 3] };
            const result = JSON.parse(decycle(obj));
            expect(result.items).toEqual([1, 2, 3]);
        });

        it('handles null values', () => {
            const obj = { a: null, b: 1 };
            const result = JSON.parse(decycle(obj));
            expect(result.a).toBeNull();
            expect(result.b).toBe(1);
        });
    });

    describe('conditionalPluralization', () => {
        it('returns empty string for empty array', () => {
            expect(conditionalPluralization([])).toBe('');
        });
        it('returns empty string for single item', () => {
            expect(conditionalPluralization([1])).toBe('');
        });
        it('returns "s" for multiple items', () => {
            expect(conditionalPluralization([1, 2])).toBe('s');
        });
        it('returns "s" for 3+ items', () => {
            expect(conditionalPluralization([1, 2, 3])).toBe('s');
        });
    });

    describe('detectIframe', () => {
        it('returns false when window.self === window.top', () => {
            expect(detectIframe()).toBe(false);
        });
    });

    describe('generateUniqueId', () => {
        it('returns unique strings', () => {
            const id1 = generateUniqueId();
            const id2 = generateUniqueId();
            expect(id1).not.toBe(id2);
            expect(typeof id1).toBe('string');
        });
        it('contains a dash separator', () => {
            expect(generateUniqueId()).toContain('-');
        });
    });

    describe('createRangeArray', () => {
        it('creates a range from 0 to 10 with step 2', () => {
            const result = createRangeArray(0, 10, 2, 0);
            expect(result).toContain(0);
            expect(result).toContain(2);
            expect(result).toContain(4);
            expect(result).toContain(6);
            expect(result).toContain(8);
            expect(result).toContain(10);
        });

        it('includes end value even if not on step boundary', () => {
            const result = createRangeArray(0, 5, 3, 0);
            expect(result).toContain(5);
        });

        it('returns correct number of elements', () => {
            const result = createRangeArray(0, 10, 3, 0);
            expect(result).toContain(0);
            expect(result).toContain(3);
            expect(result).toContain(6);
            expect(result).toContain(9);
            expect(result).toContain(10);
        });
    });

    describe('getMinAndMaxNumber', () => {
        it('returns min and max of array', () => {
            const result = getMinAndMaxNumber([5, 2, 8, 1, 9]);
            expect(result.min).toBe(1);
            expect(result.max).toBe(9);
        });

        it('handles single element', () => {
            const result = getMinAndMaxNumber([42]);
            expect(result.min).toBe(42);
            expect(result.max).toBe(42);
        });

        it('returns 0,0 for empty array', () => {
            const result = getMinAndMaxNumber([]);
            expect(result.min).toBe(0);
            expect(result.max).toBe(0);
        });
    });

    describe('getTabId', () => {
        beforeEach(() => {
            vi.clearAllMocks();
            global.chrome = {
                devtools: { inspectedWindow: { tabId: undefined } },
                tabs: { query: vi.fn() }
            } as any;
        });

        it('returns devtools tabId if available', async () => {
            global.chrome.devtools.inspectedWindow.tabId = 123;
            const id = await getTabId();
            expect(id).toBe(123);
        });

        it('queries tabs if devtools ID missing', async () => {
            global.chrome.devtools.inspectedWindow.tabId = undefined;
            (global.chrome.tabs.query as any).mockImplementation((_query: any, cb: any) => {
                cb([{ id: 456 }]);
            });
            const id = await getTabId();
            expect(id).toBe(456);
        });
    });

    describe('sendWindowPostMessage', () => {
        it('posts message to window.top', () => {
            const mockPostMessage = vi.fn();
            const originalTop = window.top;
            Object.defineProperty(window, 'top', { value: { postMessage: mockPostMessage }, writable: true, configurable: true });
            // Mock querySelectorAll to return empty
            vi.spyOn(document, 'querySelectorAll').mockReturnValue([] as any);

            sendWindowPostMessage('TEST_EVENT', { data: 1 });

            expect(mockPostMessage).toHaveBeenCalledWith(
                { profPrebid: true, type: 'TEST_EVENT', payload: { data: 1 } },
                '*'
            );

            Object.defineProperty(window, 'top', { value: originalTop, writable: true, configurable: true });
        });
    });

    describe('sendChromeTabsMessage', () => {
        it('sends message to active tab', async () => {
            const mockSendMessage = vi.fn();
            global.chrome = {
                devtools: { inspectedWindow: { tabId: 42 } },
                tabs: { sendMessage: mockSendMessage, query: vi.fn() }
            } as any;

            await sendChromeTabsMessage('MY_TYPE', { key: 'val' });
            expect(mockSendMessage).toHaveBeenCalledWith(42, { type: 'MY_TYPE', payload: { key: 'val' } });
        });
    });

    describe('reloadPage', () => {
        it('reloads the active tab', async () => {
            const mockReload = vi.fn();
            global.chrome = {
                devtools: { inspectedWindow: { tabId: 10 } },
                tabs: { reload: mockReload, query: vi.fn() }
            } as any;

            await reloadPage();
            expect(mockReload).toHaveBeenCalledWith(10);
        });
    });

    describe('download', () => {
        it('creates and clicks a download link', () => {
            const mockClick = vi.fn();
            const mockSetAttribute = vi.fn();
            vi.spyOn(document, 'createElement').mockReturnValue({
                setAttribute: mockSetAttribute,
                click: mockClick,
            } as any);

            download({ test: true }, 'myfile');

            expect(mockSetAttribute).toHaveBeenCalledWith('href', expect.stringContaining('data:application/json'));
            expect(mockSetAttribute).toHaveBeenCalledWith('download', expect.stringContaining('myfile'));
            expect(mockClick).toHaveBeenCalled();
        });
    });
});

