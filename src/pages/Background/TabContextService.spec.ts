import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TabContextService } from './TabContextService';
import { StorageService } from './StorageService';

// Mock StorageService
vi.mock('./StorageService', () => ({
    StorageService: {
        loadTabInfos: vi.fn(),
        saveTabInfos: vi.fn(),
        deleteTabInfo: vi.fn(),
    }
}));

describe('TabContextService', () => {
    let service: TabContextService;

    beforeEach(() => {
        vi.clearAllMocks();
        service = new TabContextService();
    });

    describe('getTabInfos', () => {
        it('returns tab infos from storage', async () => {
            const mockData = { 1: { 'top-window': { url: 'https://example.com' } } };
            (StorageService.loadTabInfos as any).mockResolvedValue(mockData);

            const result = await service.getTabInfos();
            expect(result).toEqual(mockData);
            expect(StorageService.loadTabInfos).toHaveBeenCalledOnce();
        });

        it('returns empty object when no data', async () => {
            (StorageService.loadTabInfos as any).mockResolvedValue({});
            const result = await service.getTabInfos();
            expect(result).toEqual({});
        });
    });

    describe('getOrCreateTabInfo', () => {
        it('returns existing tab info', async () => {
            const existing = { 1: { 'top-window': { url: 'test' } } };
            (StorageService.loadTabInfos as any).mockResolvedValue(existing);

            const result = await service.getOrCreateTabInfo(1);
            expect(result).toEqual({ 'top-window': { url: 'test' } });
        });

        it('creates new tab info if missing', async () => {
            (StorageService.loadTabInfos as any).mockResolvedValue({});

            const result = await service.getOrCreateTabInfo(99);
            expect(result).toEqual({});
            expect(StorageService.saveTabInfos).toHaveBeenCalledWith({ 99: {} });
        });
    });

    describe('deleteTabInfo', () => {
        it('delegates to StorageService', async () => {
            const mockData = { 1: {}, 2: {} };
            (StorageService.loadTabInfos as any).mockResolvedValue(mockData);

            await service.deleteTabInfo(1);
            expect(StorageService.deleteTabInfo).toHaveBeenCalledWith(mockData, 1);
        });
    });

    describe('saveTabInfos', () => {
        it('delegates to StorageService', async () => {
            const data = { 1: { 'frame': {} } };
            await service.saveTabInfos(data);
            expect(StorageService.saveTabInfos).toHaveBeenCalledWith(data);
        });
    });

    describe('persist', () => {
        it('is a no-op', async () => {
            await service.persist();
            expect(StorageService.saveTabInfos).not.toHaveBeenCalled();
        });
    });
});
