import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Options from './Options';
import OptionsContext from '../Shared/contexts/optionsContext';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../../theme/theme';

// Mock external deps
vi.mock('react-error-boundary', () => ({
    ErrorBoundary: ({ children }: any) => <div>{children}</div>
}));
vi.mock('../Shared/components/ErrorCardComponent', () => ({
    default: () => <div>Error</div>
}));
vi.mock('../Shared/contexts/optionsContext', async () => {
    const React = await import('react');
    const ctx = React.createContext({
        selectedPopUpNavItems: [] as string[],
        setSelectedPopUpNavItems: () => { },
        selectedPanelNavItems: [] as string[],
        setSelectedPanelNavItems: () => { },
    });
    return {
        default: ctx,
        OptionsContextProvider: ({ children }: any) => {
            const [popUp, setPopUp] = React.useState<string[]>([]);
            const [panel, setPanel] = React.useState<string[]>([]);
            return (
                <ctx.Provider value={{
                    selectedPopUpNavItems: popUp,
                    setSelectedPopUpNavItems: setPopUp,
                    selectedPanelNavItems: panel,
                    setSelectedPanelNavItems: setPanel,
                }}>
                    {children}
                </ctx.Provider>
            );
        },
    };
});

global.chrome = {
    storage: {
        sync: {
            set: vi.fn((_, cb) => cb?.()),
            clear: vi.fn((cb) => cb?.()),
        }
    }
} as any;

describe('Options', () => {
    it('renders page title text', () => {
        render(<Options title="Options" />);
        expect(screen.getByText(/Enable or disable the following pages in the pop-up/)).toBeTruthy();
    });

    it('renders Save and Reset buttons', () => {
        render(<Options title="Options" />);
        expect(screen.getByText('Save')).toBeTruthy();
        expect(screen.getByText('Reset')).toBeTruthy();
    });

    it('renders page labels (Ad Units etc)', () => {
        render(<Options title="Options" />);
        expect(screen.getAllByText('Ad Units').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Bids').length).toBeGreaterThan(0);
    });
});
