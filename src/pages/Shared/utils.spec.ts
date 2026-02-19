import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { decycle, getTabId, conditionalPluralization, detectIframe, generateUniqueId } from './utils';

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
            // Circular reference should be removed or handled (implementation dependent, currently drops it)
            expect(result.self).toBeUndefined();
        });

        it('removes DOM elements (location/document)', () => {
            const obj = {
                a: 1,
                // Mocking a DOM-like object with 'location' property as per implementation check
                dom: { location: 'some-location' }
            };
            const result = JSON.parse(decycle(obj));
            expect(result.a).toBe(1);
            expect(result.dom).toBeUndefined();
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
    });

    describe('detectIframe', () => {
        it('returns false when window.self === window.top', () => {
            // JSDOM default is top
            expect(detectIframe()).toBe(false);
        });

        // Hard to test true case in JSDOM without iframe setup, 
        // but we can rely on default behavior or mock window properties if configurable.
    });

    describe('generateUniqueId', () => {
        it('returns unique strings', () => {
            const id1 = generateUniqueId();
            const id2 = generateUniqueId();
            expect(id1).not.toBe(id2);
            expect(typeof id1).toBe('string');
        });
    });

    describe('getTabId', () => {
        beforeEach(() => {
            vi.clearAllMocks();
            global.chrome = {
                devtools: {
                    inspectedWindow: {
                        tabId: undefined
                    }
                },
                tabs: {
                    query: vi.fn()
                }
            } as any;
        });

        it('returns devtools tabId if available', async () => {
            global.chrome.devtools.inspectedWindow.tabId = 123;
            const id = await getTabId();
            expect(id).toBe(123);
        });

        it('queries tabs if devtools ID missing', async () => {
            global.chrome.devtools.inspectedWindow.tabId = undefined;
            (global.chrome.tabs.query as any).mockImplementation((_query, cb) => {
                cb([{ id: 456 }]);
            });

            const id = await getTabId();
            expect(id).toBe(456);
            expect(global.chrome.tabs.query).toHaveBeenCalledWith({ active: true, currentWindow: true }, expect.any(Function));
        });
    });
});
