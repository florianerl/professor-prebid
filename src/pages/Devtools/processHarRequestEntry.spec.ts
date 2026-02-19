import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    _buildObjectFromHarEntry,
    _populateInitSeqArray,
    _setToRedirectValue,
    _findPathsToKey,
    _processHarRequestEntry,
} from './processHarRequestEntry';

// Mock chrome APIs
const mockSet = vi.fn();
global.chrome = {
    storage: {
        local: {
            get: vi.fn(),
            set: mockSet,
        },
    },
    devtools: {
        network: {
            onRequestFinished: { addListener: vi.fn() },
            getHAR: vi.fn(),
        },
    },
    tabs: {
        onUpdated: { addListener: vi.fn() },
    },
} as any;

describe('processHarRequestEntry helpers', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('_buildObjectFromHarEntry', () => {
        const createMockHarEntry = (overrides = {}) => ({
            request: {
                url: 'https://example.com/ad.js',
                headers: [
                    { name: 'Origin', value: 'https://example.com' },
                    { name: 'Referer', value: 'https://example.com/page' },
                    { name: 'Host', value: 'example.com' },
                ],
                queryString: [{ name: 'q', value: '1' }],
                cookies: [],
                postData: null,
            },
            response: {
                redirectURL: '',
                cookies: [],
                headers: [{ name: 'Content-Type', value: 'text/javascript' }],
            },
            startedDateTime: '2024-01-01T00:00:00.000Z',
            time: 50,
            timings: { blocked: 0, dns: 1, ssl: 2, connect: 3, send: 4, wait: 5, receive: 6 },
            ...overrides,
        });

        it('extracts fullUrl from request', () => {
            const result = _buildObjectFromHarEntry(createMockHarEntry());
            expect(result.fullUrl).toBe('https://example.com/ad.js');
        });

        it('extracts origin header', () => {
            const result = _buildObjectFromHarEntry(createMockHarEntry());
            expect(result.origin).toBe('https://example.com');
        });

        it('extracts referer header', () => {
            const result = _buildObjectFromHarEntry(createMockHarEntry());
            expect(result.referer).toBe('https://example.com/page');
        });

        it('extracts host header', () => {
            const result = _buildObjectFromHarEntry(createMockHarEntry());
            expect(result.host).toBe('example.com');
        });

        it('handles missing origin header', () => {
            const entry = createMockHarEntry({
                request: {
                    url: 'https://example.com/ad.js',
                    headers: [],
                    queryString: {},
                    cookies: [],
                },
            });
            const result = _buildObjectFromHarEntry(entry);
            expect(result.origin).toBe('');
        });

        it('populates redirectsTo on redirect', () => {
            const entry = createMockHarEntry({
                response: {
                    redirectURL: 'https://cdn.example.com/ad.js',
                    cookies: [],
                    headers: [],
                },
            });
            const result = _buildObjectFromHarEntry(entry);
            expect(result.redirectsTo).toEqual({ 'https://cdn.example.com/ad.js': {} });
        });

        it('sets redirectsTo to empty object when no redirect', () => {
            const result = _buildObjectFromHarEntry(createMockHarEntry());
            expect(result.redirectsTo).toEqual({});
        });

        it('initializes empty initiated array', () => {
            const result = _buildObjectFromHarEntry(createMockHarEntry());
            expect(result.initiated).toEqual([]);
        });

        it('extracts queryParameters', () => {
            const result = _buildObjectFromHarEntry(createMockHarEntry());
            expect(result.queryParameters).toEqual([{ name: 'q', value: '1' }]);
        });

        it('extracts timings', () => {
            const result = _buildObjectFromHarEntry(createMockHarEntry());
            expect(result.timings).toEqual(expect.objectContaining({ blocked: 0, dns: 1 }));
        });

        it('extracts time', () => {
            const result = _buildObjectFromHarEntry(createMockHarEntry());
            expect(result.time).toBe(50);
        });

        it('handles postData', () => {
            const entry = createMockHarEntry({
                request: {
                    url: 'https://example.com/post',
                    headers: [],
                    queryString: {},
                    cookies: [],
                    postData: { text: 'body=data' },
                },
            });
            const result = _buildObjectFromHarEntry(entry);
            expect(result.postData).toEqual({ text: 'body=data' });
        });
    });

    describe('_populateInitSeqArray', () => {
        it('pushes deep value into array', () => {
            const obj = { a: { b: 'value' } };
            const arr: string[] = [];
            _populateInitSeqArray(obj, ['a', 'b'], arr);
            expect(arr).toEqual(['value']);
        });

        it('pushes top-level value', () => {
            const obj = { x: 42 };
            const arr: string[] = [];
            _populateInitSeqArray(obj, ['x'], arr);
            expect(arr).toEqual([42]);
        });
    });

    describe('_setToRedirectValue', () => {
        it('sets value at path in object', () => {
            const obj: any = { a: { b: {} } };
            const value = { fullUrl: 'https://cdn.com/script.js', initiated: [] };
            _setToRedirectValue(obj, value, ['a', 'b']);
            expect(obj.a.b).toEqual(value);
        });

        it('sets value at single-depth path', () => {
            const obj: any = { key: {} };
            const value = { fullUrl: 'https://example.com', initiated: [] };
            _setToRedirectValue(obj, value, ['key']);
            expect(obj.key).toEqual(value);
        });
    });

    describe('_findPathsToKey', () => {
        it('finds direct key', async () => {
            const result = await _findPathsToKey({
                obj: { myKey: 'value', other: 'data' },
                key: 'myKey',
            });
            expect(result).toEqual([['myKey']]);
        });

        it('finds nested key', async () => {
            const result = await _findPathsToKey({
                obj: { outer: { myKey: 'value' } },
                key: 'myKey',
            });
            expect(result).toHaveLength(1);
        });

        it('returns empty array when key not found', async () => {
            const result = await _findPathsToKey({
                obj: { a: 1, b: 2 },
                key: 'missing',
            });
            expect(result).toEqual([]);
        });

        it('finds key in nested arrays', async () => {
            const result = await _findPathsToKey({
                obj: {
                    items: [
                        { url: 'https://a.com' },
                        { url: 'https://b.com' },
                    ],
                },
                key: 'url',
            });
            expect((result as any[]).length).toBe(2);
        });
    });

    describe('_processHarRequestEntry', () => {
        it('adds redirect URL to redirectSet', async () => {
            const redirectSet = new Set<string>();
            const initReqChainObj: any = {
                'https://root.com': { fullUrl: 'https://root.com', initiated: [] },
            };

            const harEntry = {
                request: {
                    url: 'https://root.com/script.js',
                    headers: [],
                    queryString: {},
                    cookies: [],
                    method: 'GET',
                },
                response: {
                    redirectURL: 'https://cdn.com/script.js',
                    cookies: [],
                    headers: [],
                },
                _initiator: { url: 'https://root.com' },
                _resourceType: 'script',
                startedDateTime: '2024-01-01T00:00:00.000Z',
                time: 10,
                timings: {},
            };

            await _processHarRequestEntry(harEntry, initReqChainObj, redirectSet, 'https://root.com');
            expect(redirectSet.has('https://cdn.com/script.js')).toBe(true);
        });

        it('handles entry with no initiator stack', async () => {
            const redirectSet = new Set<string>();
            const initReqChainObj: any = {};

            const harEntry = {
                request: {
                    url: 'https://example.com/page',
                    headers: [],
                    queryString: {},
                    cookies: [],
                    method: 'GET',
                },
                response: {
                    redirectURL: '',
                    cookies: [],
                    headers: [],
                },
                _initiator: {},
                _resourceType: 'document',
                startedDateTime: '2024-01-01T00:00:00.000Z',
                time: 10,
                timings: {},
            };

            // Should not throw
            await _processHarRequestEntry(harEntry, initReqChainObj, redirectSet, 'https://example.com');
        });
    });
});

describe('Devtools index', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        global.chrome = {
            devtools: {
                panels: { create: vi.fn() },
                network: {
                    onRequestFinished: { addListener: vi.fn() },
                    getHAR: vi.fn(),
                },
            },
            storage: {
                local: {
                    get: vi.fn(),
                    set: vi.fn(),
                },
            },
            tabs: {
                onUpdated: { addListener: vi.fn() },
            },
        } as any;
    });

    it('creates devtools panel on import', async () => {
        // Mock storage.local.get to call callback with no initiator state
        (global.chrome.storage.local.get as any).mockImplementation((key: string, cb: Function) => {
            cb({});
        });

        await import('./index');

        expect(global.chrome.devtools.panels.create).toHaveBeenCalledWith(
            'Professor Prebid',
            'icon-34.png',
            'panel.html',
            expect.any(Function)
        );
    });
});
