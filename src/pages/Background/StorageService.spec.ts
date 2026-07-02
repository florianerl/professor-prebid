import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StorageService } from './StorageService';

const mockGet = vi.fn();
const mockSet = vi.fn();

global.chrome = {
    storage: {
        local: {
            get: mockGet,
            set: mockSet
        }
    }
} as any;

describe('StorageService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('loadTabInfos', () => {
        it('returns tabInfos from storage', async () => {
            mockGet.mockResolvedValue({ tabInfos: { 1: { 'f': {} } } });
            const result = await StorageService.loadTabInfos();
            expect(result).toEqual({ 1: { 'f': {} } });
            expect(mockGet).toHaveBeenCalledWith(['tabInfos']);
        });

        it('returns empty object when no tabInfos', async () => {
            mockGet.mockResolvedValue({});
            const result = await StorageService.loadTabInfos();
            expect(result).toEqual({});
        });
    });

    describe('saveTabInfos', () => {
        it('saves tabInfos to storage', async () => {
            mockSet.mockResolvedValue(undefined);
            const data = { 1: { 'top': {} } };
            await StorageService.saveTabInfos(data);
            expect(mockSet).toHaveBeenCalledWith({ tabInfos: data });
        });
    });

    describe('deleteTabInfo', () => {
        it('removes tab and saves', async () => {
            mockSet.mockResolvedValue(undefined);
            const data: any = { 1: { 'f': {} }, 2: { 'g': {} } };
            await StorageService.deleteTabInfo(data, 1);
            expect(data[1]).toBeUndefined();
            expect(mockSet).toHaveBeenCalledWith({ tabInfos: { 2: { 'g': {} } } });
        });
    });
});
