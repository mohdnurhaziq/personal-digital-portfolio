import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            ssr: 'resources/js/ssr.jsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
    build: {
        rollupOptions: {
            output: {
                // Keep the WebGL/animation stack out of the entry chunk so first
                // paint doesn't wait on it (see "Performance" in portfolio-plan.md).
                // Vite 8 (rolldown) only accepts the function form here.
                manualChunks: (id) => {
                    if (!id.includes('node_modules')) return;
                    if (/[\\/](three|@react-three)[\\/]/.test(id)) return 'three';
                    if (/[\\/]gsap[\\/]/.test(id)) return 'gsap';
                },
            },
        },
    },
});
