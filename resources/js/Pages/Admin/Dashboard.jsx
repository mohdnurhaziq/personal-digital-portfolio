import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Dashboard({ resources }) {
    return (
        <AdminLayout title="Overview">
            <Head title="Admin" />

            <p className="mb-6 max-w-2xl text-sm text-fg-dim">
                Everything on the public site is editable here. Content still showing placeholder
                text is seeded sample data — replace it as the real content arrives.
            </p>

            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {resources.map((resource) => (
                    <li key={resource.key}>
                        <Link
                            href={`/admin/${resource.key}`}
                            className="block h-full rounded-[10px] border border-border bg-panel-glass p-5 transition-colors hover:border-dev"
                        >
                            <div className="flex items-baseline justify-between gap-3">
                                <h2 className="font-display text-lg font-semibold text-dev-bright">
                                    {resource.plural}
                                </h2>
                                <span className="font-mono text-xs text-fg-dim">
                                    {resource.count}
                                </span>
                            </div>
                            {resource.description && (
                                <p className="mt-2 text-sm leading-relaxed text-fg-dim">
                                    {resource.description}
                                </p>
                            )}
                        </Link>
                    </li>
                ))}
            </ul>
        </AdminLayout>
    );
}
