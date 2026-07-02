import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('returns initial value immediately', () => {
        const { result } = renderHook(() => useDebounce('hello', 500));
        expect(result.current).toBe('hello');
    });

    it('updates value after delay', async () => {
        let value = 'initial';
        const { result, rerender } = renderHook(() => useDebounce(value, 500));

        expect(result.current).toBe('initial');

        value = 'updated';
        rerender();

        // Before timeout
        expect(result.current).toBe('initial');

        // Advance past delay
        act(() => {
            vi.advanceTimersByTime(600);
        });

        expect(result.current).toBe('updated');
    });

    it('resets timer on rapid value changes', () => {
        let value = 'a';
        const { result, rerender } = renderHook(() => useDebounce(value, 500));

        value = 'b';
        rerender();
        act(() => { vi.advanceTimersByTime(200); });

        value = 'c';
        rerender();
        act(() => { vi.advanceTimersByTime(200); });

        // Still initial because timer keeps resetting
        expect(result.current).toBe('a');

        // Now advance past the full delay
        act(() => { vi.advanceTimersByTime(500); });
        expect(result.current).toBe('c');
    });
});
