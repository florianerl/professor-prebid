import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Popup } from './Popup';
import AppStateContext from '../Shared/contexts/appStateContext';
import { PBJS_NAMESPACE_CHANGE, POPUP_LOADED } from '../Shared/constants';
import * as utils from '../Shared/utils';

// Mock child components to isolate Popup logic
vi.mock('../Shared/components/navBar/Navbar', () => ({
    NavBar: () => <div data-testid="nav-bar">Mock NavBar</div>
}));
vi.mock('../Shared/components/NoPrebidCardComponent', () => ({
    default: () => <div data-testid="no-prebid-card">Mock No Prebid Card</div>
}));
vi.mock('../Shared/components/RoutesComponent', () => ({
    default: () => <div data-testid="routes-component">Mock Routes</div>
}));

// Mock utils
vi.mock('../Shared/utils', () => ({
    sendChromeTabsMessage: vi.fn()
}));

// Mock MUI Box
vi.mock('@mui/material/Box', () => ({
    default: ({ children }: { children: React.ReactNode }) => <div data-testid="box">{children}</div>
}));

describe('Popup Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderPopup = (contextValue: any) => {
        return render(
            <AppStateContext.Provider value={contextValue}>
                <Popup />
            </AppStateContext.Provider>
        );
    };

    it('renders NavBar and sends POPUP_LOADED on mount', () => {
        renderPopup({ pbjsNamespace: 'pbjs', prebids: {} });

        expect(screen.getByTestId('nav-bar')).toBeTruthy();
        expect(utils.sendChromeTabsMessage).toHaveBeenCalledWith(POPUP_LOADED, {});
    });

    it('renders NoPrebidCardComponent when no prebids exist', () => {
        renderPopup({ pbjsNamespace: 'pbjs', prebids: null });

        expect(screen.getByTestId('no-prebid-card')).toBeTruthy();
        expect(screen.queryByTestId('routes-component')).toBeNull();
    });

    it('renders RoutesComponent when prebids exist for namespace', () => {
        const contextValue = {
            pbjsNamespace: 'pbjs',
            prebids: {
                pbjs: { /* mock prebid data */ }
            }
        };
        renderPopup(contextValue);

        expect(screen.queryByTestId('no-prebid-card')).toBeNull();
        expect(screen.getByTestId('routes-component')).toBeTruthy();
    });

    it('sends PBJS_NAMESPACE_CHANGE when namespace changes (simulated via effect)', () => {
        // Technically strict effects run on mount too, and we check call arguments.
        // We verify the call was made with current namespace.
        const contextValue = { pbjsNamespace: 'new_namespace', prebids: {} };
        renderPopup(contextValue);

        expect(utils.sendChromeTabsMessage).toHaveBeenCalledWith(PBJS_NAMESPACE_CHANGE, 'new_namespace');
    });
});
