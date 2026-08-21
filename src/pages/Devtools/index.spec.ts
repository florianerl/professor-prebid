import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('./harLog', () => ({
    collectHarLog: vi.fn(),
}));

import { collectHarLog } from './harLog';

describe('Devtools index', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.resetModules();
    });

    it('registers devtools panel and starts network collection unconditionally', async () => {
        const createMock = vi.fn((name, icon, html, cb) => {
            if (cb) cb({} as any);
        });

        global.chrome = {
            devtools: {
                panels: {
                    create: createMock,
                },
            },
        } as any;

        await import('./index');

        expect(createMock).toHaveBeenCalledWith('Professor Prebid', 'icon-34.png', 'panel.html', expect.any(Function));
        expect(collectHarLog).toHaveBeenCalled();
    });

    it('handles missing devtools or panels gracefully via optional chaining', async () => {
        global.chrome = {} as any;

        await import('./index');

        expect(collectHarLog).toHaveBeenCalled();
    });
});
