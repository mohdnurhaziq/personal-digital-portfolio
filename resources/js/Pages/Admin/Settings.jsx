import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

const inputClass =
    'w-full rounded border border-border bg-panel px-3 py-2 text-sm text-fg focus:border-dev focus:ring-0';

export default function Settings({ groups }) {
    const initial = Object.fromEntries(
        groups.flatMap((group) => group.settings.map((s) => [s.key, s.value ?? ''])),
    );

    const { data, setData, put, processing, errors } = useForm({ settings: initial });

    const submit = (event) => {
        event.preventDefault();
        put('/admin/settings');
    };

    const update = (key, value) =>
        setData('settings', { ...data.settings, [key]: value });

    return (
        <AdminLayout title="Site settings">
            <Head title="Site settings — Admin" />

            <p className="mb-6 max-w-2xl text-sm text-fg-dim">
                Copy used across the site: the welcome screen, both path intros, the About bios and
                the contact blurbs.
            </p>

            <form onSubmit={submit} className="max-w-2xl space-y-10">
                {groups.map((group) => (
                    <section key={group.key}>
                        <h2 className="mb-4 border-b border-border pb-2 font-display text-lg font-semibold text-dev-bright">
                            {group.label}
                        </h2>

                        <div className="space-y-5">
                            {group.settings.map((setting) => (
                                <div key={setting.key}>
                                    <label
                                        htmlFor={setting.key}
                                        className="mb-1.5 block text-sm font-medium text-fg"
                                    >
                                        {setting.label}
                                    </label>

                                    {setting.type === 'textarea' ? (
                                        <textarea
                                            id={setting.key}
                                            rows={3}
                                            className={inputClass}
                                            value={data.settings[setting.key] ?? ''}
                                            onChange={(e) => update(setting.key, e.target.value)}
                                        />
                                    ) : (
                                        <input
                                            id={setting.key}
                                            type={setting.type === 'email' ? 'email' : 'text'}
                                            className={inputClass}
                                            value={data.settings[setting.key] ?? ''}
                                            onChange={(e) => update(setting.key, e.target.value)}
                                        />
                                    )}

                                    {errors[`settings.${setting.key}`] && (
                                        <p className="mt-1.5 text-xs text-red-400">
                                            {errors[`settings.${setting.key}`]}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                ))}

                <div className="border-t border-border pt-6">
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded bg-fg px-4 py-2 text-sm font-medium text-base transition-opacity hover:opacity-90 disabled:opacity-50"
                    >
                        Save settings
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}
