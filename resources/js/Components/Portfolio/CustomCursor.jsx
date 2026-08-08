import { useEffect, useRef, useState } from 'react';
import usePrefersReducedMotion from './usePrefersReducedMotion';

/**
 * Dot + trailing ring, themed per path.
 *
 * The ring uses mix-blend-mode: difference while idle so it stays visible over
 * any background. That blend has to be switched off on hover, though — it
 * distorts a solid brand colour into something else entirely, which is why the
 * themed blue/gold never actually looked blue or gold in the first attempt
 * (documented in portfolio-plan.md).
 */
export default function CustomCursor({ theme = 'dev' }) {
    const dotRef = useRef(null);
    const ringRef = useRef(null);
    const [hovering, setHovering] = useState(false);
    const [enabled, setEnabled] = useState(false);
    const reducedMotion = usePrefersReducedMotion();

    useEffect(() => {
        // Touch devices have no cursor to replace, and swapping it out there
        // would just hide the pointer for stylus users.
        const fine = window.matchMedia('(pointer: fine)');
        const update = () => setEnabled(fine.matches && !reducedMotion);

        update();
        fine.addEventListener('change', update);

        return () => fine.removeEventListener('change', update);
    }, [reducedMotion]);

    useEffect(() => {
        if (!enabled) {
            document.body.classList.remove('has-custom-cursor');
            return;
        }

        document.body.classList.add('has-custom-cursor');

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let ringX = mouseX;
        let ringY = mouseY;
        let rafId;

        const onMove = (event) => {
            mouseX = event.clientX;
            mouseY = event.clientY;

            if (dotRef.current) {
                dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
            }

            // Anything interactive grows the ring. Checked on the event target
            // so it keeps working for content Inertia swaps in later.
            const interactive = event.target.closest?.(
                'a, button, [role="radio"], input, textarea, select, .hoverable',
            );
            setHovering(Boolean(interactive));
        };

        const loop = () => {
            // Easing toward the pointer is what gives the ring its lag.
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;

            if (ringRef.current) {
                ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
            }

            rafId = requestAnimationFrame(loop);
        };

        window.addEventListener('mousemove', onMove);
        rafId = requestAnimationFrame(loop);

        return () => {
            window.removeEventListener('mousemove', onMove);
            cancelAnimationFrame(rafId);
            document.body.classList.remove('has-custom-cursor');
        };
    }, [enabled]);

    if (!enabled) return null;

    const isPhoto = theme === 'photo';

    return (
        <>
            <div
                ref={dotRef}
                className="pointer-events-none fixed top-0 left-0 z-[260] size-1.5 rounded-full bg-white-soft mix-blend-difference"
                aria-hidden="true"
            />
            <div
                ref={ringRef}
                aria-hidden="true"
                className={`pointer-events-none fixed top-0 left-0 z-[260] rounded-full border transition-[width,height,border-color] duration-200 ${
                    hovering
                        ? // Blend mode back to normal so the accent reads true.
                          `size-15 mix-blend-normal ${
                              isPhoto
                                  ? 'border-transparent'
                                  : 'animate-[cursorPulse_1s_steps(2,jump-none)_infinite] border-dev-bright'
                          }`
                        : 'size-8 border-fg mix-blend-difference'
                }`}
            >
                {/* Photographer path swaps the ring for viewfinder corner
                    brackets, static like a camera's AF box. */}
                {isPhoto &&
                    ['tl', 'tr', 'bl', 'br'].map((corner) => (
                        <span
                            key={corner}
                            className={`absolute size-3 border-photo-deep transition-opacity duration-200 ${
                                hovering ? 'opacity-100' : 'opacity-0'
                            } ${
                                {
                                    tl: '-top-px -left-px border-t-[1.5px] border-l-[1.5px]',
                                    tr: '-top-px -right-px border-t-[1.5px] border-r-[1.5px]',
                                    bl: '-bottom-px -left-px border-b-[1.5px] border-l-[1.5px]',
                                    br: '-right-px -bottom-px border-r-[1.5px] border-b-[1.5px]',
                                }[corner]
                            }`}
                        />
                    ))}
            </div>
        </>
    );
}
