import { describe, it, expect } from 'vitest';
import {
    distinct,
    parseWidthHeightPair,
    replaceLastToken,
    getSortValue,
    getWidthXHeightStringFromBid,
    getAutocompleteOptions,
    createQueryEngine,
} from './utils';

describe('autocomplete/utils', () => {
    describe('distinct', () => {
        it('removes duplicates', () => {
            expect(distinct(['a', 'b', 'a'])).toEqual(['a', 'b']);
        });
        it('filters null/undefined', () => {
            expect(distinct(['a', null, undefined, 'b'])).toEqual(['a', 'b']);
        });
    });

    describe('parseWidthHeightPair', () => {
        it('parses "300x250"', () => {
            expect(parseWidthHeightPair('300x250')).toEqual({ w: 300, h: 250 });
        });
        it('returns null for invalid', () => {
            expect(parseWidthHeightPair('abc')).toBeNull();
        });
    });

    describe('replaceLastToken', () => {
        it('replaces last token', () => {
            expect(replaceLastToken('cpm:1 bidder', 'appnexus')).toBe('cpm:1 appnexus');
        });
        it('handles empty input', () => {
            expect(replaceLastToken('', 'test')).toBe('test');
        });
    });

    describe('getSortValue', () => {
        it('returns cpm for cpm key', () => {
            expect(getSortValue({ cpm: 2.5 }, 'cpm')).toBe(2.5);
        });
        it('returns area for size key', () => {
            expect(getSortValue({ width: 300, height: 250 }, 'size')).toBe(75000);
        });
        it('returns lowercase string for other keys', () => {
            expect(getSortValue({ bidder: 'AppNexus' }, 'bidder')).toBe('appnexus');
        });
    });

    describe('getWidthXHeightStringFromBid', () => {
        it('returns size property if exists', () => {
            expect(getWidthXHeightStringFromBid({ size: '300x250' } as any)).toBe('300x250');
        });
        it('builds from width/height', () => {
            expect(getWidthXHeightStringFromBid({ width: 728, height: 90 } as any)).toBe('728x90');
        });
        it('returns empty if nothing', () => {
            expect(getWidthXHeightStringFromBid({} as any)).toBe('');
        });
    });

    describe('getAutocompleteOptions', () => {
        it('returns key options for empty query', () => {
            const result = getAutocompleteOptions('', ['bidder', 'adunit']);
            expect(result.length).toBeGreaterThan(0);
        });
        it('filters keys by input', () => {
            const result = getAutocompleteOptions('bi', ['bidder', 'adunit']);
            expect(result).toContain('bidder');
            expect(result).not.toContain('adunit');
        });
    });

    describe('createQueryEngine', () => {
        const engine = createQueryEngine<{ name: string; cpm: number }>({
            name: (r) => r.name,
            cpm: (r) => r.cpm,
        });

        it('matches text search across all fields', () => {
            const predicate = engine.runQuery('appnexus');
            expect(predicate({ name: 'appnexus', cpm: 1.0 })).toBe(true);
            expect(predicate({ name: 'rubicon', cpm: 2.0 })).toBe(false);
        });

        it('matches key:value filter', () => {
            const predicate = engine.runQuery('name:rubicon');
            expect(predicate({ name: 'rubicon', cpm: 1.0 })).toBe(true);
            expect(predicate({ name: 'appnexus', cpm: 1.0 })).toBe(false);
        });

        it('supports numeric comparisons', () => {
            const predicate = engine.runQuery('cpm>1.5');
            expect(predicate({ name: 'a', cpm: 2.0 })).toBe(true);
            expect(predicate({ name: 'b', cpm: 1.0 })).toBe(false);
        });

        it('supports OR queries', () => {
            const predicate = engine.runQuery('appnexus OR rubicon');
            expect(predicate({ name: 'appnexus', cpm: 1 })).toBe(true);
            expect(predicate({ name: 'rubicon', cpm: 1 })).toBe(true);
            expect(predicate({ name: 'criteo', cpm: 1 })).toBe(false);
        });

        it('returns true for empty query', () => {
            const predicate = engine.runQuery('');
            expect(predicate({ name: 'anything', cpm: 0 })).toBe(true);
        });
    });
});
