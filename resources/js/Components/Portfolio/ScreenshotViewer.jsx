import { useEffect, useRef } from 'react';
import { FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';

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
            className="m-0 h-[100dvh] w-screen max-h-none max-w-none overflow-hidden bg-transparent p-0 text-white backdrop:bg-[#02050b]/95"
            // Clicking the backdrop lands on the dialog itself rather than its
            // contents, which is what makes this a reliable click-outside.
            onClick={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
            onKeyDown={(event) => {
                if (screenshots.length < 2) return;

                if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                    event.preventDefault();
                    step(event.key === 'ArrowLeft' ? -1 : 1);
                }
            }}
        >
            {current && (
                <div
                    className="relative flex size-full items-center justify-center px-4 py-18 sm:px-20 sm:py-16 lg:px-28"
                    onClick={(event) => {
                        if (event.target === event.currentTarget) onClose();
                    }}
                >
                    <figure className="m-0 flex max-h-full max-w-full items-center justify-center">
                        <img
                            src={current.image_url}
                            alt={`${title} — screenshot ${index + 1} of ${screenshots.length}`}
                            className="block max-h-[calc(100dvh-9rem)] max-w-[calc(100vw-2rem)] rounded-lg border border-white/10 object-contain shadow-[0_24px_80px_rgba(0,0,0,0.55)] sm:max-w-[calc(100vw-10rem)] lg:max-w-[calc(100vw-14rem)]"
                        />

                        <figcaption className="absolute inset-x-4 bottom-4 flex justify-center sm:bottom-5">
                            <div className="flex max-w-full items-center gap-3 rounded-full border border-white/15 bg-[#080d16]/90 px-4 py-2 font-mono text-[11px] shadow-xl backdrop-blur-md">
                                <span className="max-w-[55vw] truncate text-white/80">{title}</span>
                                <span className="h-3 w-px bg-white/20" aria-hidden="true" />
                                <span className="shrink-0 text-white/55" aria-live="polite">
                                    {index + 1} / {screenshots.length}
                                </span>
                            </div>
                        </figcaption>
                    </figure>

                    {screenshots.length > 1 && (
                        <>
                            <button
                                type="button"
                                onClick={() => step(-1)}
                                aria-label="Previous screenshot"
                                className="absolute left-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[#080d16]/85 text-white/75 shadow-lg backdrop-blur-md transition hover:border-white/35 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:left-6 sm:size-11"
                            >
                                <FiChevronLeft className="size-5" aria-hidden="true" />
                            </button>
                            <button
                                type="button"
                                onClick={() => step(1)}
                                aria-label="Next screenshot"
                                className="absolute right-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[#080d16]/85 text-white/75 shadow-lg backdrop-blur-md transition hover:border-white/35 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:right-6 sm:size-11"
                            >
                                <FiChevronRight className="size-5" aria-hidden="true" />
                            </button>
                        </>
                    )}

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close screenshot viewer"
                        className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full border border-white/15 bg-[#080d16]/85 text-white/70 shadow-lg backdrop-blur-md transition hover:border-white/35 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:right-6 sm:top-5"
                    >
                        <FiX className="size-5" aria-hidden="true" />
                    </button>
                </div>
            )}
        </dialog>
    );
}
