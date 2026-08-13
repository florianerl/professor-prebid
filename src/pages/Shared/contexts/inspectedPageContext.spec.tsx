import React, { useContext } from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import InspectedPageContext, { InspectedPageContextProvider } from './inspectedPageContext';

vi.mock('../utils', () => ({
    getTabId: vi.fn().mockResolvedValue(123),
}));

vi.mock('./fetchEvents', () => ({
    fetchEvents: vi.fn((tabInfo) => Promise.resolve(tabInfo)),
}));

const TestComponent = () => {
    const ctx = useContext(InspectedPageContext);
    if (!ctx) return <div>No Context</div>;
    return (
        <div>
            <div data-testid="frames">{JSON.stringify(ctx.frames)}</div>
            <div data-testid="downloading">{ctx.downloading}</div>
            <div data-testid="syncState">{ctx.syncState}</div>
            <div data-testid="initReqChain">{JSON.stringify(ctx.initReqChainResult)}</div>
        </div>
    );
};

describe('InspectedPageContextProvider', () => {
    let listeners: Function[] = [];

    beforeEach(() => {
        vi.clearAllMocks();
        listeners = [];
        global.chrome = {
            storage: {
                local: {
                    get: vi.fn((keys, cb) => cb({ tab_info_123: { 'top-window': {} } })),
                },
                onChanged: {
                    addListener: vi.fn((fn) => listeners.push(fn)),
                    removeListener: vi.fn((fn) => {
                        listeners = listeners.filter((l) => l !== fn);
                    }),
                },
            },
        } as any;
    });

    it('loads initial tab info on mount when tabInfo exists', async () => {
        await act(async () => {
            render(
                <InspectedPageContextProvider>
                    <TestComponent />
                </InspectedPageContextProvider>
            );
        });

        expect(screen.getByTestId('frames').textContent).toContain('top-window');
        expect(screen.getByTestId('downloading').textContent).toBe('false');
    });

    it('handles initial mount when tabInfo does not exist in local storage', async () => {
        global.chrome.storage.local.get = vi.fn((keys, cb) => cb({}));

        await act(async () => {
            render(
                <InspectedPageContextProvider>
                    <TestComponent />
                </InspectedPageContextProvider>
            );
        });

        expect(screen.getByTestId('frames').textContent).toBe('{}');
    });

    it('reacts to local storage changes and updates frames and initReqChain', async () => {
        let unmount: any;
        await act(async () => {
            const res = render(
                <InspectedPageContextProvider>
                    <TestComponent />
                </InspectedPageContextProvider>
            );
            unmount = res.unmount;
        });

        await act(async () => {
            listeners.forEach((listener) => {
                listener(
                    {
                        tab_info_123: {
                            oldValue: {},
                            newValue: { 'top-window': { prebids: {} } },
                        },
                        initReqChain: {
                            newValue: JSON.stringify({ chain: true }),
                        },
                    },
                    'local'
                );
            });
        });

        expect(screen.getByTestId('frames').textContent).toContain('top-window');
        expect(listeners.length).toBeGreaterThan(0);

        unmount();
        expect(listeners.length).toBe(0);
    });

    it('ignores storage changes for non-local area or unchanged tabInfo values', async () => {
        await act(async () => {
            render(
                <InspectedPageContextProvider>
                    <TestComponent />
                </InspectedPageContextProvider>
            );
        });

        await act(async () => {
            listeners.forEach((listener) => {
                // Sync area name should be ignored
                listener(
                    {
                        tab_info_123: {
                            oldValue: { a: 1 },
                            newValue: { a: 2 },
                        },
                    },
                    'sync'
                );

                // Equal oldValue and newValue should be ignored
                listener(
                    {
                        tab_info_123: {
                            oldValue: { same: 1 },
                            newValue: { same: 1 },
                        },
                    },
                    'local'
                );

                // Unrelated local storage keys should be ignored
                listener(
                    {
                        other_key: {
                            oldValue: 1,
                            newValue: 2,
                        },
                    },
                    'local'
                );
            });
        });
    });

    it('handles tab_info change where newValue is undefined', async () => {
        await act(async () => {
            render(
                <InspectedPageContextProvider>
                    <TestComponent />
                </InspectedPageContextProvider>
            );
        });

        await act(async () => {
            listeners.forEach((listener) => {
                listener(
                    {
                        tab_info_123: {
                            oldValue: { 'top-window': {} },
                            newValue: undefined,
                        },
                    },
                    'local'
                );
            });
        });
    });
});

