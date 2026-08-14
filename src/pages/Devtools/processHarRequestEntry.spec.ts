import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    getInitReqChainByUrl,
    _buildObjectFromHarEntry,
    _populateInitSeqArray,
    _setToInitReqChainObj,
    _setToRedirectValue,
    _findPathsToKey,
    _processHarRequestEntry,
} from './processHarRequestEntry';

// Mock chrome APIs
const mockSet = vi.fn();
const mockRemoveListener = vi.fn();
const mockAddListener = vi.fn();
const mockGetHAR = vi.fn();
const mockTabsAddListener = vi.fn();

global.chrome = {
    storage: {
        local: {
            get: vi.fn(),
            set: mockSet,
        },
    },
    devtools: {
        network: {
            onRequestFinished: {
                addListener: mockAddListener,
                removeListener: mockRemoveListener,
            },
            getHAR: mockGetHAR,
        },
    },
    tabs: {
        onUpdated: { addListener: mockTabsAddListener },
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

        it('handles missing headers and missing queryString', () => {
            const entry = createMockHarEntry({
                request: {
                    url: 'https://example.com/ad.js',
                    headers: [],
                    queryString: null,
                    cookies: [],
                },
            });
            const result = _buildObjectFromHarEntry(entry);
            expect(result.origin).toBe('');
            expect(result.referer).toBe('');
            expect(result.host).toBe('');
            expect(result.queryParameters).toEqual({});
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

    describe('_setToInitReqChainObj', () => {
        it('handles even and odd indices when next items exist', () => {
            const value: any = { fullUrl: 'https://final.com', initiated: [] };
            const target: any = {
                rootKey: {
                    initiated: [
                        { fullUrl: 'https://middle.com', initiated: [] }
                    ]
                }
            };
            // pathArray length = 2: i=0 (even, 'rootKey'), i=1 (odd, 'https://middle.com')
            _setToInitReqChainObj(target, ['rootKey', 'https://middle.com'], value);
            expect(target.rootKey.initiated[0].initiated).toContain(value);
        });

        it('handles odd index when matching item is NOT found', () => {
            const value: any = { fullUrl: 'https://new.com', initiated: [] };
            const target: any = {
                rootKey: {
                    initiated: [] // empty list so find() returns undefined
                }
            };
            _setToInitReqChainObj(target, ['rootKey', 'https://missing.com'], value);
            // In odd branch when not found, value is replaced with { fullUrl: 'https://missing.com', initiated: [value] }
            expect(target.rootKey.initiated).toHaveLength(1);
            expect(target.rootKey.initiated[0].fullUrl).toBe('https://missing.com');
        });

        it('handles non-array obj at the end of loop', () => {
            const value: any = { fullUrl: 'https://leaf.com', initiated: [] };
            const target: any = {
                key: {
                    initiated: []
                }
            };
            // Single item pathArray: i=0 (even, 'key'). obj becomes target.key.initiated (array)
            _setToInitReqChainObj(target, ['key'], value);
            expect(target.key.initiated).toContain(value);
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

        it('finds key in nested arrays and handles brackets in path', async () => {
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

        it('handles non-empty pathToKey', async () => {
            const result = await _findPathsToKey({
                obj: { nested: { target: 123 } },
                key: 'target',
                pathToKey: 'root',
            });
            expect(result).toEqual([['root', 'nested', 'target']]);
        });

        it('rejects on error in findPathsToKey', async () => {
            const throwingObj = {};
            Object.defineProperty(throwingObj, 'boom', {
                get() {
                    throw new Error('Access error');
                },
                enumerable: true,
            });

            await expect(_findPathsToKey({ obj: throwingObj, key: 'test' })).rejects.toEqual({
                error: expect.any(Error),
            });
        });
    });

    describe('_processHarRequestEntry', () => {
        it('updates currentRootUrl if stringified stack contains url in initReqChainObj', async () => {
            const redirectSet = new Set<string>();
            const initReqChainObj: any = {
                'https://matched-root.com': { fullUrl: 'https://matched-root.com', initiated: [] },
                'https://matched-root.com/bundle.js': { fullUrl: 'https://matched-root.com/bundle.js', initiated: [] }
            };

            const harEntry = {
                request: { url: 'https://cdn.com/asset.js', headers: [], queryString: {}, cookies: [], method: 'GET' },
                response: { redirectURL: '' },
                _resourceType: 'script',
                _initiator: {
                    stack: {
                        callFrames: [{ url: 'https://matched-root.com/bundle.js' }]
                    }
                }
            };

            await _processHarRequestEntry(harEntry, initReqChainObj, redirectSet, 'https://old-root.com');
            expect(mockSet).toHaveBeenCalledWith({ initReqChain: expect.any(String) });
        });

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

        it('processes root URL request entry (Case 1: matches currentRootUrl)', async () => {
            const redirectSet = new Set<string>();
            const initReqChainObj: any = {};

            const harEntry = {
                request: {
                    url: 'https://root.com/page',
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

            await _processHarRequestEntry(harEntry, initReqChainObj, redirectSet, 'https://root.com');
            // setRootUrlToInitReqChainObj uses the module-level currentRootUrl variable
            expect(mockSet).toHaveBeenCalled();
        });

        it('processes initiator stack and initiator url when not a redirect (Case 2)', async () => {
            const redirectSet = new Set<string>();
            const initReqChainObj: any = {
                'https://root.com': { fullUrl: 'https://root.com', initiated: [] },
                'https://root.com/index.html': { fullUrl: 'https://root.com/index.html', initiated: [] }
            };

            const harEntry = {
                request: {
                    url: 'https://example.com/ad.js',
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
                _initiator: {
                    url: 'https://root.com/index.html',
                    stack: {
                        callFrames: [{ url: 'https://root.com/index.html' }]
                    }
                },
                _resourceType: 'script',
                startedDateTime: '2024-01-01T00:00:00.000Z',
                time: 10,
                timings: {},
            };

            await _processHarRequestEntry(harEntry, initReqChainObj, redirectSet, 'https://root.com');
            expect(initReqChainObj['https://example.com/ad.js']).toBeDefined();
            expect(initReqChainObj['https://root.com/index.html'].initiated).toHaveLength(2);
            expect(mockSet).toHaveBeenCalledWith({ initReqChain: JSON.stringify(initReqChainObj) });
        });

        it('handles redirects when harEntryRequestUrl is in redirectSet', async () => {
            const redirectSet = new Set<string>(['https://redirected.com/ad.js']);
            const initReqChainObj: any = {
                'https://redirected.com/ad.js': {}
            };

            const harEntry = {
                request: {
                    url: 'https://redirected.com/ad.js',
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
                _initiator: {
                    url: 'https://root.com/index.html',
                },
                _resourceType: 'script',
                startedDateTime: '2024-01-01T00:00:00.000Z',
                time: 10,
                timings: {},
            };

            await _processHarRequestEntry(harEntry, initReqChainObj, redirectSet, 'https://root.com');
            expect(redirectSet.has('https://redirected.com/ad.js')).toBe(false);
        });

        it('handles default case when entry does not match root or initiator', async () => {
            const redirectSet = new Set<string>();
            const initReqChainObj: any = {};

            const harEntry = {
                request: {
                    url: 'https://unrelated.com/image.png',
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
                _initiator: {
                    url: 'https://other.com',
                },
                _resourceType: 'image',
                startedDateTime: '2024-01-01T00:00:00.000Z',
                time: 10,
                timings: {},
            };

            await _processHarRequestEntry(harEntry, initReqChainObj, redirectSet, 'https://root.com');
            expect(mockSet).not.toHaveBeenCalled();
        });
    });

    describe('getInitReqChainByUrl', () => {
        it('starts HAR listening and handles processHarRequests when storage is not null', async () => {
            let getHARCallback: Function = () => {};
            mockGetHAR.mockImplementation((cb) => {
                getHARCallback = cb;
            });

            const reqChain = getInitReqChainByUrl('https://example.com', 'document', 'GET');
            expect(reqChain).toEqual({});
            expect(mockGetHAR).toHaveBeenCalled();

            getHARCallback();
            expect(mockAddListener).toHaveBeenCalled();
            expect(mockTabsAddListener).toHaveBeenCalled();

            const harRequestHandler = mockAddListener.mock.calls[0][0];
            const harEntry = {
                request: { url: 'https://example.com', method: 'GET', headers: [] },
                response: { redirectURL: '' },
                _initiator: {},
                _resourceType: 'document',
            };

            (global.chrome.storage.local.get as any).mockImplementation((key: string, cb: Function) => {
                cb({ initReqChain: '{"existing": 1}' });
            });

            await harRequestHandler(harEntry);
            expect(global.chrome.storage.local.get).toHaveBeenCalledWith('initReqChain', expect.any(Function));
        });

        it('handles processHarRequests when storage is "null"', async () => {
            let getHARCallback: Function = () => {};
            mockGetHAR.mockImplementation((cb) => {
                getHARCallback = cb;
            });

            getInitReqChainByUrl('https://example.com', 'document', 'GET');
            getHARCallback();

            const harRequestHandler = mockAddListener.mock.calls[0][0];

            (global.chrome.storage.local.get as any).mockImplementation((key: string, cb: Function) => {
                cb({ initReqChain: 'null' });
            });

            await harRequestHandler({});
            expect(mockRemoveListener).toHaveBeenCalledWith(harRequestHandler);
        });

        it('handles chrome.tabs.onUpdated listener status loading and complete', () => {
            let getHARCallback: Function = () => {};
            mockGetHAR.mockImplementation((cb) => {
                getHARCallback = cb;
            });

            getInitReqChainByUrl('https://example.com', 'document', 'GET');
            getHARCallback();

            const tabsUpdatedHandler = mockTabsAddListener.mock.calls[0][0];

            // Status = loading
            tabsUpdatedHandler(123, { status: 'loading' });
            expect(mockSet).toHaveBeenCalledWith({ initReqChain: JSON.stringify({}) });

            // Status = complete (no-op)
            mockSet.mockClear();
            tabsUpdatedHandler(123, { status: 'complete' });
            expect(mockSet).not.toHaveBeenCalled();
        });

        it('handles missing chrome.tabs gracefully', () => {
            const originalTabs = global.chrome.tabs;
            (global.chrome as any).tabs = undefined;

            let getHARCallback: Function = () => {};
            mockGetHAR.mockImplementation((cb) => {
                getHARCallback = cb;
            });

            expect(() => {
                getInitReqChainByUrl('https://example.com', 'document', 'GET');
                getHARCallback();
            }).not.toThrow();

            (global.chrome as any).tabs = originalTabs;
        });
    });
});
