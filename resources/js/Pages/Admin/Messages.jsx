import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Messages({ messages }) {
    return (
        <AdminLayout title="Messages">
            <Head title="Messages — Admin" />

            <p className="mb-6 max-w-2xl text-sm text-fg-dim">
                Enquiries sent through the contact form. These are also emailed — this copy is what
                survives if mail delivery fails.
            </p>

            {messages.length === 0 ? (
                <p className="rounded border border-dashed border-border px-4 py-10 text-center text-sm text-fg-dim">
                    No messages yet.
                </p>
            ) : (
                <ul className="space-y-4">
                    {messages.map((message) => (
                        <li
                            key={message.id}
                            className="rounded-[10px] border border-border bg-panel-glass p-5"
                        >
                            <div className="flex flex-wrap items-baseline justify-between gap-3">
                                <h2 className="font-display text-lg font-semibold text-dev-bright">
                                    {message.name}{' '}
                                    <a
                                        href={`mailto:${message.email}`}
                                        className="font-sans text-sm font-normal text-fg-dim hover:text-fg"
                                    >
                                        &lt;{message.email}&gt;
                                    </a>
                                </h2>
                                <span className="font-mono text-xs text-fg-dim">
                                    {message.path === 'photo' ? 'Photography' : 'Programmer'} ·{' '}
                                    {message.received}
                                </span>
                            </div>

                            <p className="mt-3 leading-relaxed whitespace-pre-line text-fg-dim">
                                {message.message}
                            </p>

                            <div className="mt-4 flex gap-4 text-sm">
                                <a
                                    href={`mailto:${message.email}`}
                                    className="text-dev-bright hover:underline"
                                >
                                    Reply
                                </a>
                                <button
                                    type="button"
                                    onClick={() =>
                                        router.delete(`/admin/messages/${message.id}`, {
                                            preserveScroll: true,
                                        })
                                    }
                                    className="text-fg-dim hover:text-fg"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </AdminLayout>
    );
}
