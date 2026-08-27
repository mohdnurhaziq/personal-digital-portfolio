import assert from 'node:assert/strict';
import test from 'node:test';
import { isPhotoSectionEnabled } from './photographerSections.js';

test('photographer sections are visible by default', () => {
    assert.equal(isPhotoSectionEnabled({}, 'photo_section_gear_enabled'), true);
});

test('photographer sections can be enabled and disabled with stored flags', () => {
    assert.equal(
        isPhotoSectionEnabled({ photo_section_gear_enabled: '1' }, 'photo_section_gear_enabled'),
        true,
    );
    assert.equal(
        isPhotoSectionEnabled({ photo_section_gear_enabled: '0' }, 'photo_section_gear_enabled'),
        false,
    );
});
