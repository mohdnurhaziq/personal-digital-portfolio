import { router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { fileInputClass } from './fileInput';
import { focusDirectionAfterMove, movedStatus, moveItem } from './reorder';

const EMPTY_IMAGES = [];

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
export default function ImageCollectionField({ field, record, resourceKey, onPick }) {
    const images = record?.[field.name] ?? EMPTY_IMAGES;
    const [orderedImages, setOrderedImages] = useState(images);
    const [busy, setBusy] = useState(false);
    const [pending, setPending] = useState([]);
    const [announcement, setAnnouncement] = useState('');
    const focusTarget = useRef(null);

    const base = `/admin/${resourceKey}/${record?.id}/media`;

    // Previews are object URLs, which stay allocated until revoked.
    useEffect(() => () => pending.forEach((file) => URL.revokeObjectURL(file.preview)), [pending]);

    useEffect(() => {
        setOrderedImages(images);
    }, [images]);

    const restoreFocus = () => {
        const target = focusTarget.current;
        if (!target) return;

        requestAnimationFrame(() => {
            document
                .querySelector(
                    `[data-media-reorder-id="${target.id}"][data-reorder-direction="${target.direction}"]`,
                )
                ?.focus();
        });
    };

    const move = (index, direction) => {
        const result = moveItem(orderedImages, index, direction);
        if (!result || busy) return;

        const image = orderedImages[index];
        focusTarget.current = {
            id: image.id,
            direction: focusDirectionAfterMove(result.to, orderedImages.length, direction),
        };
        setOrderedImages(result.items);
        setAnnouncement(`Moving ${image.name}.`);

        setBusy(true);
        router.post(
            `${base}/reorder`,
            { ids: result.items.map((item) => item.id) },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () =>
                    setAnnouncement(movedStatus(image.name, result.to, orderedImages.length)),
                onError: () => {
                    setOrderedImages(images);
                    setAnnouncement(
                        `${image.name} could not be moved. The previous order was restored.`,
                    );
                },
                onFinish: () => {
                    setBusy(false);
                    restoreFocus();
                },
            },
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

        // Show the chosen files straight away. Without this the only feedback
        // is the filename strip the browser draws, which is easy to miss —
        // picking several images looked like nothing had happened at all.
        setPending(files.map((file) => ({ name: file.name, preview: URL.createObjectURL(file) })));
        onPick(files);
    };

    return (
        <div className="space-y-4">
            <p role="status" aria-live="polite" aria-atomic="true" className="sr-only">
                {announcement}
            </p>

            {orderedImages.length > 0 && (
                <ul aria-busy={busy} className="space-y-2">
                    {orderedImages.map((image, index) => (
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
                                <span
                                    id={`image-${image.id}-position`}
                                    className="sr-only"
                                >
                                    Position {index + 1} of {orderedImages.length}
                                </span>
                            </span>

                            <div className="flex shrink-0 items-center gap-1">
                                <button
                                    type="button"
                                    aria-label={`Move ${image.name} up`}
                                    aria-describedby={`image-${image.id}-position`}
                                    disabled={busy || index === 0}
                                    onClick={() => move(index, -1)}
                                    data-media-reorder-id={image.id}
                                    data-reorder-direction="up"
                                    className="rounded border border-border px-2 py-1 text-xs text-fg-dim hover:border-dev/60 hover:text-fg disabled:cursor-not-allowed disabled:opacity-30"
                                >
                                    <span aria-hidden="true">↑</span>
                                </button>
                                <button
                                    type="button"
                                    aria-label={`Move ${image.name} down`}
                                    aria-describedby={`image-${image.id}-position`}
                                    disabled={busy || index === orderedImages.length - 1}
                                    onClick={() => move(index, 1)}
                                    data-media-reorder-id={image.id}
                                    data-reorder-direction="down"
                                    className="rounded border border-border px-2 py-1 text-xs text-fg-dim hover:border-dev/60 hover:text-fg disabled:cursor-not-allowed disabled:opacity-30"
                                >
                                    <span aria-hidden="true">↓</span>
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
                className={fileInputClass}
                aria-describedby={field.help ? `${field.name}-help` : undefined}
                onChange={pick}
            />

            {pending.length > 0 && (
                <div className="rounded border border-dashed border-border p-3">
                    <p className="mb-2 text-xs text-dev-bright">
                        {pending.length} new image{pending.length === 1 ? '' : 's'} chosen — click
                        Save changes below to upload {pending.length === 1 ? 'it' : 'them'}.
                    </p>
                    <ul className="flex flex-wrap gap-2">
                        {pending.map((file) => (
                            <li key={file.preview}>
                                <img
                                    src={file.preview}
                                    alt={file.name}
                                    className="h-12 w-16 rounded object-cover opacity-70"
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {!record && (
                <p className="text-xs text-fg-dim">
                    Images can be reordered and deleted once the record has been saved.
                </p>
            )}
        </div>
    );
}
