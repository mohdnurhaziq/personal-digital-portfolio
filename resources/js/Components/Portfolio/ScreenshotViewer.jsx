import { useEffect, useRef } from 'react';

/**
 * Full-size view of a project screenshot.
 *
 * Built on the native `<dialog>` element rather than a hand-rolled overlay:
 * showModal() gives the focus trap, the inert background, the Escape handler
 * and the backdrop for free, and all of them are things a bespoke version
 * tends to get subtly wrong.
 */
export default function ScreenshotViewer({ screenshots, index, title, onClose, onIndexChange }) {
    const ref = useRef(null);
    const open = index !== null;
    const current = open ? screenshots[index] : null;

    useEffect(() => {
        const dialog = ref.current;
        if (!dialog) return;

        if (open && !dialog.open) {
            dialog.showModal();
        } else if (!open && dialog.open) {
            dialog.close();
        }
    }, [open]);

    // Escape and the backdrop both fire the dialog's own close event, so the
    // parent's state is kept in step from one place.
    useEffect(() => {
        const dialog = ref.current;
        if (!dialog) return;

        const handle = () => onClose();
        dialog.addEventListener('close', handle);

        return () => dialog.removeEventListener('close', handle);
    }, [onClose]);

    const step = (direction) => {
        const next = (index + direction + screenshots.length) % screenshots.length;
        onIndexChange(next);
    };

    return (
        <dialog
            ref={ref}
            aria-label={`${title} screenshots`}
            className="max-h-[90vh] max-w-[90vw] bg-transparent backdrop:bg-black/80"
            // Clicking the backdrop lands on the dialog itself rather than its
            // contents, which is what makes this a reliable click-outside.
            onClick={(event) => {
                if (event.target === ref.current) onClose();
            }}
        >
            {current && (
                <figure className="m-0 flex flex-col items-center gap-4">
                    <img
                        src={current.image_url}
                        alt={`${title} — screenshot ${index + 1} of ${screenshots.length}`}
                        className="max-h-[75vh] w-auto max-w-full rounded"
                    />

                    <figcaption className="flex items-center gap-5 font-mono text-xs text-white">
                        {screenshots.length > 1 && (
                            <>
                                <button
                                    type="button"
                                    onClick={() => step(-1)}
                                    className="rounded border border-white/30 px-3 py-1.5 hover:border-white"
                                >
                                    ← Prev
                                </button>
                                <span aria-live="polite">
                                    {index + 1} / {screenshots.length}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => step(1)}
                                    className="rounded border border-white/30 px-3 py-1.5 hover:border-white"
                                >
                                    Next →
                                </button>
                            </>
                        )}

                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded border border-white/30 px-3 py-1.5 hover:border-white"
                        >
                            Close
                        </button>
                    </figcaption>
                </figure>
            )}
        </dialog>
    );
}
