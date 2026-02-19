import { IGoogleAdManagerDetails } from '../Injected/googleAdManager';
import { IPrebidDetails } from '../Injected/prebid';
import { ITcfDetails } from '../Injected/tcf';
import { EVENTS } from '../Shared/constants';
import { TabContextService } from './TabContextService';

export class MessageHandler {
    constructor(
        private tabContextService: TabContextService,
        private updateBadge: (tabId: number | undefined) => void
    ) { }

    handle = async (
        message: { type: string; payload: IGoogleAdManagerDetails | IPrebidDetails | ITcfDetails; },
        sender: chrome.runtime.MessageSender
    ) => {
        const { type, payload } = message;
        const tabId = sender.tab?.id;
        if (!tabId || !type || !payload || JSON.stringify(payload) === '{}') return;

        const tabInfos = await this.tabContextService.getTabInfos();
        if (!tabInfos[tabId]) tabInfos[tabId] = {};
        const tabInfo = tabInfos[tabId];

        if (type === EVENTS.SEND_GAM_DETAILS_TO_BACKGROUND && this.isGoogleAdManagerDetails(payload)) {
            tabInfo['top-window'] = tabInfo['top-window'] || {};
            tabInfo['top-window']['googleAdManager'] = payload;
        } else if (type === EVENTS.SEND_PREBID_DETAILS_TO_BACKGROUND && this.isPrebidDetails(payload)) {
            const { frameId, namespace } = payload;
            tabInfo[frameId] = tabInfo[frameId] || {};
            tabInfo[frameId]['prebids'] = tabInfo[frameId]['prebids'] || {};
            // @ts-ignore: IPrebids type issue handling
            tabInfo[frameId]['prebids'][namespace] = payload;
        } else if (type === EVENTS.SEND_TCF_DETAILS_TO_BACKGROUND && this.isTcfDetails(payload)) {
            tabInfo['tcf'] = payload;
        }
        await this.tabContextService.saveTabInfos(tabInfos);

        // Pass complete tabInfos to updateBadge since it now expects it or creates it
        // Wait, updateBadge in Background/index.ts fetches tabInfos itself.
        // But here we are calling `this.updateBadge(tabId)`.
        // The callback logic: 
        // In Background.ts: updateBadge = async (tabId) => { const tabInfos = await service.getTabInfos(); BadgeService.update... }
        // So just calling it is fine, it will re-fetch.
        // Optimization: duplicate fetch? Yes.
        // But for correctness and simplicity given statelessness, it's safer.
        this.updateBadge(tabId);
    };

    private isPrebidDetails(payload: any): payload is IPrebidDetails {
        return payload && typeof payload === 'object' && 'frameId' in payload && 'namespace' in payload;
    }

    private isGoogleAdManagerDetails(payload: any): payload is IGoogleAdManagerDetails {
        return payload && typeof payload === 'object' && 'slots' in payload;
    }

    private isTcfDetails(payload: any): payload is ITcfDetails {
        return payload && typeof payload === 'object' && 'tcf' in payload;
    }
}
