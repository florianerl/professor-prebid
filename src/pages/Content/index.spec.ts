import { describe, it, expect, vi, beforeEach, afterEach, beforeAll } from 'vitest';
import { EVENTS, CONSOLE_TOGGLE } from '../Shared/constants';

// Mock chrome API
const mockSendMessage = vi.fn();
const mockGetURL = vi.fn((path) => `mock-extension://${path}`);
const mockGet = vi.fn();

// Setup global mocks BEFORE import
global.chrome = {
  runtime: {
    id: 'mock-id',
    sendMessage: mockSendMessage,
    onMessage: {
      addListener: vi.fn(),
      removeListener: vi.fn(),
    },
    getURL: mockGetURL
  },
  storage: {
    local: {
      get: mockGet
    }
  }
} as any;

// Mock DOM
global.document.dispatchEvent = vi.fn();

describe('Content Script', () => {
  let contentScript: any;

  beforeAll(async () => {
    // Dynamic import to ensure globals are set
    contentScript = await import('./index');
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('sendToServiceWorker', () => {
    it('sends message to runtime', () => {
      const payload = { foo: 'bar' };
      contentScript.sendToServiceWorker('TEST_TYPE', payload);
      expect(mockSendMessage).toHaveBeenCalledWith({ type: 'TEST_TYPE', payload });
    });

    it('does not send if runtime id is missing', () => {
      const originalId = global.chrome.runtime.id;
      global.chrome.runtime.id = undefined;
      contentScript.sendToServiceWorker('TEST_TYPE', {});
      expect(mockSendMessage).not.toHaveBeenCalled();
      global.chrome.runtime.id = originalId;
    });
  });

  describe('processWindowMessages', () => {
    it('ignores messages without profPrebid flag', async () => {
      const event = { data: { type: 'SOME_TYPE' } } as any;
      await contentScript.processWindowMessages(event);
      expect(mockSendMessage).not.toHaveBeenCalled();
    });

    it('ignores messages without type', async () => {
      const event = { data: { profPrebid: true } } as any;
      await contentScript.processWindowMessages(event);
      expect(mockSendMessage).not.toHaveBeenCalled();
    });

    it('forwards valid messages to service worker', async () => {
      const payload = { data: 123 };
      const event = {
        data: {
          profPrebid: true,
          type: 'SOME_EVENT',
          payload
        }
      } as any;

      await contentScript.processWindowMessages(event);
      expect(mockSendMessage).toHaveBeenCalledWith({ type: 'SOME_EVENT', payload });
    });

    it('handles REQUEST_CONSOLE_STATE', async () => {
      mockGet.mockResolvedValue({ [CONSOLE_TOGGLE]: true });
      const event = {
        data: {
          profPrebid: true,
          type: EVENTS.REQUEST_CONSOLE_STATE,
        }
      } as any;

      await contentScript.processWindowMessages(event);
      expect(mockGet).toHaveBeenCalledWith(CONSOLE_TOGGLE);
    });
  });
});
