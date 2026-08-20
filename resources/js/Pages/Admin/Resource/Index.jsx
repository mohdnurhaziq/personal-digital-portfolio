import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    focusDirectionAfterMove,
    movedStatus,
    moveItem,
} from '@/Components/Admin/reorder';

const preview = (value) => {
    if (value === null || value === undefined || value === '') return '—';
    const text = String(value).replace(/\n/g, ' · ');

    return text.length > 70 ? `${text.slice(0, 70)}…` : text;
};

export default function Index({ resource, records }) {
    const [order, setOrder] = useState(records);
    const [busy, setBusy] = useState(false);
    const [announcement, setAnnouncement] = useState('');
    const focusTarget = useRef(null);

    // Keep local order in sync when Inertia swaps in fresh records.
    useEffect(() => {
        setOrder(records);
    }, [records]);

    // Inertia can commit fresh page props after its request callbacks finish.
    // Restore focus from an effect so it runs against the final rendered order,
    // not a button that navigation is about to replace.
    useEffect(() => {
        const target = focusTarget.current;
        if (busy || !target) return;

        const frame = requestAnimationFrame(() => {
            const button = document.querySelector(
                `[data-reorder-id="${target.id}"][data-reorder-direction="${target.direction}"]`,
            );

            if (button) {
                button.focus();
                focusTarget.current = null;
            }
        });

        return () => cancelAnimationFrame(frame);
    }, [busy, order]);

    const labelFor = (record) => {
        const value = record[resource.columns[0]];

        return value ? String(value) : `${resource.singular} ${record.id}`;
    };

    const move = (index, direction) => {
        const result = moveItem(order, index, direction);
        if (!result || busy) return;

        const record = order[index];
        const label = labelFor(record);
        focusTarget.current = {
            id: record.id,
            direction: focusDirectionAfterMove(result.to, order.length, direction),
        };
        setOrder(result.items);
        setAnnouncement(`Moving ${label}.`);

        setBusy(true);
        router.post(
            `/admin/${resource.key}/reorder`,
            { ids: result.items.map((item) => item.id) },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => setAnnouncement(movedStatus(label, result.to, order.length)),
                onError: () => {
                    setOrder(records);
                    setAnnouncement(`${label} could not be moved. The previous order was restored.`);
                },
                onFinish: () => {
                    setBusy(false);
                },
            },
        );
    };

    const remove = (record) => {
        router.delete(`/admin/${resource.key}/${record.id}`, { preserveScroll: true });
    };

    return (
        <AdminLayout
            title={resource.plural}
            actions={
                <Link
                    href={`/admin/${resource.key}/create`}
                    className="rounded bg-fg px-4 py-2 text-sm font-medium text-base transition-opacity hover:opacity-90"
                >
                    Add {resource.singular.toLowerCase()}
                </Link>
            }
        >
            <Head title={`${resource.plural} — Admin`} />

            {resource.description && (
                <p className="mb-6 max-w-2xl text-sm text-fg-dim">{resource.description}</p>
            )}

            {resource.sortable && order.length > 1 && (
                <p className="mb-4 text-xs text-fg-dim">
                    Use the Move up and Move down buttons to change the order. Changes save
                    automatically.
                </p>
            )}

            <p role="status" aria-live="polite" aria-atomic="true" className="sr-only">
                {announcement}
            </p>

            {order.length === 0 ? (
                <p className="rounded border border-dashed border-border px-4 py-10 text-center text-sm text-fg-dim">
                    Nothing here yet.
                </p>
            ) : (
                <div
                    aria-busy={busy}
                    className="overflow-x-auto rounded-[10px] border border-border"
                >
                    <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
                        <thead>
                            <tr className="border-b border-border text-xs tracking-wide text-fg-dim uppercase">
                                {resource.sortable && <th className="w-24 px-4 py-3">Order</th>}
                                {resource.columns.map((column) => (
                                    <th key={column} className="px-4 py-3 font-medium">
                                        {resource.fields.find((f) => f.name === column)?.label ??
                                            column}
                                    </th>
                                ))}
                                <th className="px-4 py-3 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.map((record, index) => (
                                <tr
                                    key={record.id}
                                    className="border-b border-border/60 last:border-0"
                                >
                                    {resource.sortable && (
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1">
                                                <span
                                                    id={`record-${record.id}-position`}
                                                    className="mr-1 min-w-5 text-center text-xs tabular-nums text-fg-dim"
                                                >
                                                    {index + 1}
                                                    <span className="sr-only">
                                                        {' '}
                                                        of {order.length}: {labelFor(record)}
                                                    </span>
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => move(index, -1)}
                                                    disabled={index === 0 || busy}
                                                    aria-label={`Move ${labelFor(record)} up`}
                                                    aria-describedby={`record-${record.id}-position`}
                                                    data-reorder-id={record.id}
                                                    data-reorder-direction="up"
                                                    className="rounded border border-border px-2 py-1 text-xs hover:border-dev/60 hover:text-dev-bright disabled:cursor-not-allowed disabled:opacity-30"
                                                >
                                                    <span aria-hidden="true">↑</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => move(index, 1)}
                                                    disabled={index === order.length - 1 || busy}
                                                    aria-label={`Move ${labelFor(record)} down`}
                                                    aria-describedby={`record-${record.id}-position`}
                                                    data-reorder-id={record.id}
                                                    data-reorder-direction="down"
                                                    className="rounded border border-border px-2 py-1 text-xs hover:border-dev/60 hover:text-dev-bright disabled:cursor-not-allowed disabled:opacity-30"
                                                >
                                                    <span aria-hidden="true">↓</span>
                                                </button>
                                            </div>
                                        </td>
                                    )}

                                    {resource.columns.map((column) => {
                                        const field = resource.fields.find(
                                            (f) => f.name === column,
                                        );

                                        return (
                                            <td key={column} className="px-4 py-3">
                                                {field?.type === 'image' ? (
                                                    record[column] ? (
                                                        <img
                                                            src={record[column]}
                                                            alt=""
                                                            className="h-12 w-12 rounded object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-fg-dim">—</span>
                                                    )
                                                ) : (
                                                    preview(record[column])
                                                )}
                                            </td>
                                        );
                                    })}

                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-3">
                                            <Link
                                                href={`/admin/${resource.key}/${record.id}/edit`}
                                                className="text-dev-bright hover:underline"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => remove(record)}
                                                className="text-fg-dim hover:text-fg"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </AdminLayout>
    );
}
