import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DebuggingModuleComponent from './DebuggingModuleComponent';
import MatchRule from './MatchRule';
import ReplaceRule from './ReplaceRule';
import RuleComponent from './RuleComponent';
import AppStateContext from '../../../contexts/appStateContext';

vi.mock('../../../../Shared/utils', () => ({
  getTabId: vi.fn().mockResolvedValue(1),
  sendChromeTabsMessage: vi.fn(),
}));

describe('DebuggingModule subcomponents', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.chrome = {
      storage: {
        local: {
          get: vi.fn((key, cb) => cb({})),
          set: vi.fn((val, cb) => cb?.()),
        },
      },
      scripting: {
        executeScript: vi.fn().mockResolvedValue([
          {
            result: JSON.stringify({
              enabled: true,
              intercept: [{ when: { adUnitCode: 'slot-1' }, then: { cpm: 10 } }],
            }),
          },
        ]),
      },
    } as any;
  });

  it('renders MatchRule component and handles rule key and value changes', () => {
    const mockRule: any = { when: { adUnitCode: 'slot-1' }, then: { cpm: 10 } };
    const mockPrebid: any = { events: [] };
    const handleRulesFormChange = vi.fn();

    render(
      <MatchRule
        groupIndex={0}
        rule={mockRule}
        ruleKey="adUnitCode"
        prebid={mockPrebid}
        handleRulesFormChange={handleRulesFormChange}
        path={['intercept', '0', 'when', 'adUnitCode']}
      />
    );

    expect(screen.getByLabelText('MatchRule Target')).toBeTruthy();

    const inputs = screen.getAllByRole('combobox');
    fireEvent.change(inputs[0], { target: { value: 'bidder' } });

    expect(handleRulesFormChange).toHaveBeenCalled();
  });

  it('renders ReplaceRule component and handles rule changes', () => {
    const mockRule: any = { when: { adUnitCode: 'slot-1' }, then: { cpm: 10 } };
    const handleRulesFormChange = vi.fn();

    render(
      <ReplaceRule
        groupIndex={0}
        rule={mockRule}
        ruleKey="cpm"
        handleRulesFormChange={handleRulesFormChange}
        path={['intercept', '0', 'then', 'cpm']}
      />
    );

    expect(screen.getByLabelText('Replace-Rule Value')).toBeTruthy();

    const valInput = screen.getByDisplayValue('10');
    fireEvent.change(valInput, { target: { value: '15' } });

    expect(handleRulesFormChange).toHaveBeenCalled();
  });

  it('renders RuleComponent and handles rule interactions', () => {
    const mockRuleGroup: any = { when: { adUnitCode: 'slot-1' }, then: { cpm: 10 } };
    const handleRulesFormChange = vi.fn();
    const removeRule = vi.fn();

    render(
      <RuleComponent
        rule={mockRuleGroup}
        ruleIndex={0}
        prebid={{ events: [] }}
        handleRulesFormChange={handleRulesFormChange}
        removeRule={removeRule}
      />
    );

    expect(screen.getByText('Rule #1')).toBeTruthy();
    expect(screen.getByText('WHEN (Match Request)')).toBeTruthy();
    expect(screen.getByText('THEN (Mock Bid Response)')).toBeTruthy();

    const deleteBtn = screen.getByTitle('Delete rule');
    fireEvent.click(deleteBtn);
    expect(removeRule).toHaveBeenCalled();
  });

  it('renders DebuggingModuleComponent, toggles enable switch and adds/saves rules', async () => {
    const mockAppState: any = {
      prebid: { events: [] },
      pbjsNamespace: 'pbjs',
    };

    await act(async () => {
      render(
        <AppStateContext.Provider value={mockAppState}>
          <DebuggingModuleComponent />
        </AppStateContext.Provider>
      );
    });

    expect(screen.getByText(/Prebid.js Debugging Module/i)).toBeTruthy();

    // Toggle switch
    const toggleSwitch = screen.getAllByRole('checkbox')[0];
    await act(async () => {
      fireEvent.click(toggleSwitch);
    });

    // Click Add Custom Intercept Rule
    const addButton = screen.getByText('Add Custom Intercept Rule');
    await act(async () => {
      fireEvent.click(addButton);
    });

    // Save Debug Config
    const saveButton = screen.getByText('Save Debug Config');
    await act(async () => {
      fireEvent.click(saveButton);
    });

    expect(chrome.scripting.executeScript).toHaveBeenCalled();
  });
});
