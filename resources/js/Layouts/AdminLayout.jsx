import { Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const navigationSections = [
    {
        key: 'dev',
        label: 'Programmer',
        context: 'Weekdays',
        labelClass: 'text-dev-bright',
        activeClass: 'bg-dev/15 text-dev-bright',
        hoverClass: 'hover:text-dev-bright',
    },
    {
        key: 'photo',
        label: 'Photographer',
        context: 'Weekends',
        labelClass: 'text-photo-bright',
        activeClass: 'bg-photo/10 text-photo-bright',
        hoverClass: 'hover:text-photo-bright',
    },
    {
        key: 'shared',
        label: 'Both paths',
        context: 'Shared content',
        labelClass: 'text-fg',
        activeClass: 'bg-panel text-fg',
        hoverClass: 'hover:text-fg',
    },
    {
        key: 'site',
        label: 'Site & admin',
        context: 'Global',
        labelClass: 'text-fg',
        activeClass: 'bg-panel text-fg',
        hoverClass: 'hover:text-fg',
        extraItems: [
            { href: '/admin/messages', label: 'Messages' },
            { href: '/admin/settings', label: 'Site settings' },
        ],
    },
];

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

    const navItem = (href, label, section = navigationSections[0]) => {
        const active = current === href || current.startsWith(`${href}/`);

        return (
            <Link
                key={href}
                href={href}
                className={`block rounded px-3 py-2 text-sm transition-colors ${
                    active
                        ? section.activeClass
                        : `text-fg-dim hover:bg-panel ${section.hoverClass}`
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

                    <nav className="mt-6" aria-label="Admin navigation">
                        {navItem('/admin', 'Overview')}

                        <div className="mt-6 space-y-6">
                            {navigationSections.map((section) => {
                                const resources = (adminNav ?? []).filter(
                                    (item) => item.section === section.key,
                                );
                                const items = [
                                    ...resources.map((item) => ({
                                        href: `/admin/${item.key}`,
                                        label: item.label,
                                    })),
                                    ...(section.extraItems ?? []),
                                ];

                                if (items.length === 0) return null;

                                return (
                                    <section
                                        key={section.key}
                                        aria-labelledby={`admin-nav-${section.key}`}
                                        className="border-l border-border pl-2"
                                    >
                                        <div className="mb-1.5 px-3">
                                            <p
                                                id={`admin-nav-${section.key}`}
                                                className={`font-mono text-[10px] tracking-[0.14em] uppercase ${section.labelClass}`}
                                            >
                                                {section.label}
                                            </p>
                                            <p className="mt-0.5 text-[10px] text-fg-dim">
                                                {section.context}
                                            </p>
                                        </div>

                                        <div className="space-y-0.5">
                                            {items.map((item) =>
                                                navItem(item.href, item.label, section),
                                            )}
                                        </div>
                                    </section>
                                );
                            })}
                        </div>
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
