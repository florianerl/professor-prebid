import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { EVENTS, CONSOLE_TOGGLE, PBJS_NAMESPACE_CHANGE, POPUP_LOADED, SAVE_MASKS } from '../Shared/constants';
import { EventBus } from '../Shared/utils';

// Mock window.requestIdleCallback
global.requestIdleCallback = vi.fn((cb) => cb({} as any)) as any;

// Mock chrome API
const mockSendMessage = vi.fn();
const mockGetURL = vi.fn((path) => `mock-extension://${path}`);
const mockStorageGet = vi.fn();
const mockAddListener = vi.fn();

// Setup global mocks
global.chrome = {
  runtime: {
    id: 'mock-id',
    sendMessage: mockSendMessage,
    onMessage: {
      addListener: mockAddListener,
      removeListener: vi.fn(),
    },
    getURL: mockGetURL,
  },
  storage: {
    local: {
      get: mockStorageGet,
    },
  },
} as any;

describe('Content Script', () => {
  let contentScript: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    vi.resetModules();
    if (document.head) {
      document.head.innerHTML = '';
    }
    contentScript = await import('./index');
  });

  describe('Module Initialization & Script Injection', () => {
    it('injects script into document head when not on Cloudflare', async () => {
      const appendChildSpy = vi.spyOn(document.head, 'appendChild');

      contentScript = await import('./index');

      expect(appendChildSpy).toHaveBeenCalled();
      const injectedScript = document.getElementById('professor prebid injected bundle') as HTMLScriptElement;
      expect(injectedScript).not.toBeNull();
      expect(injectedScript.src).toContain('/injected.bundle.js');

      // Test script load event removes the script element
      const removeSpy = vi.spyOn(injectedScript, 'remove');
      injectedScript.dispatchEvent(new Event('load'));
      expect(removeSpy).toHaveBeenCalled();
    });

    it('defers injection via requestIdleCallback on Cloudflare domains', async () => {
      const originalHost = window.location.host;
      Object.defineProperty(window, 'location', {
        writable: true,
        value: { ...window.location, host: 'challenges.cloudflare.com' },
      });

      contentScript = await import('./index');
      expect(global.requestIdleCallback).toHaveBeenCalled();

      Object.defineProperty(window, 'location', {
        writable: true,
        value: { ...window.location, host: originalHost },
      });
    });

    it('defers injection via requestIdleCallback when document head and documentElement are null', async () => {
      const originalHead = document.head;
      const originalDocElem = document.documentElement;

      Object.defineProperty(document, 'head', { get: () => null, configurable: true });
      Object.defineProperty(document, 'documentElement', { get: () => null, configurable: true });

      contentScript = await import('./index');
      expect(global.requestIdleCallback).toHaveBeenCalled();

      Object.defineProperty(document, 'head', { get: () => originalHead, configurable: true });
      Object.defineProperty(document, 'documentElement', { get: () => originalDocElem, configurable: true });
    });

    it('sets up listeners when not in iframe', async () => {
      contentScript = await import('./index');
      expect(mockAddListener).toHaveBeenCalled();
    });
  });

  describe('sendToServiceWorker', () => {
    it('sends message to runtime', () => {
      const payload = { foo: 'bar' };
      contentScript.sendToServiceWorker('TEST_TYPE', payload);
      expect(mockSendMessage).toHaveBeenCalledWith({ type: 'TEST_TYPE', payload });
    });

    it('returns early if type is missing or falsy', () => {
      contentScript.sendToServiceWorker('', { data: 1 });
      expect(mockSendMessage).not.toHaveBeenCalled();
    });

    it('returns early if payload is missing or null', () => {
      contentScript.sendToServiceWorker('TEST_TYPE', null as any);
      expect(mockSendMessage).not.toHaveBeenCalled();
    });

    it('returns early if chrome.runtime.id is missing', () => {
      const originalId = global.chrome.runtime.id;
      global.chrome.runtime.id = undefined;
      contentScript.sendToServiceWorker('TEST_TYPE', {});
      expect(mockSendMessage).not.toHaveBeenCalled();
      global.chrome.runtime.id = originalId;
    });

    it('returns early if chrome.runtime.sendMessage is missing', () => {
      const originalSendMessage = global.chrome.runtime.sendMessage;
      (global.chrome.runtime as any).sendMessage = undefined;
      contentScript.sendToServiceWorker('TEST_TYPE', {});
      expect(mockSendMessage).not.toHaveBeenCalled();
      global.chrome.runtime.sendMessage = originalSendMessage;
    });
  });

  describe('updateOverlays', () => {
    it('dispatches SAVE_MASKS event when namespace is present', () => {
      const dispatchSpy = vi.spyOn(document, 'dispatchEvent');
      contentScript.updateOverlays('pbjs');
      expect(dispatchSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: SAVE_MASKS,
          detail: 'pbjs',
        })
      );
    });

    it('does nothing when namespace is falsy/null', () => {
      const dispatchSpy = vi.spyOn(document, 'dispatchEvent');
      contentScript.updateOverlays(null);
      expect(dispatchSpy).not.toHaveBeenCalled();
    });
  });

  describe('processEventBusMessages', () => {
    it('forwards valid messages to service worker', async () => {
      const payload = { data: 123 };
      await contentScript.processEventBusMessages('SOME_EVENT', payload);
      expect(mockSendMessage).toHaveBeenCalledWith({ type: 'SOME_EVENT', payload });
    });

    it('handles REQUEST_CONSOLE_STATE when checked is true', async () => {
      mockStorageGet.mockResolvedValue({ [CONSOLE_TOGGLE]: true });
      const dispatchSpy = vi.spyOn(document, 'dispatchEvent');

      await contentScript.processEventBusMessages(EVENTS.REQUEST_CONSOLE_STATE, {});

      expect(mockStorageGet).toHaveBeenCalledWith(CONSOLE_TOGGLE);
      expect(dispatchSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: CONSOLE_TOGGLE,
          detail: true,
        })
      );
    });

    it('handles REQUEST_CONSOLE_STATE when checked is false', async () => {
      mockStorageGet.mockResolvedValue({ [CONSOLE_TOGGLE]: false });
      const dispatchSpy = vi.spyOn(document, 'dispatchEvent');

      await contentScript.processEventBusMessages(EVENTS.REQUEST_CONSOLE_STATE, {});

      expect(dispatchSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: CONSOLE_TOGGLE,
          detail: false,
        })
      );
    });

    it('handles REQUEST_CONSOLE_STATE when chrome.storage is undefined', async () => {
      const originalStorage = global.chrome.storage;
      (global.chrome as any).storage = undefined;

      await expect(contentScript.processEventBusMessages(EVENTS.REQUEST_CONSOLE_STATE, {})).resolves.not.toThrow();

      (global.chrome as any).storage = originalStorage;
    });

    it('handles SEND_PREBID_DETAILS_TO_BACKGROUND with namespace', async () => {
      const payload = { namespace: 'customPbjs' };
      const dispatchSpy = vi.spyOn(document, 'dispatchEvent');

      await contentScript.processEventBusMessages(EVENTS.SEND_PREBID_DETAILS_TO_BACKGROUND, payload);

      // Overlays should update with new namespace
      expect(dispatchSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: SAVE_MASKS,
          detail: 'customPbjs',
        })
      );
    });

    it('handles SEND_PREBID_DETAILS_TO_BACKGROUND with undefined payload', async () => {
      await expect(
        contentScript.processEventBusMessages(EVENTS.SEND_PREBID_DETAILS_TO_BACKGROUND, undefined)
      ).resolves.not.toThrow();
    });
  });

  describe('processChromeRuntimeMessages', () => {
    let runtimeListener: Function;

    beforeEach(() => {
      runtimeListener = mockAddListener.mock.calls[0]?.[0] || (() => {});
    });

    it('emits event on CONSOLE_TOGGLE message', () => {
      const emitSpy = vi.spyOn(EventBus, 'emit');
      runtimeListener({ type: CONSOLE_TOGGLE, consoleState: true });

      expect(emitSpy).toHaveBeenCalledWith(CONSOLE_TOGGLE, { detail: true });
    });

    it('updates NamespaceStore and emits event on PBJS_NAMESPACE_CHANGE message', () => {
      const emitSpy = vi.spyOn(EventBus, 'emit');
      const dispatchSpy = vi.spyOn(document, 'dispatchEvent');

      runtimeListener({ type: PBJS_NAMESPACE_CHANGE, pbjsNamespace: 'myPbjs' });

      expect(emitSpy).toHaveBeenCalledWith(PBJS_NAMESPACE_CHANGE, { detail: 'myPbjs' });

      // Trigger an event bus message to confirm NamespaceStore updated
      contentScript.updateOverlays('myPbjs');
      expect(dispatchSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: SAVE_MASKS,
          detail: 'myPbjs',
        })
      );
    });

    it('emits event on POPUP_LOADED message', () => {
      const emitSpy = vi.spyOn(EventBus, 'emit');
      const payload = { loaded: true };

      runtimeListener({ type: POPUP_LOADED, payload });

      expect(emitSpy).toHaveBeenCalledWith(POPUP_LOADED, payload);
    });

    it('handles default switch case for unknown message types', () => {
      const emitSpy = vi.spyOn(EventBus, 'emit');

      runtimeListener({ type: 'UNKNOWN_TYPE' as any });

      expect(emitSpy).not.toHaveBeenCalled();
    });
  });
});
