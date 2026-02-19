import { StorageService } from './StorageService';

export class TabContextService {
    // In-memory cache removed for MV3 statelessness
    // All methods now interact directly with storage

    async load(): Promise<void> {
        // No-op or perhaps verify storage integrity
    }

    async getTabInfos(): Promise<ITabInfos> {
        return await StorageService.loadTabInfos();
    }

    async getOrCreateTabInfo(tabId: number): Promise<IFrameInfos> {
        const tabInfos = await StorageService.loadTabInfos();
        if (!tabInfos[tabId]) {
            tabInfos[tabId] = {};
            await StorageService.saveTabInfos(tabInfos);
        }
        return tabInfos[tabId];
    }

    async deleteTabInfo(tabId: number): Promise<void> {
        const tabInfos = await StorageService.loadTabInfos();
        await StorageService.deleteTabInfo(tabInfos, tabId);
    }

    async saveTabInfos(tabInfos: ITabInfos): Promise<void> {
        await StorageService.saveTabInfos(tabInfos);
    }

    async persist(): Promise<void> {
        // No-op as every operation persists immediately
    }
}
// Debounce utility function
export function debounce<T extends (...args: any[]) => void>(fn: T, delay: number): T {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    return ((...args: any[]) => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    }) as T;
}
