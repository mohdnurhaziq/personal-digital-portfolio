import { useState } from 'react';
import ScreenshotViewer from './ScreenshotViewer';

/**
 * A project's screenshots on its card: the first one large, the rest as a row
 * of thumbnails, any of them opening the full-size viewer.
 *
 * Not every project can be linked to — internal tools, work behind a login,
 * clients who would rather not be demoed — so for many of them this is the
 * only evidence the thing exists.
 */
export default function ScreenshotStrip({ screenshots = [], title, theme }) {
    const [index, setIndex] = useState(null);

    if (screenshots.length === 0) {
        return null;
    }

    const [primary, ...rest] = screenshots;

    return (
        <>
            <div className="mb-4">
                <button
                    type="button"
                    onClick={() => setIndex(0)}
                    aria-haspopup="dialog"
                    className={`block w-full overflow-hidden rounded border ${theme.card} cursor-pointer`}
                >
                    <img
                        src={primary.thumb_url}
                        // The card already carries the project title as its
                        // heading, so naming the picture again would just make
                        // a screen reader say it twice.
                        alt={`Screenshot of ${title}`}
                        loading="lazy"
                        className="aspect-video w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                    />
                </button>

                {rest.length > 0 && (
                    <ul className="mt-2 flex flex-wrap gap-2">
                        {rest.map((shot, position) => (
                            <li key={shot.id}>
                                <button
                                    type="button"
                                    onClick={() => setIndex(position + 1)}
                                    aria-haspopup="dialog"
                                    className="block overflow-hidden rounded border border-border"
                                >
                                    <img
                                        src={shot.thumb_url}
                                        alt={`${title} — screenshot ${position + 2}`}
                                        loading="lazy"
                                        className="h-12 w-16 object-cover"
                                    />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <ScreenshotViewer
                screenshots={screenshots}
                index={index}
                title={title}
                onClose={() => setIndex(null)}
                onIndexChange={setIndex}
            />
        </>
    );
}
