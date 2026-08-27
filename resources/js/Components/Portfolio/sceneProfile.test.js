import test from 'node:test';
import assert from 'node:assert/strict';
import { sceneProfileForDevice } from './sceneProfile.js';

test('mobile screens receive the lightweight animated scene', () => {
    assert.deepEqual(sceneProfileForDevice({ small: true }), {
        quality: 'mobile',
        particleCount: 650,
        dpr: 1,
        antialias: false,
        powerPreference: 'low-power',
    });
});

test('coarse pointers receive the lightweight scene at any viewport size', () => {
    assert.equal(sceneProfileForDevice({ coarse: true }).quality, 'mobile');
});

test('desktop screens retain the full-quality scene', () => {
    assert.deepEqual(sceneProfileForDevice(), {
        quality: 'desktop',
        particleCount: 1800,
        dpr: [1, 2],
        antialias: true,
        powerPreference: 'high-performance',
    });
});
