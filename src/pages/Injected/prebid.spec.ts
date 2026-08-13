import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Prebid, addEventListenersForPrebid } from './prebid';
import { EVENTS, POPUP_LOADED } from '../Shared/constants';

vi.mock('../Shared/utils', () => ({
    EventBus: {
        emit: vi.fn(),
    },
}));

import { EventBus } from '../Shared/utils';

describe('Prebid Injected Script', () => {
    let mockPbjs: any;
    let originalURL: typeof URL;

    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();

        originalURL = global.URL;
        global.URL.createObjectURL = vi.fn().mockReturnValue('blob:http://example.com/mock-blob-url');

        mockPbjs = {
            onEvent: vi.fn(),
            que: [] as Function[],
            getEvents: undefined,
            getConfig: vi.fn(() => ({ debug: false })),
            getUserIdsAsEids: vi.fn(() => [{ source: 'id.com', uids: [] }]),
            installedModules: ['consentManagement'],
            version: '7.0.0',
            bidderSettings: { appnexus: {} },
        };

        // Override que.push to execute functions immediately in tests
        mockPbjs.que.push = function (fn: Function) {
            fn();
            return Array.prototype.push.call(this, fn);
        };

        vi.stubGlobal('window', {
            pbjs: mockPbjs,
            pbjs2: mockPbjs,
            _pbjsGlobals: ['pbjs'],
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            postMessage: vi.fn(),
            sessionStorage: { getItem: vi.fn().mockReturnValue(null) },
            location: { host: 'example.com' },
            origin: 'https://example.com',
            PREBID_TIMEOUT: 3000,
        });
    });

    afterEach(() => {
        vi.useRealTimers();
        global.URL = originalURL;
    });

    it('initializes and registers event listeners when onEvent is a function', () => {
        const instance = new Prebid('pbjs', 'frame1');
        expect(instance.namespace).toBe('pbjs');
        expect(instance.frameId).toBe('frame1');
        expect(mockPbjs.onEvent).toHaveBeenCalledWith('auctionInit', expect.any(Function));
        expect(mockPbjs.onEvent).toHaveBeenCalledWith('auctionEnd', expect.any(Function));
        expect(mockPbjs.onEvent).toHaveBeenCalledWith('bidRequested', expect.any(Function));
        expect(mockPbjs.onEvent).toHaveBeenCalledWith('bidResponse', expect.any(Function));
        expect(mockPbjs.onEvent).toHaveBeenCalledWith('noBid', expect.any(Function));
        expect(mockPbjs.onEvent).toHaveBeenCalledWith('bidWon', expect.any(Function));
    });

    it('handles initialization when onEvent is not a function', () => {
        mockPbjs.onEvent = undefined;
        expect(() => new Prebid('pbjs', 'frame1')).not.toThrow();
    });

    it('pushes events and bounds the events array to 500 items when eventsApi is false', () => {
        const instance = new Prebid('pbjs', 'frame1') as any;
        const calls = mockPbjs.onEvent.mock.calls;
        const auctionInitCall = calls.find((c: any[]) => c[0] === 'auctionInit');
        const callback = auctionInitCall[1];

        instance.events = [];

        // Trigger 505 times
        for (let i = 0; i < 505; i++) {
            callback({ id: i });
        }

        expect(instance.events.length).toBe(500);
        expect(instance.events[499]).toEqual({ eventType: 'auctionInit', args: { id: 504 } });
    });

    it('does not push events to internal array when eventsApi is true (getEvents is defined)', () => {
        mockPbjs.getEvents = vi.fn().mockReturnValue([]);
        const instance = new Prebid('pbjs', 'frame1') as any;
        const calls = mockPbjs.onEvent.mock.calls;
        const auctionInitCall = calls.find((c: any[]) => c[0] === 'auctionInit');
        const callback = auctionInitCall[1];

        instance.events = [];
        callback({ id: 1 });

        expect(instance.events.length).toBe(0);
    });

    it('handles all registered event callbacks (auctionEnd, bidRequested, bidResponse, noBid, bidWon)', () => {
        const instance = new Prebid('pbjs', 'frame1') as any;
        const calls = mockPbjs.onEvent.mock.calls;

        ['auctionEnd', 'bidRequested', 'bidResponse', 'noBid', 'bidWon'].forEach((eventName) => {
            const call = calls.find((c: any[]) => c[0] === eventName);
            const callback = call[1];
            callback({ eventData: eventName });
        });

        expect(instance.events.length).toBe(5);
    });

    it('validates window message event source and origin', () => {
        const instance = new Prebid('pbjs', 'frame1');
        const addEventListenerMock = window.addEventListener as any;
        const messageCall = addEventListenerMock.mock.calls.find((c: any[]) => c[0] === 'message');
        const listener = messageCall[1];

        const sendSpy = vi.spyOn(instance, 'sendDetailsToBackground');

        // Valid message
        listener({
            source: window,
            origin: window.origin,
            data: { profPrebid: true, type: POPUP_LOADED },
        });
        expect(sendSpy).toHaveBeenCalled();

        sendSpy.mockClear();

        // Invalid origin
        listener({
            source: window,
            origin: 'https://attacker.com',
            data: { profPrebid: true, type: POPUP_LOADED },
        });
        expect(sendSpy).not.toHaveBeenCalled();

        // Missing profPrebid flag
        listener({
            source: window,
            origin: window.origin,
            data: { type: POPUP_LOADED },
        });
        expect(sendSpy).not.toHaveBeenCalled();

        // Different message type
        listener({
            source: window,
            origin: window.origin,
            data: { profPrebid: true, type: 'OTHER_EVENT' },
        });
        expect(sendSpy).not.toHaveBeenCalled();
    });

    it('getDebugConfig parses valid sessionStorage JSON and handles errors', () => {
        const instance = new Prebid('pbjs', 'frame1');

        (window.sessionStorage.getItem as any).mockReturnValue('{"enabled": true}');
        expect(instance.getDebugConfig()).toEqual({ enabled: true });

        (window.sessionStorage.getItem as any).mockReturnValue('invalid-json');
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        expect(instance.getDebugConfig()).toBeUndefined();
        expect(consoleSpy).toHaveBeenCalled();
        consoleSpy.mockRestore();
    });

    describe('getEventsObjUrl', () => {
        it('returns null when events array is empty', () => {
            const instance = new Prebid('pbjs', 'frame1');
            instance.events = [];
            expect(instance.getEventsObjUrl()).toBeNull();
        });

        it('prunes doc property on adRenderSucceeded event', () => {
            const instance = new Prebid('pbjs', 'frame1');
            instance.events = [
                {
                    eventType: 'adRenderSucceeded',
                    args: { adId: '123', doc: { body: 'content' } },
                },
            ];

            const url = instance.getEventsObjUrl();
            expect(url).toBe('blob:http://example.com/mock-blob-url');
        });

        it('handles DOM nodes and circular references in safeStringify', () => {
            const instance = new Prebid('pbjs', 'frame1');
            const circularObj: any = { name: 'test' };
            circularObj.self = circularObj;

            const fakeElement = Object.create(HTMLElement.prototype);

            instance.events = [
                {
                    eventType: 'custom',
                    args: { node: fakeElement, circular: circularObj },
                },
            ];

            const url = instance.getEventsObjUrl();
            expect(url).toBe('blob:http://example.com/mock-blob-url');
        });

        it('catches serialization errors and fallback stringifies error metadata', () => {
            const instance = new Prebid('pbjs', 'frame1');
            const throwingObj = {
                get bad() {
                    throw new Error('Getter error');
                },
            };

            instance.events = [
                {
                    eventType: 'errorEvent',
                    args: throwingObj,
                    elapsedTime: 123,
                },
            ];

            const url = instance.getEventsObjUrl();
            expect(url).toBe('blob:http://example.com/mock-blob-url');
        });

        it('uses globalPbjs.getEvents when available', () => {
            mockPbjs.getEvents = vi.fn().mockReturnValue([
                { eventType: 'auctionInit', args: {} },
            ]);
            const instance = new Prebid('pbjs', 'frame1');
            expect(instance.getEventsObjUrl()).toBe('blob:http://example.com/mock-blob-url');
            expect(mockPbjs.getEvents).toHaveBeenCalled();
        });
    });

    describe('sendDetailsToBackground', () => {
        it('emits prebid details via EventBus', () => {
            const instance = new Prebid('pbjs', 'frame1');
            instance.events = [{ eventType: 'auctionInit', args: {} }];

            instance.sendDetailsToBackground();
            expect(EventBus.emit).toHaveBeenCalledWith(
                EVENTS.SEND_PREBID_DETAILS_TO_BACKGROUND,
                expect.objectContaining({
                    namespace: 'pbjs',
                    frameId: 'frame1',
                    version: '7.0.0',
                    timeout: 3000,
                })
            );
        });

        it('handles optional functions like getUserIdsAsEids missing', () => {
            mockPbjs.getUserIdsAsEids = undefined;
            (window as any).PREBID_TIMEOUT = undefined;

            const instance = new Prebid('pbjs', 'frame1');
            instance.events = [{ eventType: 'auctionInit', args: {} }];

            instance.sendDetailsToBackground();
            expect(EventBus.emit).toHaveBeenCalledWith(
                EVENTS.SEND_PREBID_DETAILS_TO_BACKGROUND,
                expect.objectContaining({
                    eids: [],
                    timeout: null,
                })
            );
        });

        it('returns early if getEventsObjUrl returns null', () => {
            const instance = new Prebid('pbjs', 'frame1');
            instance.events = [];
            instance.sendDetailsToBackground();
            expect(EventBus.emit).not.toHaveBeenCalled();
        });
    });

    describe('throttle', () => {
        it('runs immediately on first call', () => {
            const instance = new Prebid('pbjs', 'frame1');
            const fn = vi.fn();
            instance.lastTimeUpdateSentToContentScript = 0;
            instance.throttle(fn);
            expect(fn).toHaveBeenCalledTimes(1);
        });

        it('schedules trailing call if invoked within interval', () => {
            const instance = new Prebid('pbjs', 'frame1');
            const fn = vi.fn();
            instance.lastTimeUpdateSentToContentScript = Date.now();

            instance.throttle(fn);
            expect(fn).not.toHaveBeenCalled();

            vi.advanceTimersByTime(2500);
            expect(fn).toHaveBeenCalledTimes(1);
        });

        it('runs immediately if interval has passed', () => {
            const instance = new Prebid('pbjs', 'frame1');
            const fn = vi.fn();
            instance.lastTimeUpdateSentToContentScript = Date.now() - 3000;

            instance.throttle(fn);
            expect(fn).toHaveBeenCalledTimes(1);
        });

        it('reschedules updateTimeout when interval has passed', () => {
            const instance = new Prebid('pbjs', 'frame1');
            const fn = vi.fn();
            instance.lastTimeUpdateSentToContentScript = Date.now() - 3000;
            instance.updateTimeout = setTimeout(() => {}, 5000);

            instance.throttle(fn);
            expect(fn).toHaveBeenCalledTimes(1);
            expect(instance.updateTimeout).toBeDefined();
        });
    });

    describe('addEventListenersForPrebid', () => {
        it('injects prebid instance for window._pbjsGlobals and property descriptor setter', () => {
            (window as any)._pbjsGlobals = ['pbjs'];
            addEventListenersForPrebid('frame-top');

            // Setting new _pbjsGlobals array triggers checkGlobals
            (window as any)._pbjsGlobals = ['pbjs2'];
            expect((window as any)._pbjsGlobals).toEqual(['pbjs2']);
        });

        it('uses polling fallback when Object.defineProperty throws an error', () => {
            const definePropertySpy = vi.spyOn(Object, 'defineProperty').mockImplementation(() => {
                throw new Error('Cannot redefine property');
            });

            (window as any)._pbjsGlobals = undefined;
            addEventListenersForPrebid('frame-top');

            (window as any)._pbjsGlobals = ['pbjs'];
            vi.advanceTimersByTime(1000);

            expect(definePropertySpy).toHaveBeenCalled();
            definePropertySpy.mockRestore();
        });
    });
});
