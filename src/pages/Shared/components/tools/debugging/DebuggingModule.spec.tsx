import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import MatchRule from './MatchRule';
import ReplaceRule from './ReplaceRule';
import RuleComponent from './RuleComponent';

describe('DebuggingModule subcomponents', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders MatchRule component with correct labels', () => {
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
    expect(screen.getByLabelText('MatchRule Value')).toBeTruthy();
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
});
