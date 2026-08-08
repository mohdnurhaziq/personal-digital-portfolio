import { Link } from '@inertiajs/react';

export default function PageNav({ brand, mode, theme }) {
    return (
        <nav
            className={`flex items-center justify-between px-6 py-7 font-mono text-xs tracking-[0.08em] sm:px-12 ${theme.navMuted}`}
        >
            <span>
                <Link href="/" className={`transition-colors ${theme.accent}`}>
                    {brand}
                </Link>
                <span> / {mode}</span>
            </span>
            <Link href="/" className={`transition-opacity hover:opacity-70 ${theme.accent}`}>
                &larr; back to start
            </Link>
        </nav>
    );
}
