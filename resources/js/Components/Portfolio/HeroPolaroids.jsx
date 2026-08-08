import usePrefersReducedMotion from './usePrefersReducedMotion';

/**
 * Ambient drifting polaroids behind the Photographer half of the fork — the
 * photo-side counterpart to the programmer half's digit rain.
 */
const POLAROIDS = [
    { className: 'w-22.5 h-27.5 top-[14%] left-[10%] animate-[flyA_15s_ease-in-out_infinite]' },
    {
        className:
            'w-17 h-21.5 top-[58%] left-[62%] animate-[flyB_19s_ease-in-out_infinite] opacity-75 blur-[0.5px]',
        style: { animationDelay: '-4s' },
    },
    {
        className: 'w-27 h-32.5 top-[32%] left-[52%] animate-[flyC_17s_ease-in-out_infinite]',
        style: { animationDelay: '-8s' },
    },
    {
        className:
            'w-14.5 h-18.5 top-[70%] left-[18%] animate-[flyD_21s_ease-in-out_infinite] opacity-65 blur-[0.8px]',
        style: { animationDelay: '-2s' },
    },
];

export default function HeroPolaroids() {
    const reducedMotion = usePrefersReducedMotion();

    if (reducedMotion) return null;

    return (
        <div className="pointer-events-none absolute inset-0 -z-1 overflow-hidden" aria-hidden="true">
            {POLAROIDS.map((polaroid, i) => (
                <div
                    key={i}
                    className={`polaroid absolute rounded ${polaroid.className}`}
                    style={polaroid.style}
                />
            ))}
        </div>
    );
}
