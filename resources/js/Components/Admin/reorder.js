export const moveItem = (items, index, direction) => {
    const target = index + direction;

    if (target < 0 || target >= items.length) return null;

    const reordered = [...items];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];

    return { items: reordered, from: index, to: target };
};

export const movedStatus = (label, position, total) =>
    `${label} moved to position ${position + 1} of ${total}.`;

export const focusDirectionAfterMove = (position, total, requestedDirection) => {
    if (position === 0) return 'down';
    if (position === total - 1) return 'up';

    return requestedDirection < 0 ? 'up' : 'down';
};
