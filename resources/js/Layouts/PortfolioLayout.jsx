import { router } from '@inertiajs/react';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import BackgroundScene from '@/Components/Portfolio/BackgroundScene';
import CustomCursor from '@/Components/Portfolio/CustomCursor';
import { makeMatrixRain } from '@/Components/Portfolio/matrixRain';
import { runAperture, runMatrix } from '@/Components/Portfolio/transitions';
import usePrefersReducedMotion from '@/Components/Portfolio/usePrefersReducedMotion';

const PortfolioContext = createContext({
    navigate: () => {},
    setCursorTheme: () => {},
    setSceneVisible: () => {},
});

export const usePortfolio = () => useContext(PortfolioContext);

/**
 * Persistent chrome that has to survive Inertia visits: the 3D backdrop, the
 * custom cursor, and the two transition overlays.
 *
 * Keeping this mounted across navigations is what lets a transition play over
 * the top of an actual route change, so the cinematic fork still produces
 * shareable URLs rather than swapping sections on one page.
 */
export default function PortfolioLayout({ children, scene = true }) {
    const [cursorTheme, setCursorTheme] = useState('dev');
    // Taken as the initial value rather than set from a page effect: an effect
    // runs a beat too late, and by then BackgroundScene has already started
    // pulling in three. A path that never shows the scene has to say so before
    // the first render, not after it.
    const [sceneVisible, setSceneVisible] = useState(scene);
    const reducedMotion = usePrefersReducedMotion();

    const apertureRef = useRef(null);
    const matrixRef = useRef(null);
    const rainRef = useRef(null);
    const busyRef = useRef(false);

    useEffect(() => {
        if (!matrixRef.current) return;

        const rain = makeMatrixRain(matrixRef.current, {
            fontSize: 18,
            leadChance: 0.93,
        });
        rain.setup();
        rainRef.current = rain;

        const onResize = () => rain.setup();
        window.addEventListener('resize', onResize);

        return () => {
            window.removeEventListener('resize', onResize);
            rain.stop();
        };
    }, []);

    const navigate = useCallback(
        (href, { kind = 'matrix', origin } = {}) => {
            // Reduced motion, or a transition already in flight: just go.
            if (reducedMotion || busyRef.current) {
                router.visit(href);
                return;
            }

            busyRef.current = true;

            const visit = () =>
                new Promise((resolve) => {
                    router.visit(href, {
                        onFinish: () => {
                            window.scrollTo(0, 0);
                            resolve();
                        },
                    });
                });

            const done = () => {
                busyRef.current = false;
            };

            if (kind === 'aperture' && apertureRef.current) {
                const svg = apertureRef.current;

                runAperture({
                    svg,
                    blades: svg.querySelectorAll('polygon'),
                    ring: svg.querySelector('circle'),
                    x: origin?.x ?? window.innerWidth / 2,
                    y: origin?.y ?? window.innerHeight / 2,
                    onCovered: visit,
                }).then(done);

                return;
            }

            if (matrixRef.current && rainRef.current) {
                runMatrix({
                    canvas: matrixRef.current,
                    rain: rainRef.current,
                    onCovered: visit,
                }).then(done);

                return;
            }

            router.visit(href);
            done();
        },
        [reducedMotion],
    );

    return (
        <PortfolioContext.Provider value={{ navigate, setCursorTheme, setSceneVisible }}>
            <BackgroundScene visible={sceneVisible} />

            <div className="relative z-5">{children}</div>

            {/* Photographer transition: eight blades closing like a shutter. */}
            <svg
                ref={apertureRef}
                className="pointer-events-none fixed inset-0 z-200 hidden h-full w-full"
                aria-hidden="true"
            >
                {Array.from({ length: 8 }, (_, i) => (
                    <polygon key={i} fill="#070B14" />
                ))}
                <circle cx="0" cy="0" r="0" fill="none" stroke="#D4AF37" strokeWidth="2" strokeOpacity="0.7" />
            </svg>

            {/* Programmer transition: full-screen digit rain. */}
            <canvas
                ref={matrixRef}
                className="pointer-events-none fixed inset-0 z-200 hidden h-full w-full"
                aria-hidden="true"
            />

            <CustomCursor theme={cursorTheme} />
        </PortfolioContext.Provider>
    );
}
