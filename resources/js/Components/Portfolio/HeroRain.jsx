import { useEffect, useRef } from 'react';
import { makeMatrixRain } from './matrixRain';
import usePrefersReducedMotion from './usePrefersReducedMotion';

/**
 * The slow ambient drizzle inside the Programmer half of the fork — the
 * photographer half's drifting polaroids are its counterpart.
 */
export default function HeroRain({ active }) {
    const canvasRef = useRef(null);
    const reducedMotion = usePrefersReducedMotion();

    useEffect(() => {
        if (!canvasRef.current || reducedMotion || !active) return;

        const rain = makeMatrixRain(canvasRef.current, {
            fontSize: 15,
            bg: 'rgba(7,11,20,0.14)',
            trailColor: 'rgba(140,170,230,0.4)',
            leadChance: 0.9,
            // Much slower than the transition curtain: this one has to sit
            // behind headline text without competing with it.
            speed: 0.16,
            charChangeChance: 0.03,
        });

        rain.setup();
        rain.start();

        const onResize = () => rain.setup();
        window.addEventListener('resize', onResize);

        return () => {
            window.removeEventListener('resize', onResize);
            rain.stop();
        };
    }, [active, reducedMotion]);

    if (reducedMotion) return null;

    return (
        <canvas
            ref={canvasRef}
            className="pointer-events-none absolute inset-0 -z-1 h-full w-full opacity-32"
            aria-hidden="true"
        />
    );
}
