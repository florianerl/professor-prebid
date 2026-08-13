import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { NavBarReload } from './NavbarReload';
import { NavbarSelector } from './NavbarSelector';
import { NavBarTabs } from './NavbarTabs';
import AppStateContext from '../../contexts/appStateContext';
import OptionsContext from '../../contexts/optionsContext';
import InspectedPageContext from '../../contexts/inspectedPageContext';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../utils', () => ({
    sendChromeTabsMessage: vi.fn(),
    getTabId: vi.fn().mockResolvedValue(1),
}));

describe('NavBar components', () => {
    it('NavBarReload handles click events', () => {
        render(
            <InspectedPageContext.Provider value={{ downloading: false } as any}>
                <NavBarReload />
            </InspectedPageContext.Provider>
        );
        expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
    });

    it('NavbarSelector renders in panel mode', () => {
        const mockAppState: any = { isPanel: true, prebids: {}, pbjsNamespace: 'pbjs', frameId: 'top-window' };
        render(
            <AppStateContext.Provider value={mockAppState}>
                <NavbarSelector />
            </AppStateContext.Provider>
        );
        expect(screen.getByText('Namespace')).toBeTruthy();
    });

    it('NavBarTabs renders tabs from OptionsContext', () => {
        const mockOptions: any = {
            selectedPanelNavItems: ['bids', 'adUnits'],
            selectedPopUpNavItems: ['bids', 'adUnits'],
        };
        const mockAppState: any = { isPanel: true };

        render(
            <MemoryRouter>
                <AppStateContext.Provider value={mockAppState}>
                    <OptionsContext.Provider value={mockOptions}>
                        <NavBarTabs />
                    </OptionsContext.Provider>
                </AppStateContext.Provider>
            </MemoryRouter>
        );

        expect(screen.getByText('Bids')).toBeTruthy();
    });
});
