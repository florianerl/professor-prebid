import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import McpToolsComponent, { generateMcpAiPrompt, injectDevtoolsMcpScript } from './McpToolsComponent';
import AppStateContext from '../../../../Shared/contexts/appStateContext';

vi.mock('../../../../Shared/utils', () => ({
  getTabId: vi.fn().mockResolvedValue(1),
}));

describe('McpToolsComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.chrome = {
      scripting: {
        executeScript: vi.fn().mockImplementation((opts) => {
          if (typeof opts?.func === 'function') {
            (window as any).pbjs = { onEvent: vi.fn(), installedModules: [] };
            opts.func();
          }
          return Promise.resolve([{ result: true }]);
        }),
      },
    } as any;

    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
      writable: true,
      configurable: true,
    });
  });

  it('renders correctly when devtoolsMcp is not installed', () => {
    const mockState: any = {
      prebid: { version: '8.0.0', installedModules: ['appnexusBidAdapter'] },
      prebids: {},
    };

    render(
      <AppStateContext.Provider value={mockState}>
        <McpToolsComponent />
      </AppStateContext.Provider>
    );

    expect(screen.getByText(/Model Context Protocol \(MCP\) & AI Diagnostics/i)).toBeTruthy();
    expect(screen.getByText('MCP Standalone Inactive')).toBeTruthy();
    expect(screen.getByText('Inject DevTools MCP Standalone')).toBeTruthy();
    expect(screen.getByText('Copy AI Diagnostic Snapshot')).toBeTruthy();
    expect(screen.getByText('Export MCP JSON')).toBeTruthy();
  });

  it('renders as active when devtoolsMcp is in installedModules', () => {
    const mockState: any = {
      prebid: { version: '11.29.0', installedModules: ['appnexusBidAdapter', 'devtoolsMcp'] },
      prebids: {},
    };

    render(
      <AppStateContext.Provider value={mockState}>
        <McpToolsComponent />
      </AppStateContext.Provider>
    );

    expect(screen.getByText('DevTools MCP Active')).toBeTruthy();
    expect(screen.getByText('MCP Module Injected')).toBeTruthy();
  });

  it('injects standalone script when inject button is clicked', async () => {
    const mockState: any = {
      prebid: { version: '8.0.0', installedModules: [] },
      prebids: {},
    };

    render(
      <AppStateContext.Provider value={mockState}>
        <McpToolsComponent />
      </AppStateContext.Provider>
    );

    const injectBtn = screen.getByText('Inject DevTools MCP Standalone');
    await act(async () => {
      fireEvent.click(injectBtn);
    });

    expect(chrome.scripting.executeScript).toHaveBeenCalled();
  });

  it('copies AI diagnostic snapshot to clipboard', async () => {
    const mockState: any = {
      prebid: {
        version: '11.29.0',
        installedModules: ['appnexusBidAdapter'],
        timeout: 1500,
        eventsUrl: 'https://example.com/events',
      },
      prebids: {
        pbjs: { version: '11.29.0', installedModules: ['appnexusBidAdapter'] },
      },
    };

    render(
      <AppStateContext.Provider value={mockState}>
        <McpToolsComponent />
      </AppStateContext.Provider>
    );

    const copyBtn = screen.getByText('Copy AI Diagnostic Snapshot');
    await act(async () => {
      fireEvent.click(copyBtn);
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalled();
  });

  it('triggers export MCP JSON download', () => {
    const mockState: any = {
      prebid: { version: '11.29.0', installedModules: ['devtoolsMcp'] },
      prebids: {},
    };

    render(
      <AppStateContext.Provider value={mockState}>
        <McpToolsComponent />
      </AppStateContext.Provider>
    );

    const exportBtn = screen.getByText('Export MCP JSON');
    fireEvent.click(exportBtn);
  });

  it('generateMcpAiPrompt formats complete prompt string', () => {
    const prompt = generateMcpAiPrompt(
      { version: '11.29.0', installedModules: ['rubiconBidAdapter', 'devtoolsMcp'], timeout: 1200 },
      { pbjs: { version: '11.29.0', installedModules: [] } }
    );
    expect(prompt).toContain('11.29.0');
    expect(prompt).toContain('DevTools MCP Active:** `Yes`');
    expect(prompt).toContain('1200ms');
  });
});
