import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';

const preview = (value) => {
    if (value === null || value === undefined || value === '') return '—';
    const text = String(value).replace(/\n/g, ' · ');

    return text.length > 70 ? `${text.slice(0, 70)}…` : text;
};

export default function Index({ resource, records }) {
    const [order, setOrder] = useState(records);
    const [busy, setBusy] = useState(false);

    // Keep local order in sync when Inertia swaps in fresh records.
    if (records !== order && records.map((r) => r.id).join() !== order.map((r) => r.id).join()) {
        setOrder(records);
    }

    const move = (index, direction) => {
        const target = index + direction;
        if (target < 0 || target >= order.length) return;

        const next = [...order];
        [next[index], next[target]] = [next[target], next[index]];
        setOrder(next);

        setBusy(true);
        router.post(
            `/admin/${resource.key}/reorder`,
            { ids: next.map((record) => record.id) },
            { preserveScroll: true, onFinish: () => setBusy(false) },
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

            {order.length === 0 ? (
                <p className="rounded border border-dashed border-border px-4 py-10 text-center text-sm text-fg-dim">
                    Nothing here yet.
                </p>
            ) : (
                <div className="overflow-x-auto rounded-[10px] border border-border">
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
                                            <div className="flex gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => move(index, -1)}
                                                    disabled={index === 0 || busy}
                                                    aria-label={`Move up`}
                                                    className="rounded border border-border px-2 py-1 text-xs disabled:opacity-30"
                                                >
                                                    ↑
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => move(index, 1)}
                                                    disabled={index === order.length - 1 || busy}
                                                    aria-label={`Move down`}
                                                    className="rounded border border-border px-2 py-1 text-xs disabled:opacity-30"
                                                >
                                                    ↓
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
