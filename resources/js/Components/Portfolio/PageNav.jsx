export default function PageNav({ brand, mode, theme, onBack }) {
    const handle = (event) => {
        // Modified clicks keep normal link behaviour (new tab, etc).
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
        event.preventDefault();
        onBack(event);
    };

    return (
        <nav
            className={`flex items-center justify-between px-6 py-7 font-mono text-xs tracking-[0.08em] sm:px-12 ${theme.navMuted}`}
        >
            <span>
                <a href="/" onClick={handle} className={`transition-colors ${theme.accent}`}>
                    {brand}
                </a>
                <span> / {mode}</span>
            </span>
            <a
                href="/"
                onClick={handle}
                className={`transition-opacity hover:opacity-70 ${theme.accent}`}
            >
                &larr; back to start
            </a>
        </nav>
    );
}
