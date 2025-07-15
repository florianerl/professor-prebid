import { describe, it, expect, vi, beforeEach } from 'vitest';
import { processWindowMessages } from './index';

vi.mock('./index', async () => {
  const actual = await vi.importActual<any>('./index');
  return {
    ...actual,
    sendToServiceWorker: vi.fn(),
    updateOverlays: vi.fn(),
  };
});

const { sendToServiceWorker, updateOverlays } = await import('./index');

describe('processWindowMessages', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle valid window message and call sendToServiceWorker and updateOverlays', async () => {
    const detail = { frameId: 'f1', namespace: 'pbjs' };
    const event = new MessageEvent('message', {
      data: {
        type: 'SEND_PREBID_DETAILS_TO_BACKGROUND',
        profPrebid: true,
        payload: detail,
      },
    });

    await processWindowMessages(event);
    expect(sendToServiceWorker).toHaveBeenCalledWith('SEND_PREBID_DETAILS_TO_BACKGROUND', detail);
    expect(updateOverlays).toHaveBeenCalledWith('pbjs');
  });

  it('should ignore non-profPrebid messages', async () => {
    const event = new MessageEvent('message', {
      data: { type: 'ANY', profPrebid: false, payload: {} },
    });

    await processWindowMessages(event);
    expect(sendToServiceWorker).not.toHaveBeenCalled();
    expect(updateOverlays).not.toHaveBeenCalled();
  });
});
