import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock sendWindowPostMessage before import
vi.mock('../Shared/utils', () => ({
    sendWindowPostMessage: vi.fn(),
}));

import { sendWindowPostMessage } from '../Shared/utils';

describe('GoogleAdManager', () => {
    let gam: any;

    beforeEach(async () => {
        vi.clearAllMocks();

        const mockPubads = {
            addEventListener: vi.fn(),
            getSlots: vi.fn().mockReturnValue([]),
            isSRA: vi.fn().mockReturnValue(false),
        };

        (window as any).googletag = {
            cmd: [] as Function[],
            pubads: () => mockPubads,
            getEventLog: () => ({
                getAllEvents: () => [],
            }),
        };

        // Execute queued commands
        const originalPush = (window as any).googletag.cmd.push;
        (window as any).googletag.cmd.push = function (fn: Function) {
            fn();
            return originalPush.call(this, fn);
        };

        const mod = await import('./googleAdManager');
        gam = mod.googleAdManager;
    });

    describe('updatePostAuctionTimestamps', () => {
        it('sets start and end timestamps on first call', () => {
            gam.postAuctionStartTimestamp = null;
            gam.postAuctionEndTimestamp = null;
            gam.updatePostAuctionTimestamps(1000);
            expect(gam.postAuctionStartTimestamp).toBe(1000);
            expect(gam.postAuctionEndTimestamp).toBe(1000);
        });

        it('updates start when lower', () => {
            gam.postAuctionStartTimestamp = 2000;
            gam.postAuctionEndTimestamp = 2000;
            gam.updatePostAuctionTimestamps(1000);
            expect(gam.postAuctionStartTimestamp).toBe(1000);
        });

        it('updates end when higher', () => {
            gam.postAuctionStartTimestamp = 1000;
            gam.postAuctionEndTimestamp = 1000;
            gam.updatePostAuctionTimestamps(3000);
            expect(gam.postAuctionEndTimestamp).toBe(3000);
        });
    });

    describe('creativeRenderTime', () => {
        it('returns difference between onload and renderEnded', () => {
            gam.slotEvents = {
                'div-1': [
                    { type: 'slotRenderEnded', timestamp: 100 },
                    { type: 'slotOnload', timestamp: 250 },
                ],
            };
            expect(gam.creativeRenderTime('div-1')).toBe(150);
        });

        it('returns undefined if events missing', () => {
            gam.slotEvents = {};
            expect(gam.creativeRenderTime('div-1')).toBeUndefined();
        });
    });

    describe('getRequestMode', () => {
        it('returns value from isSRA', () => {
            expect(typeof gam.getRequestMode()).toBe('boolean');
        });
    });

    describe('getRenderMode', () => {
        it('defaults to async (true)', () => {
            expect(gam.getRenderMode()).toBe(true);
        });
    });

    describe('getFetchBeforeRefresh', () => {
        it('returns false when no events', () => {
            expect(gam.getFetchBeforeRefresh()).toBe(false);
        });
    });

    describe('getFetchBeforeKeyValue', () => {
        it('returns false when no events', () => {
            expect(gam.getFetchBeforeKeyValue()).toBe(false);
        });
    });
});
