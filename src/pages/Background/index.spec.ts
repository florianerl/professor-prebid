

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IPrebidDetails } from '../Injected/prebid';
import { IGoogleAdManagerDetails } from '../Injected/googleAdManager';
import { ITcfDetails } from '../Injected/tcf';
import { EVENTS } from '../Shared/constants';
import { BadgeService } from './BadgeService';
import { MessageHandler } from './MessageHandler';
import { TabContextService } from './TabContextService';


vi.stubGlobal('chrome', {
  storage: {
    local: {
      get: vi.fn(async (keys) => {
        if (!keys) return {};
        const result: Record<string, any> = {};
        for (const k of keys) {
          result[k] = {};
        }
        return result;
      }),
      set: vi.fn(async () => { }),
    },
  },
  action: {
    setBadgeBackgroundColor: vi.fn(),
    setBadgeText: vi.fn(),
  },
  runtime: { onMessage: { addListener: vi.fn() } },
  webNavigation: { onBeforeNavigate: { addListener: vi.fn() } },
  tabs: {
    onRemoved: { addListener: vi.fn() },
    onActivated: { addListener: vi.fn() },
    query: vi.fn(() => Promise.resolve([{ id: 123 }])),
  },
  alarms: {
    onAlarm: { addListener: vi.fn() },
    create: vi.fn(),
  },
});

vi.mock('../Shared/utils', () => ({
  getTabId: vi.fn(() => Promise.resolve(123)),
}));

describe('TabContextService', () => {
  let service: TabContextService;

  beforeEach(() => {
    service = new TabContextService();
    (chrome.storage.local.get as any).mockImplementation(async (keys: string[]) => {
      const res: any = {};
      for (const k of keys) res[k] = {};
      return res;
    });
    (chrome.storage.local.set as any).mockClear();
  });

  it('returns and stores tab info', async () => {
    const info = await service.getOrCreateTabInfo(1);
    expect(info).toEqual({});
  });

  it('persists via chrome.storage', async () => {
    const info = { 'top-window': {} };
    await service.saveTabInfo(1, info);
    expect(chrome.storage.local.set).toHaveBeenCalledWith({ tab_info_1: info });
  });
});

describe('MessageHandler', () => {
  let handler: MessageHandler;
  let context: TabContextService;
  const updateBadge = vi.fn();

  beforeEach(() => {
    context = new TabContextService();
    handler = new MessageHandler(context, updateBadge);
    (chrome.storage.local.get as any).mockImplementation(async (keys: string[]) => {
      const res: any = {};
      for (const k of keys) res[k] = {};
      return res;
    });
  });

  it('handles GAM payload', async () => {
    const payload: IGoogleAdManagerDetails = { slots: [] } as IGoogleAdManagerDetails;
    await handler.handle({ type: EVENTS.SEND_GAM_DETAILS_TO_BACKGROUND, payload }, { tab: { id: 1 } as chrome.tabs.Tab });
    expect(chrome.storage.local.set).toHaveBeenCalledWith(expect.objectContaining({
      tab_info_1: expect.objectContaining({
        'top-window': expect.objectContaining({
          googleAdManager: payload
        })
      })
    }));
  });

  it('handles Prebid payload', async () => {
    const payload: IPrebidDetails = { frameId: 'f1', namespace: 'pbjs' } as any;

    await handler.handle({ type: EVENTS.SEND_PREBID_DETAILS_TO_BACKGROUND, payload }, { tab: { id: 2 } as chrome.tabs.Tab });

    expect(chrome.storage.local.set).toHaveBeenCalledWith(expect.objectContaining({
      tab_info_2: expect.objectContaining({
        f1: expect.objectContaining({
          prebids: expect.objectContaining({
            pbjs: payload
          })
        })
      })
    }));
  });

  it('handles TCF payload', async () => {
    const payload: ITcfDetails = { tcf: {} } as any;
    await handler.handle({ type: EVENTS.SEND_TCF_DETAILS_TO_BACKGROUND, payload }, { tab: { id: 3 } as chrome.tabs.Tab });
    expect(chrome.storage.local.set).toHaveBeenCalledWith(expect.objectContaining({
      tab_info_3: expect.objectContaining({ tcf: payload })
    }));
  });
});

describe('BadgeService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows ✓ when prebid count > 0', async () => {
    const tabInfo = {
      main: {
        prebids: { a: {}, b: {} },
      },
    };
    await BadgeService.update(tabInfo, 123);
    expect(chrome.action.setBadgeText).toHaveBeenCalledWith({ text: '✓', tabId: 123 });
  });

  it('clears badge when no data', async () => {
    const tabInfo = { main: {} };
    await BadgeService.update(tabInfo, 123);
    expect(chrome.action.setBadgeText).toHaveBeenCalledWith({ text: '', tabId: 123 });
  });
});