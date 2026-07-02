import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('../Shared/utils', () => ({
    sendWindowPostMessage: vi.fn(),
}));

describe('IabTcf', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
        (window as any).__cmp = undefined;
        (window as any).__tcfapi = undefined;
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('isTCFInpage returns false when no CMP', async () => {
        const mod = await import('./tcf');
        expect(mod.iabTcf.isTCFInpage()).toBeFalsy();
    });

    it('isTCFInpage returns truthy when __cmp exists', async () => {
        (window as any).__cmp = vi.fn();
        const mod = await import('./tcf');
        expect(mod.iabTcf.isTCFInpage()).toBeTruthy();
    });

    it('isTCFInpage returns truthy when __tcfapi exists', async () => {
        (window as any).__tcfapi = vi.fn();
        const mod = await import('./tcf');
        expect(mod.iabTcf.isTCFInpage()).toBeTruthy();
    });

    it('stopLoop defaults to false', async () => {
        const mod = await import('./tcf');
        expect(mod.iabTcf.stopLoop).toBe(false);
    });

    it('criteoVendorId is 91', async () => {
        const mod = await import('./tcf');
        expect(mod.iabTcf.criteoVendorId).toBe(91);
    });
});
