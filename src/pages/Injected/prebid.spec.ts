
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Prebid } from './prebid';
import { EVENTS, POPUP_LOADED } from '../Shared/constants';

// Mock window.pbjs and other globals
const mockPbjs = {
    onEvent: vi.fn(),
    que: [],
    getEvents: undefined,
    getConfig: vi.fn(() => ({})),
    getUserIdsAsEids: vi.fn(() => []),
    installedModules: [],
    version: '1.0.0',
    bidderSettings: {},
};

vi.stubGlobal('window', {
    pbjs: mockPbjs as any,
    _pbjsGlobals: ['pbjs'],
    addEventListener: vi.fn(),
    postMessage: vi.fn(),
    sessionStorage: { getItem: vi.fn() },
    location: { host: 'example.com' },
    origin: 'https://example.com',
});

// Mock debounce/throttle via fake timers? 
// Or just let it run. Prebid class uses a custom throttle.

describe('Prebid Injected Script', () => {
    let prebidInstance: Prebid;

    beforeEach(() => {
        vi.clearAllMocks();
        window.pbjs = mockPbjs;
        // Reset events array if possible, but it's private. 
        // We instantiate a new class each time.
        prebidInstance = new Prebid('pbjs', 'frame1');
    });

    it('initializes and registers event listeners', () => {
        expect(mockPbjs.onEvent).toHaveBeenCalledWith('auctionInit', expect.any(Function));
        expect(mockPbjs.onEvent).toHaveBeenCalledWith('bidWon', expect.any(Function));
    });

    it('bounds the events array to 500 items', () => {
        // Access private events array strictly for testing or expose a getter
        // Since we can't easily access private 'events', we might need to cast to any
        const instance = prebidInstance as any;

        // Fill array
        for (let i = 0; i < 505; i++) {
            instance.events.push({ eventType: 'mock', args: {} });
        }

        // Trigger the logic that bounds it. 
        // Wait, the bounding logic is inside the event handler callback!
        // We need to trigger the *callback* passed to onEvent.

        // Capture the callback for 'auctionInit'
        const calls = (mockPbjs.onEvent as any).mock.calls;
        const auctionInitCall = calls.find((c: any[]) => c[0] === 'auctionInit');
        const callback = auctionInitCall[1];

        // Reset events to empty to test the push logic properly
        instance.events = [];

        // Trigger 505 times
        for (let i = 0; i < 505; i++) {
            callback({ some: 'data' });
        }

        expect(instance.events.length).toBe(500);
        // Should have shifted, so the last item should be the 505th
        // But we passed identical data.
    });

    it('validates origin on window message', () => {
        // We need to find the message listener
        const addEventListenerMock = window.addEventListener as any;
        const messageCall = addEventListenerMock.mock.calls.find((c: any[]) => c[0] === 'message');
        const listener = messageCall[1];

        const validEvent = {
            source: window,
            origin: window.origin,
            data: { profPrebid: true, type: POPUP_LOADED }
        };

        const invalidOriginEvent = {
            source: window,
            origin: 'https://malicious.com',
            data: { profPrebid: true, type: POPUP_LOADED }
        };

        const invalidSourceEvent = {
            source: {} as Window, // different window reference
            origin: window.origin,
            data: { profPrebid: true, type: POPUP_LOADED }
        };

        // Spy on sendDetailsToBackground
        const spy = vi.spyOn(prebidInstance, 'sendDetailsToBackground');

        // Test Valid
        listener(validEvent);
        expect(spy).toHaveBeenCalled();

        spy.mockClear();

        // Test Invalid Origin
        listener(invalidOriginEvent);
        expect(spy).not.toHaveBeenCalled();

        // Test Invalid Source
        listener(invalidSourceEvent);
        expect(spy).not.toHaveBeenCalled();
    });
});
