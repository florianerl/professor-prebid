import { describe, it, expect } from 'vitest';
import { EVENTS, CONSOLE_TOGGLE, PBJS_NAMESPACE_CHANGE, POPUP_LOADED, PAGES, replaceRuleTargets } from './constants';

describe('Shared Constants', () => {
    describe('EVENTS', () => {
        it('has all required event keys', () => {
            expect(EVENTS.REQUEST_CONSOLE_STATE).toBeDefined();
            expect(EVENTS.SEND_GAM_DETAILS_TO_BACKGROUND).toBeDefined();
            expect(EVENTS.SEND_PREBID_DETAILS_TO_BACKGROUND).toBeDefined();
            expect(EVENTS.SEND_TCF_DETAILS_TO_BACKGROUND).toBeDefined();
        });
    });

    describe('PAGES', () => {
        it('has expected page entries', () => {
            expect(PAGES.length).toBeGreaterThan(0);
            const labels = PAGES.map(p => p.label);
            expect(labels).toContain('Ad Units');
            expect(labels).toContain('Bids');
            expect(labels).toContain('Config');
            expect(labels).toContain('Timeline');
        });

        it('each page has required fields', () => {
            PAGES.forEach(page => {
                expect(page.label).toBeTruthy();
                expect(page.path).toBeDefined();
                expect(page.Icon).toBeDefined();
                expect(typeof page.beta).toBe('boolean');
            });
        });
    });

    describe('replaceRuleTargets', () => {
        it('includes banner, video, and native media types', () => {
            const mediaTypes = [...new Set(replaceRuleTargets.map(r => r.mediaType))];
            expect(mediaTypes).toContain('allMediaTypes');
            expect(mediaTypes).toContain('banner');
            expect(mediaTypes).toContain('video');
            expect(mediaTypes).toContain('native');
        });
    });

    describe('exported constants', () => {
        it('CONSOLE_TOGGLE is defined', () => {
            expect(CONSOLE_TOGGLE).toBe('PP_CONSOLE_STATE');
        });
        it('PBJS_NAMESPACE_CHANGE is defined', () => {
            expect(PBJS_NAMESPACE_CHANGE).toBe('PBJS_NAMESPACE_CHANGE');
        });
        it('POPUP_LOADED is defined', () => {
            expect(POPUP_LOADED).toBe('PP_POPUP_LOADED');
        });
    });
});
