import assert from 'node:assert/strict';
import test from 'node:test';
import { focusDirectionAfterMove, movedStatus, moveItem } from './reorder.js';

test('moveItem returns a reordered copy and the new position', () => {
    const original = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const result = moveItem(original, 1, -1);

    assert.deepEqual(result, {
        items: [{ id: 2 }, { id: 1 }, { id: 3 }],
        from: 1,
        to: 0,
    });
    assert.deepEqual(original, [{ id: 1 }, { id: 2 }, { id: 3 }]);
});

test('moveItem rejects moves outside the collection', () => {
    assert.equal(moveItem([{ id: 1 }], 0, -1), null);
    assert.equal(moveItem([{ id: 1 }], 0, 1), null);
});

test('movedStatus gives assistive technology useful position context', () => {
    assert.equal(movedStatus('Project Atlas', 1, 4), 'Project Atlas moved to position 2 of 4.');
});

test('focus moves to an enabled control at either boundary', () => {
    assert.equal(focusDirectionAfterMove(0, 4, -1), 'down');
    assert.equal(focusDirectionAfterMove(3, 4, 1), 'up');
    assert.equal(focusDirectionAfterMove(1, 4, -1), 'up');
});
