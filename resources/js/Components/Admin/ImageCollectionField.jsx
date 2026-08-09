import { router } from '@inertiajs/react';
import { useState } from 'react';

/**
 * A hand-ordered set of uploaded images.
 *
 * Adding happens on save with the rest of the form, because the files ride
 * along in the same multipart body. Removing and reordering act on a single
 * image and go straight to their own endpoints — making someone submit the
 * whole form to delete one picture would be a strange way to ask.
 *
 * Ordering uses buttons rather than drag-and-drop, for the same reason the
 * record lists do: dragging works with neither a keyboard nor a touchscreen.
 */
export default function ImageCollectionField({ field, record, resourceKey, inputClass, onPick }) {
    const images = record?.[field.name] ?? [];
    const [busy, setBusy] = useState(false);
    const [pending, setPending] = useState([]);

    const base = `/admin/${resourceKey}/${record?.id}/media`;

    const move = (index, direction) => {
        const next = [...images];
        const target = index + direction;

        if (target < 0 || target >= next.length) return;

        [next[index], next[target]] = [next[target], next[index]];

        setBusy(true);
        router.post(
            `${base}/reorder`,
            { ids: next.map((image) => image.id) },
            { preserveScroll: true, onFinish: () => setBusy(false) },
        );
    };

    const remove = (image) => {
        setBusy(true);
        router.delete(`${base}/${image.id}`, {
            preserveScroll: true,
            onFinish: () => setBusy(false),
        });
    };

    const pick = (event) => {
        const files = Array.from(event.target.files ?? []);
        setPending(files.map((file) => file.name));
        onPick(files);
    };

    return (
        <div className="space-y-4">
            {images.length > 0 && (
                <ul className="space-y-2">
                    {images.map((image, index) => (
                        <li
                            key={image.id}
                            className="flex items-center gap-3 rounded border border-border bg-panel p-2"
                        >
                            <img
                                src={image.thumb_url}
                                alt=""
                                className="h-14 w-20 shrink-0 rounded object-cover"
                            />

                            <span className="min-w-0 flex-1 truncate text-xs text-fg-dim">
                                {image.name}
                                {index === 0 && (
                                    <span className="ml-2 rounded-full border border-border px-2 py-0.5 text-[10px] text-dev-bright">
                                        first
                                    </span>
                                )}
                            </span>

                            <div className="flex shrink-0 items-center gap-1">
                                <button
                                    type="button"
                                    aria-label={`Move ${image.name} up`}
                                    disabled={busy || index === 0}
                                    onClick={() => move(index, -1)}
                                    className="rounded border border-border px-2 py-1 text-xs text-fg-dim hover:text-fg disabled:opacity-30"
                                >
                                    ↑
                                </button>
                                <button
                                    type="button"
                                    aria-label={`Move ${image.name} down`}
                                    disabled={busy || index === images.length - 1}
                                    onClick={() => move(index, 1)}
                                    className="rounded border border-border px-2 py-1 text-xs text-fg-dim hover:text-fg disabled:opacity-30"
                                >
                                    ↓
                                </button>
                                <button
                                    type="button"
                                    aria-label={`Delete ${image.name}`}
                                    disabled={busy}
                                    onClick={() => remove(image)}
                                    className="rounded border border-border px-2 py-1 text-xs text-red-400 hover:text-red-300 disabled:opacity-30"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <input
                id={field.name}
                name={field.name}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                className={inputClass}
                aria-describedby={field.help ? `${field.name}-help` : undefined}
                onChange={pick}
            />

            {pending.length > 0 && (
                <p className="text-xs text-fg-dim">
                    {pending.length} file{pending.length === 1 ? '' : 's'} ready to upload — they
                    are added when you save.
                </p>
            )}

            {!record && (
                <p className="text-xs text-fg-dim">
                    Images can be reordered and deleted once the record has been saved.
                </p>
            )}
        </div>
    );
}
