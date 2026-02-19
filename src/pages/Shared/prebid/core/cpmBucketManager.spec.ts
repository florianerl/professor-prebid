import { describe, it, expect } from 'vitest';
import { getPriceBucketString, isValidPriceConfig } from './cpmBucketManager';

describe('cpmBucketManager', () => {
    describe('isValidPriceConfig', () => {
        it('returns false for empty config', () => {
            expect(isValidPriceConfig({} as any)).toBe(false);
        });
        it('returns false when buckets missing', () => {
            expect(isValidPriceConfig({ something: true } as any)).toBe(false);
        });
        it('returns false when bucket lacks max', () => {
            expect(isValidPriceConfig({ buckets: [{ increment: 0.1 }] } as any)).toBe(false);
        });
        it('returns false when bucket lacks increment', () => {
            expect(isValidPriceConfig({ buckets: [{ max: 20 }] } as any)).toBe(false);
        });
        it('returns true for valid config', () => {
            expect(isValidPriceConfig({ buckets: [{ max: 20, increment: 0.1 }] } as any)).toBe(true);
        });
    });

    describe('getPriceBucketString', () => {
        it('returns correct buckets for $1.25', () => {
            const result = getPriceBucketString('1.25', { buckets: [{ max: 20, increment: 0.01 }] } as any);
            expect(result.low).toBe('1.00');
            expect(result.med).toBe('1.20');
            expect(result.high).toBe('1.25');
            expect(result.custom).toBe('1.25');
        });

        it('returns correct buckets for $5.50', () => {
            const result = getPriceBucketString('5.50', { buckets: [{ max: 20, increment: 0.5 }] } as any);
            expect(result.low).toBe('5.00');
            expect(result.med).toBe('5.50');
        });

        it('caps at max for high CPMs', () => {
            const result = getPriceBucketString('25.00', { buckets: [{ max: 20, increment: 0.01 }] } as any);
            expect(result.high).toBe('20.00');
        });

        it('handles NaN cpm', () => {
            const result = getPriceBucketString('notanumber', { buckets: [{ max: 20, increment: 0.01 }] } as any);
            // NaN.toString() is 'NaN' which is not '', so it goes through getCpmStringValue
            // but parseFloat('notanumber') = NaN, Number(NaN) conditions evaluate to false
            expect(typeof result.low).toBe('string');
        });
    });
});
