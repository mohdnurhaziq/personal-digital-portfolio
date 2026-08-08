import { Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

/**
 * Admin chrome. Built on the site's own tokens rather than a generic admin
 * theme, so editing content happens in the same visual language as the site.
 */
export default function AdminLayout({ title, actions, children }) {
    const { adminNav, status, auth } = usePage().props;
    const current = typeof window !== 'undefined' ? window.location.pathname : '';
    const [flash, setFlash] = useState(status);

    // Re-show on each new flash, then fade out so it doesn't linger.
    useEffect(() => {
        setFlash(status);
        if (!status) return;

        const timer = setTimeout(() => setFlash(null), 4000);

        return () => clearTimeout(timer);
    }, [status]);

    const navItem = (href, label) => {
        const active = current === href || current.startsWith(`${href}/`);

        return (
            <Link
                key={href}
                href={href}
                className={`block rounded px-3 py-2 text-sm transition-colors ${
                    active
                        ? 'bg-dev/15 text-dev-bright'
                        : 'text-fg-dim hover:bg-panel hover:text-fg'
                }`}
            >
                {label}
            </Link>
        );
    };

    return (
        <div className="min-h-screen bg-base text-fg">
            <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-8 lg:flex-row">
                <aside className="lg:w-56 lg:shrink-0">
                    <Link href="/admin" className="font-mono text-[13px] tracking-[0.1em] text-fg">
                        HAZIQ <span className="text-fg-dim">/ ADMIN</span>
                    </Link>

                    <nav className="mt-6 space-y-0.5">
                        {navItem('/admin', 'Overview')}
                        {(adminNav ?? []).map((item) =>
                            navItem(`/admin/${item.key}`, item.label),
                        )}
                        {navItem('/admin/messages', 'Messages')}
                        {navItem('/admin/settings', 'Site settings')}
                    </nav>

                    <div className="mt-8 border-t border-border pt-4 text-xs text-fg-dim">
                        <p className="truncate">{auth?.user?.email}</p>
                        <div className="mt-2 flex gap-3">
                            <Link href="/" className="hover:text-fg">
                                View site
                            </Link>
                            <button
                                type="button"
                                onClick={() => router.post('/logout')}
                                className="hover:text-fg"
                            >
                                Log out
                            </button>
                        </div>
                    </div>
                </aside>

                <main className="min-w-0 flex-1">
                    <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
                        <h1 className="font-display text-2xl font-extrabold">{title}</h1>
                        {actions}
                    </header>

                    {flash && (
                        <p
                            role="status"
                            className="mb-6 rounded border border-dev/40 bg-dev/10 px-4 py-3 text-sm text-dev-bright"
                        >
                            {flash}
                        </p>
                    )}

                    {children}
                </main>
            </div>
        </div>
    );
}
