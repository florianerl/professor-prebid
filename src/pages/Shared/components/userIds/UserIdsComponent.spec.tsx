import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import UserIdsComponent from './UserIdsComponent';
import AppStateContext from '../../contexts/appStateContext';

import * as utils from '../../utils';

describe('UserIdsComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockContext: any = {
    prebid: {
      eids: [
        {
          source: 'criteo.com',
          uids: [{ id: 'criteo-user-id-123', atype: 1 }],
        },
      ],
      config: {
        userSync: {
          userIds: [
            {
              name: 'criteo',
              storage: { type: 'cookie', name: 'ct' },
            },
          ],
        },
      },
    },
  };

  it('renders tabs, headers and options autocomplete', () => {
    render(
      <AppStateContext.Provider value={mockContext}>
        <UserIdsComponent />
      </AppStateContext.Provider>
    );

    expect(screen.getByText('User IDs: 1')).toBeTruthy();
    expect(screen.getByText('Modules: 1')).toBeTruthy();
    expect(screen.getByText('criteo.com')).toBeTruthy();

    // Click Modules Tab
    const modulesTab = screen.getByText('Modules: 1');
    fireEvent.click(modulesTab);

    expect(screen.getByText('User ID Module')).toBeTruthy();

    // Switch back to User IDs Tab
    const userIdsTab = screen.getByText('User IDs: 1');
    fireEvent.click(userIdsTab);
    expect(screen.getByText('criteo.com')).toBeTruthy();
  });

  it('handles download button click', () => {
    const downloadSpy = vi.spyOn(utils, 'download').mockImplementation(() => {});
    render(
      <AppStateContext.Provider value={mockContext}>
        <UserIdsComponent />
      </AppStateContext.Provider>
    );

    const downloadBtn = screen.getByLabelText('Download User ID session data as JSON');
    fireEvent.click(downloadBtn);

    expect(downloadSpy).toHaveBeenCalled();
  });
});
