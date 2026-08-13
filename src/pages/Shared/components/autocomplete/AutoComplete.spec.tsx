import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AutoComplete } from './AutoComplete';

describe('AutoComplete component', () => {
  it('renders textfield with placeholder and handles user typing', () => {
    const onQueryChange = vi.fn();
    render(<AutoComplete query="" onQueryChange={onQueryChange} placeholder="Search..." />);

    const input = screen.getByPlaceholderText('Search...');
    expect(input).toBeTruthy();

    fireEvent.change(input, { target: { value: 'bidder' } });
    expect(onQueryChange).toHaveBeenCalledWith('bidder');
  });

  it('handles option pick directly via onPick or onQueryChange', () => {
    const onPick = vi.fn();
    const onQueryChange = vi.fn();

    render(
      <AutoComplete
        query="bidder"
        onQueryChange={onQueryChange}
        onPick={onPick}
        placeholder="Search..."
        fieldKeys={['bidder']}
      />
    );

    const input = screen.getByPlaceholderText('Search...');
    fireEvent.change(input, { target: { value: 'bidder:rubicon' } });

    expect(onQueryChange).toHaveBeenCalledWith('bidder:rubicon');
  });

  it('renders help tooltip icon when query has keys or options', () => {
    render(
      <AutoComplete
        query="bidder:criteo AND size:"
        onQueryChange={vi.fn()}
        placeholder="Search..."
        options={['size:300x250']}
        fieldKeys={['bidder', 'size']}
      />
    );

    expect(screen.getByPlaceholderText('Search...')).toBeTruthy();
  });
});
