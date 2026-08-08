const DURATION = 420;
const N_BLADES = 8;
// Overlapping each wedge past its own slice is what closes the seams between
// blades as they rotate shut.
const BLADE_ARC = (360 / N_BLADES) * 1.2;

const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function bladePolygons(cx, cy, innerRadius, outerRadius) {
    const step = 360 / N_BLADES;
    const polys = [];

    for (let i = 0; i < N_BLADES; i++) {
        const a0 = ((i * step) * Math.PI) / 180;
        const a1 = ((i * step + BLADE_ARC) * Math.PI) / 180;

        polys.push(
            [
                `${cx + innerRadius * Math.cos(a0)},${cy + innerRadius * Math.sin(a0)}`,
                `${cx + outerRadius * Math.cos(a0)},${cy + outerRadius * Math.sin(a0)}`,
                `${cx + outerRadius * Math.cos(a1)},${cy + outerRadius * Math.sin(a1)}`,
                `${cx + innerRadius * Math.cos(a1)},${cy + innerRadius * Math.sin(a1)}`,
            ].join(' '),
        );
    }

    return polys;
}

/**
 * Camera-aperture wipe for the photographer path: blades close over the screen
 * from the click point, the caller swaps content, then they open again.
 *
 * `onCovered` runs at the fully-closed moment; the promise resolves once the
 * blades have reopened.
 */
export function runAperture({ svg, blades, ring, x, y, onCovered }) {
    return new Promise((resolve) => {
        // Reach past the furthest corner so the blades always cover the screen.
        const outer =
            Math.hypot(
                Math.max(x, window.innerWidth - x),
                Math.max(y, window.innerHeight - y),
            ) * 1.15;

        const paint = (innerRadius) => {
            const polys = bladePolygons(x, y, innerRadius, outer);
            blades.forEach((blade, i) => blade.setAttribute('points', polys[i]));
            ring.setAttribute('cx', x);
            ring.setAttribute('cy', y);
            ring.setAttribute('r', innerRadius);
        };

        svg.style.display = 'block';

        const animate = (from, to, done) => {
            let start = null;

            const step = (ts) => {
                if (start === null) start = ts;
                const t = Math.min((ts - start) / DURATION, 1);
                const eased = easeInOutCubic(t);

                paint(from + (to - from) * eased);

                if (t < 1) requestAnimationFrame(step);
                else done();
            };

            requestAnimationFrame(step);
        };

        // Close: the clear centre shrinks to nothing.
        animate(outer, 0, async () => {
            await onCovered?.();

            // Open: the clear centre grows back past the corners.
            animate(0, outer, () => {
                svg.style.display = 'none';
                resolve();
            });
        });
    });
}

/**
 * Digit-rain curtain for the programmer path: fade a full-screen rain in, swap
 * content behind it, fade it back out.
 */
export function runMatrix({ canvas, rain, onCovered }) {
    return new Promise((resolve) => {
        canvas.style.transition = 'none';
        canvas.style.display = 'block';
        canvas.style.opacity = '0';

        rain.setup();
        // Fill first so the rain never fades in over a transparent canvas.
        rain.fillSolid('#070B14');
        rain.start();

        requestAnimationFrame(() => {
            canvas.style.transition = 'opacity 0.2s ease';
            canvas.style.opacity = '1';
        });

        setTimeout(async () => {
            await onCovered?.();

            setTimeout(() => {
                canvas.style.transition = 'opacity 0.45s ease';
                canvas.style.opacity = '0';

                setTimeout(() => {
                    rain.stop();
                    canvas.style.display = 'none';
                    resolve();
                }, 460);
            }, 150);
        }, 700);
    });
}

export { DURATION, N_BLADES };
