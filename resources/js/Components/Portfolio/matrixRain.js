/**
 * Canvas-2D digit rain, ported from the reference design.
 *
 * Used at two intensities: a slow ambient drizzle inside the Programmer half of
 * the fork, and a fast full-screen curtain during the weekday transition.
 */
export function makeMatrixRain(canvas, options = {}) {
    const o = {
        fontSize: 16,
        bg: 'rgba(7,11,20,0.16)',
        leadColor: '#F5F7FA',
        trailColor: 'rgba(140,170,230,0.5)',
        leadChance: 0.93,
        chars: ['0', '1'],
        speed: 1,
        charChangeChance: 1,
        ...options,
    };

    const ctx = canvas.getContext('2d');
    let columns = [];
    let glyphs = [];
    let running = false;
    let rafId = null;

    const randChar = () => o.chars[Math.floor(Math.random() * o.chars.length)];

    function setup() {
        const w = canvas.clientWidth || canvas.width || 1;
        const h = canvas.clientHeight || canvas.height || 1;
        canvas.width = w;
        canvas.height = h;

        const n = Math.max(1, Math.floor(w / o.fontSize));
        // Start each column above the top edge so the rain eases in.
        columns = new Array(n).fill(0).map(() => Math.floor(Math.random() * -40));
        glyphs = new Array(n).fill(0).map(randChar);
    }

    function frame() {
        // Painting a translucent background instead of clearing is what leaves
        // the fading trail behind each glyph.
        ctx.fillStyle = o.bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = `${o.fontSize}px "JetBrains Mono Variable", monospace`;

        for (let i = 0; i < columns.length; i++) {
            if (Math.random() < o.charChangeChance) glyphs[i] = randChar();

            const x = i * o.fontSize;
            const y = columns[i] * o.fontSize;

            ctx.fillStyle = Math.random() > o.leadChance ? o.leadColor : o.trailColor;
            ctx.fillText(glyphs[i], x, y);

            if (y > canvas.height && Math.random() > 0.975) columns[i] = 0;
            columns[i] += o.speed;
        }

        if (running) rafId = requestAnimationFrame(frame);
    }

    return {
        setup,
        start() {
            if (running) return;
            running = true;
            frame();
        },
        stop() {
            running = false;
            if (rafId) cancelAnimationFrame(rafId);
            rafId = null;
        },
        fillSolid(color) {
            ctx.fillStyle = color;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        },
    };
}
