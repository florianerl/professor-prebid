import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('./processHarRequestEntry', () => ({
    getInitReqChainByUrl: vi.fn(),
}));

import { getInitReqChainByUrl } from './processHarRequestEntry';

describe('Devtools index', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.resetModules();
    });

    it('registers devtools panel and triggers initiator check if active and root URL present', async () => {
        const createMock = vi.fn((name, icon, html, cb) => {
            if (cb) cb({} as any);
        });
        const storageGetMock = vi.fn((key, cb) => {
            if (key === 'initiator_state') cb({ initiator_state: true });
            if (key === 'initiator_root_url') cb({ initiator_root_url: 'https://example.com' });
        });

        global.chrome = {
            devtools: {
                panels: {
                    create: createMock,
                },
            },
            storage: {
                local: {
                    get: storageGetMock,
                },
            },
        } as any;

        await import('./index');

        expect(createMock).toHaveBeenCalledWith('Professor Prebid', 'icon-34.png', 'panel.html', expect.any(Function));
        expect(getInitReqChainByUrl).toHaveBeenCalledWith('https://example.com', 'document', 'GET');
    });

    it('does not call getInitReqChainByUrl when initiator_state is false', async () => {
        const createMock = vi.fn();
        const storageGetMock = vi.fn((key, cb) => {
            if (key === 'initiator_state') cb({ initiator_state: false });
        });

        global.chrome = {
            devtools: {
                panels: {
                    create: createMock,
                },
            },
            storage: {
                local: {
                    get: storageGetMock,
                },
            },
        } as any;

        await import('./index');

        expect(createMock).toHaveBeenCalled();
        expect(storageGetMock).toHaveBeenCalledWith('initiator_state', expect.any(Function));
        expect(getInitReqChainByUrl).not.toHaveBeenCalled();
    });

    it('does not call getInitReqChainByUrl when initiator_root_url is missing', async () => {
        const createMock = vi.fn();
        const storageGetMock = vi.fn((key, cb) => {
            if (key === 'initiator_state') cb({ initiator_state: true });
            if (key === 'initiator_root_url') cb({ initiator_root_url: '' });
        });

        global.chrome = {
            devtools: {
                panels: {
                    create: createMock,
                },
            },
            storage: {
                local: {
                    get: storageGetMock,
                },
            },
        } as any;

        await import('./index');

        expect(getInitReqChainByUrl).not.toHaveBeenCalled();
    });

    it('handles missing devtools or panels gracefully via optional chaining', async () => {
        const storageGetMock = vi.fn();

        global.chrome = {
            storage: {
                local: {
                    get: storageGetMock,
                },
            },
        } as any;

        await expect(import('./index')).resolves.toBeDefined();
    });
});
