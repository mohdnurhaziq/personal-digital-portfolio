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
                {/* First stop in the tab order, visible only once focused.
                    Without it, reaching the content past the nav and hero means
                    tabbing through both on every visit. */}
                <a
                    href="#content"
                    className={`sr-only focus:not-sr-only focus:mr-3 focus:inline-block focus:rounded focus:px-3 focus:py-1.5 ${theme.skipLink}`}
                >
                    Skip to content
                </a>
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
