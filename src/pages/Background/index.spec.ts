

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
      get: vi.fn(async () => ({ tabInfos: {} })),
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
    // Reset storage mock
    (chrome.storage.local.get as any).mockResolvedValue({ tabInfos: {} });
    (chrome.storage.local.set as any).mockClear();
  });

  it('returns and stores tab info', async () => {
    const info = await service.getOrCreateTabInfo(1);
    expect(info).toEqual({});
    const infos = await service.getTabInfos();
    expect(infos[1]).toEqual(info);
  });

  it('persists via chrome.storage', async () => {
    // With stateless architecture, storage is saved immediately on updates if used correctly.
    // getOrCreateTabInfo loads from storage.
    // valid test: saveTabInfos calls storage.set
    const infos = { 1: {} };
    await service.saveTabInfos(infos);
    expect(chrome.storage.local.set).toHaveBeenCalledWith({ tabInfos: infos });
  });
});

describe('MessageHandler', () => {
  let handler: MessageHandler;
  let context: TabContextService;
  const updateBadge = vi.fn();

  beforeEach(() => {
    context = new TabContextService();
    handler = new MessageHandler(context, updateBadge);
    (chrome.storage.local.get as any).mockResolvedValue({ tabInfos: {} });
  });

  it('handles GAM payload', async () => {
    const payload: IGoogleAdManagerDetails = { slots: [] } as IGoogleAdManagerDetails;
    await handler.handle({ type: EVENTS.SEND_GAM_DETAILS_TO_BACKGROUND, payload }, { tab: { id: 1 } as chrome.tabs.Tab });
    const infos = await context.getTabInfos();
    expect(infos[1]['top-window']?.googleAdManager).toEqual(payload);
  });

  it('handles Prebid payload', async () => {
    const payload: IPrebidDetails = { frameId: 'f1', namespace: 'pbjs' } as any;
    // Mock storage to return empty object to start
    (chrome.storage.local.get as any).mockResolvedValue({ tabInfos: {} });

    await handler.handle({ type: EVENTS.SEND_PREBID_DETAILS_TO_BACKGROUND, payload }, { tab: { id: 2 } as chrome.tabs.Tab });

    // We need to fetch from storage to verify, but we mocked usage.
    // The handle method calls getTabInfos -> modifies -> saves.
    // Since we mocked get/set, 'context.getTabInfos()' will call mocked get.
    // Mocked get currently returns {} or whatever we set.
    // We need to spy on set or make get stateful for tests?
    // Easiest is to verify saveTabInfos called with correct structure.
    expect(chrome.storage.local.set).toHaveBeenCalledWith(expect.objectContaining({
      tabInfos: expect.objectContaining({
        2: expect.objectContaining({
          f1: expect.objectContaining({
            prebids: expect.objectContaining({
              pbjs: payload
            })
          })
        })
      })
    }));
  });

  it('handles TCF payload', async () => {
    const payload: ITcfDetails = { tcf: {} } as any;
    await handler.handle({ type: EVENTS.SEND_TCF_DETAILS_TO_BACKGROUND, payload }, { tab: { id: 3 } as chrome.tabs.Tab });
    expect(chrome.storage.local.set).toHaveBeenCalledWith(expect.objectContaining({
      tabInfos: expect.objectContaining({
        3: expect.objectContaining({ tcf: payload })
      })
    }));
  });
});

describe('BadgeService', () => {
  it('shows ✓ when prebid count > 0', async () => {
    const tabInfos = {
      123: {
        main: {
          prebids: { a: {}, b: {} },
        },
      },
    };
    await BadgeService.update(tabInfos, 123);
    // BadgeService.update is likely synchronous in logic but might trigger async actions, 
    // but here we just test if it calls setBadgeText.
    expect(chrome.action.setBadgeText).toHaveBeenCalledWith({ text: '✓', tabId: 123 });
  });

  it('clears badge when no data', async () => {
    const tabInfos = { 123: { main: {} } };
    await BadgeService.update(tabInfos, 123);
    expect(chrome.action.setBadgeText).toHaveBeenCalledWith({ text: '', tabId: 123 });
  });
});