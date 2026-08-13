import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TabContextService, debounce } from './TabContextService';
import { StorageService } from './StorageService';

// Mock StorageService
vi.mock('./StorageService', () => ({
    StorageService: {
        loadTabInfo: vi.fn(),
        saveTabInfo: vi.fn(),
        deleteTabInfo: vi.fn(),
    }
}));

describe('TabContextService', () => {
    let service: TabContextService;

    beforeEach(() => {
        vi.clearAllMocks();
        service = new TabContextService();
    });

    describe('getTabInfo', () => {
        it('returns tab info from storage', async () => {
            const mockData = { 'top-window': { url: 'https://example.com' } };
            (StorageService.loadTabInfo as any).mockResolvedValue(mockData);

            const result = await service.getTabInfo(1);
            expect(result).toEqual(mockData);
            expect(StorageService.loadTabInfo).toHaveBeenCalledWith(1);
        });

        it('returns empty object when no data', async () => {
            (StorageService.loadTabInfo as any).mockResolvedValue({});
            const result = await service.getTabInfo(1);
            expect(result).toEqual({});
        });
    });

    describe('getOrCreateTabInfo', () => {
        it('returns existing tab info', async () => {
            const existing = { 'top-window': { url: 'test' } };
            (StorageService.loadTabInfo as any).mockResolvedValue(existing);

            const result = await service.getOrCreateTabInfo(1);
            expect(result).toEqual({ 'top-window': { url: 'test' } });
        });
    });

    describe('deleteTabInfo', () => {
        it('delegates to StorageService', async () => {
            await service.deleteTabInfo(1);
            expect(StorageService.deleteTabInfo).toHaveBeenCalledWith(1);
        });
    });

    describe('saveTabInfo', () => {
        it('delegates to StorageService', async () => {
            const data = { 'frame': {} };
            await service.saveTabInfo(1, data);
            expect(StorageService.saveTabInfo).toHaveBeenCalledWith(1, data);
        });
    });

    describe('load', () => {
        it('is a no-op that resolves', async () => {
            await expect(service.load()).resolves.toBeUndefined();
        });
    });

    describe('persist', () => {
        it('is a no-op', async () => {
            await service.persist();
            expect(StorageService.saveTabInfo).not.toHaveBeenCalled();
        });
    });
});

describe('debounce', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('debounces function execution and clears existing timer on subsequent calls', () => {
        const fn = vi.fn();
        const debounced = debounce(fn, 100);

        debounced('first');
        expect(fn).not.toHaveBeenCalled();

        // Call again before timer expires to trigger clearTimeout branch
        debounced('second');
        expect(fn).not.toHaveBeenCalled();

        vi.advanceTimersByTime(100);
        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn).toHaveBeenCalledWith('second');
    });
});
