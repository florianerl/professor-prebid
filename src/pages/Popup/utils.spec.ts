import { describe, it, expect } from 'vitest';
import { firstDifferent } from './utils';

describe('Popup utils', () => {
    describe('firstDifferent', () => {
        it('returns first item not in excludes', () => {
            expect(firstDifferent(['a', 'b', 'c'], ['a'])).toBe('b');
        });

        it('returns first item when no excludes match', () => {
            expect(firstDifferent(['x', 'y'], ['z'])).toBe('x');
        });

        it('returns undefined when all excluded', () => {
            expect(firstDifferent(['a'], ['a'])).toBeUndefined();
        });

        it('returns first when excludes is empty', () => {
            expect(firstDifferent(['a', 'b'], [])).toBe('a');
        });

        it('handles empty input', () => {
            expect(firstDifferent([], ['a'])).toBeUndefined();
        });
    });
});
