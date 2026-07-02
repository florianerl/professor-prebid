import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Panel from './Panel';
import StateContext from '../Shared/contexts/appStateContext';
import InspectedPageContext from '../Shared/contexts/inspectedPageContext';
import * as utils from '../Shared/utils';

// Mock child components
vi.mock('../Shared/components/navBar/Navbar', () => ({
    NavBar: () => <div data-testid="nav-bar">NavBar</div>
}));
vi.mock('../Shared/components/NoPrebidCardComponent', () => ({
    default: () => <div data-testid="no-prebid-card">No Prebid</div>
}));
vi.mock('../Shared/components/RoutesComponent', () => ({
    default: () => <div data-testid="routes-component">Routes</div>
}));
vi.mock('../Shared/components/DownloadingCardComponent', () => ({
    default: () => <div data-testid="downloading-card">Downloading</div>
}));
vi.mock('../Shared/utils', () => ({
    sendChromeTabsMessage: vi.fn()
}));
vi.mock('@mui/material/Box', () => ({
    default: ({ children }: { children: React.ReactNode }) => <div data-testid="box">{children}</div>
}));

const renderPanel = (stateCtx: any, pageCtx: any) => {
    return render(
        <InspectedPageContext.Provider value={pageCtx}>
            <StateContext.Provider value={stateCtx}>
                <Panel />
            </StateContext.Provider>
        </InspectedPageContext.Provider>
    );
};

describe('Panel Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
    });

    it('renders NavBar', () => {
        renderPanel(
            { pbjsNamespace: 'pbjs', prebids: null },
            { downloading: 'false' }
        );
        expect(screen.getByTestId('nav-bar')).toBeTruthy();
    });

    it('shows NoPrebidCardComponent when no prebids and not downloading', () => {
        renderPanel(
            { pbjsNamespace: 'pbjs', prebids: null },
            { downloading: 'false' }
        );
        expect(screen.getByTestId('no-prebid-card')).toBeTruthy();
        expect(screen.queryByTestId('routes-component')).toBeNull();
    });

    it('shows RoutesComponent when prebids exist', () => {
        renderPanel(
            { pbjsNamespace: 'pbjs', prebids: { pbjs: { version: '1.0' } } },
            { downloading: 'false' }
        );
        expect(screen.getByTestId('routes-component')).toBeTruthy();
        expect(screen.queryByTestId('no-prebid-card')).toBeNull();
    });

    it('shows DownloadingCardComponent after 1s when downloading', async () => {
        renderPanel(
            { pbjsNamespace: 'pbjs', prebids: null },
            { downloading: 'true' }
        );
        // Before timeout
        expect(screen.queryByTestId('downloading-card')).toBeNull();

        // Advance timers
        vi.advanceTimersByTime(1100);

        // After timeout - need to wait for state update
        // Re-render happens asynchronously
        await vi.waitFor(() => {
            expect(screen.getByTestId('downloading-card')).toBeTruthy();
        });
    });
});
