import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BadgeService } from './BadgeService';

// Mock getTabId
vi.mock('../Shared/utils', () => ({
    getTabId: vi.fn()
}));

import { getTabId } from '../Shared/utils';

const mockSetBadgeBackgroundColor = vi.fn();
const mockSetBadgeText = vi.fn();

global.chrome = {
    action: {
        setBadgeBackgroundColor: mockSetBadgeBackgroundColor,
        setBadgeText: mockSetBadgeText
    }
} as any;

describe('BadgeService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('does nothing if tabId is undefined', async () => {
        (getTabId as any).mockResolvedValue(1);
        await BadgeService.update({}, undefined);
        expect(mockSetBadgeText).not.toHaveBeenCalled();
    });

    it('does nothing if tabId does not match active tab', async () => {
        (getTabId as any).mockResolvedValue(999);
        await BadgeService.update({}, 1);
        expect(mockSetBadgeText).not.toHaveBeenCalled();
    });

    it('sets checkmark badge when prebids exist', async () => {
        (getTabId as any).mockResolvedValue(1);
        const tabInfos: ITabInfos = {
            1: {
                'top-window': {
                    prebids: { pbjs: {} as any },
                    url: 'https://example.com'
                }
            }
        };
        await BadgeService.update(tabInfos, 1);
        expect(mockSetBadgeBackgroundColor).toHaveBeenCalledWith({ color: '#1ba9e1', tabId: 1 });
        expect(mockSetBadgeText).toHaveBeenCalledWith({ text: '✓', tabId: 1 });
    });

    it('clears badge when no prebids exist', async () => {
        (getTabId as any).mockResolvedValue(1);
        const tabInfos: ITabInfos = {
            1: {
                'top-window': {
                    url: 'https://example.com'
                }
            }
        };
        await BadgeService.update(tabInfos, 1);
        expect(mockSetBadgeBackgroundColor).toHaveBeenCalledWith({ color: '#ecf3f5', tabId: 1 });
        expect(mockSetBadgeText).toHaveBeenCalledWith({ text: '', tabId: 1 });
    });

    it('counts prebids across multiple frames', async () => {
        (getTabId as any).mockResolvedValue(2);
        const tabInfos: ITabInfos = {
            2: {
                'top-window': {
                    prebids: { pbjs: {} as any },
                    url: 'https://example.com'
                },
                'frame-1': {
                    prebids: { pbjs2: {} as any },
                }
            }
        };
        await BadgeService.update(tabInfos, 2);
        expect(mockSetBadgeText).toHaveBeenCalledWith({ text: '✓', tabId: 2 });
    });
});
