import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Options from './Options';
import OptionsContext, { OptionsContextProvider } from '../Shared/contexts/optionsContext';
import { PAGES } from '../Shared/constants';

// Mock external deps
vi.mock('react-error-boundary', () => ({
  ErrorBoundary: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('../Shared/components/ErrorCardComponent', () => ({
  default: () => <div>Error</div>,
}));

// Mock OptionsContextProvider to allow custom context value injection in tests
const mockSetSelectedPopUpNavItems = vi.fn();
const mockSetSelectedPanelNavItems = vi.fn();

describe('Options Component', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    vi.clearAllMocks();

    delete (window as any).location;
    (window as any).location = {
      ...originalLocation,
      reload: vi.fn(),
      href: 'http://localhost',
    };

    global.chrome = {
      storage: {
        sync: {
          set: vi.fn((data, cb) => { if (cb) cb(); }),
          clear: vi.fn((cb) => { if (cb) cb(); }),
        },
      },
    } as any;
  });

  afterEach(() => {
    (window as any).location = originalLocation;
  });

  it('renders page title text and section headers', () => {
    render(<Options title="Options" />);
    expect(screen.getByText(/Enable or disable the following pages in the pop-up:/i)).toBeTruthy();
    expect(screen.getByText(/Enable or disable the following pages in the dev-tools-panel:/i)).toBeTruthy();
  });

  it('renders Save and Reset buttons', () => {
    render(<Options title="Options" />);
    expect(screen.getByRole('button', { name: /Save/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Reset/i })).toBeTruthy();
  });

  it('renders page items for both pop-up and panel sections', () => {
    render(<Options title="Options" />);
    // PAGES items like 'Ad Units', 'Bids', etc. appear in both pop-up and dev-tools lists
    const adUnitsLabels = screen.getAllByText('Ad Units');
    expect(adUnitsLabels.length).toBe(2);

    const bidsLabels = screen.getAllByText('Bids');
    expect(bidsLabels.length).toBe(2);
  });

  it('toggles PopUp nav item on and off (handleTogglePopUp)', () => {
    let selectedPopUp: string[] = [];
    let selectedPanel: string[] = [];

    const TestWrapper = () => {
      const [popUp, setPopUp] = React.useState<string[]>(selectedPopUp);
      const [panel, setPanel] = React.useState<string[]>(selectedPanel);
      return (
        <OptionsContext.Provider
          value={{
            selectedPopUpNavItems: popUp,
            setSelectedPopUpNavItems: (items) => {
              setPopUp(items);
              mockSetSelectedPopUpNavItems(items);
            },
            selectedPanelNavItems: panel,
            setSelectedPanelNavItems: (items) => {
              setPanel(items);
              mockSetSelectedPanelNavItems(items);
            },
          }}
        >
          <Options title="Options" />
        </OptionsContext.Provider>
      );
    };

    const { rerender } = render(<TestWrapper />);

    // Click 'Ad Units' in the pop-up list (first list)
    const popUpItems = screen.getAllByText('Ad Units');
    const popUpAdUnitsItem = popUpItems[0].closest('li')!;

    // Toggle ON (add item)
    fireEvent.click(popUpAdUnitsItem);
    expect(mockSetSelectedPopUpNavItems).toHaveBeenCalledWith(['adUnits']);

    // Re-render wrapper with updated state
    selectedPopUp = ['adUnits'];
    rerender(<TestWrapper />);

    // Toggle OFF (remove item)
    fireEvent.click(popUpAdUnitsItem);
    expect(mockSetSelectedPopUpNavItems).toHaveBeenCalledWith([]);
  });

  it('toggles Panel nav item on and off (handleTogglePanel)', () => {
    let selectedPopUp: string[] = [];
    let selectedPanel: string[] = [];

    const TestWrapper = () => {
      const [popUp, setPopUp] = React.useState<string[]>(selectedPopUp);
      const [panel, setPanel] = React.useState<string[]>(selectedPanel);
      return (
        <OptionsContext.Provider
          value={{
            selectedPopUpNavItems: popUp,
            setSelectedPopUpNavItems: (items) => {
              setPopUp(items);
              mockSetSelectedPopUpNavItems(items);
            },
            selectedPanelNavItems: panel,
            setSelectedPanelNavItems: (items) => {
              setPanel(items);
              mockSetSelectedPanelNavItems(items);
            },
          }}
        >
          <Options title="Options" />
        </OptionsContext.Provider>
      );
    };

    const { rerender } = render(<TestWrapper />);

    // Click 'Ad Units' in the panel list (second list)
    const panelItems = screen.getAllByText('Ad Units');
    const panelAdUnitsItem = panelItems[1].closest('li')!;

    // Toggle ON (add item)
    fireEvent.click(panelAdUnitsItem);
    expect(mockSetSelectedPanelNavItems).toHaveBeenCalledWith(['adUnits']);

    // Re-render wrapper with updated state
    selectedPanel = ['adUnits'];
    rerender(<TestWrapper />);

    // Toggle OFF (remove item)
    fireEvent.click(panelAdUnitsItem);
    expect(mockSetSelectedPanelNavItems).toHaveBeenCalledWith([]);
  });

  it('saves selected items to chrome.storage.sync on form submission (handleSubmit)', () => {
    const contextValue = {
      selectedPopUpNavItems: ['adUnits', 'bids'],
      setSelectedPopUpNavItems: mockSetSelectedPopUpNavItems,
      selectedPanelNavItems: ['timeline'],
      setSelectedPanelNavItems: mockSetSelectedPanelNavItems,
    };

    render(
      <OptionsContext.Provider value={contextValue}>
        <Options title="Options" />
      </OptionsContext.Provider>
    );

    const saveButton = screen.getByRole('button', { name: /Save/i });
    fireEvent.click(saveButton);

    expect(chrome.storage.sync.set).toHaveBeenCalledTimes(2);
    expect(chrome.storage.sync.set).toHaveBeenNthCalledWith(
      1,
      { selectedPopUpNavItems: ['adUnits', 'bids'] },
      expect.any(Function)
    );
    expect(chrome.storage.sync.set).toHaveBeenNthCalledWith(
      2,
      { selectedPanelNavItems: ['timeline'] },
      expect.any(Function)
    );
  });

  it('resets selected items and clears chrome.storage.sync when Reset button is clicked (handleReset)', () => {
    const contextValue = {
      selectedPopUpNavItems: ['adUnits'],
      setSelectedPopUpNavItems: mockSetSelectedPopUpNavItems,
      selectedPanelNavItems: ['bids'],
      setSelectedPanelNavItems: mockSetSelectedPanelNavItems,
    };

    render(
      <OptionsContext.Provider value={contextValue}>
        <Options title="Options" />
      </OptionsContext.Provider>
    );

    const resetButton = screen.getByRole('button', { name: /Reset/i });
    fireEvent.click(resetButton);

    expect(mockSetSelectedPopUpNavItems).toHaveBeenCalledWith([]);
    expect(mockSetSelectedPanelNavItems).toHaveBeenCalledWith([]);
    expect(chrome.storage.sync.clear).toHaveBeenCalled();
    expect(window.location.reload).toHaveBeenCalled();
  });
});
