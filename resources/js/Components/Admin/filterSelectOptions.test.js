import assert from 'node:assert/strict';
import test from 'node:test';
import { filterOptions } from './filterSelectOptions.js';

const options = [
    { value: 'docker', label: 'Docker' },
    { value: 'amazonec2', label: 'AWS EC2' },
    { value: 'react', label: 'React' },
];

test('filterOptions matches labels without regard to case', () => {
    assert.deepEqual(filterOptions(options, 'DOCK'), [options[0]]);
});

test('filterOptions also matches the underlying icon slug', () => {
    assert.deepEqual(filterOptions(options, 'amazon'), [options[1]]);
});

test('filterOptions returns every option for an empty query', () => {
    assert.equal(filterOptions(options, '  '), options);
});
