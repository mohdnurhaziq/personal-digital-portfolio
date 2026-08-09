import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

const inputClass =
    'w-full rounded border border-border bg-panel px-3 py-2 text-sm text-fg focus:border-dev focus:ring-0';

const isFile = (setting) => setting.type === 'file';

const formatSize = (bytes) => {
    if (!bytes) return null;
    // Floor of 1 KB: a small file reading as "0 KB" looks like a failed upload.
    if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;

    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

export default function Settings({ groups }) {
    const all = groups.flatMap((group) => group.settings);

    const { data, setData, post, processing, errors, progress } = useForm({
        settings: Object.fromEntries(
            all.filter((s) => !isFile(s)).map((s) => [s.key, s.value ?? '']),
        ),
        // File settings are uploaded, not typed: they carry a File (or null)
        // and a removal flag rather than a value.
        uploads: Object.fromEntries(all.filter(isFile).map((s) => [s.key, null])),
        remove: Object.fromEntries(all.filter(isFile).map((s) => [s.key, false])),
        // Uploads mean multipart, and PHP does not parse multipart bodies on
        // PUT, so this posts with a method override. It has to live in the
        // form data — Inertia builds the request from there, not from options.
        _method: 'put',
    });

    const submit = (event) => {
        event.preventDefault();
        post('/admin/settings', { forceFormData: true });
    };

    const update = (key, value) => setData('settings', { ...data.settings, [key]: value });

    const renderField = (setting) => {
        const error = errors[`settings.${setting.key}`] ?? errors[`uploads.${setting.key}`];

        if (isFile(setting)) {
            return (
                <div className="space-y-3">
                    {setting.file && (
                        <p className="text-sm text-fg-dim">
                            <a
                                href={setting.file.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-dev-bright hover:underline"
                            >
                                {setting.file.name}
                            </a>
                            {[formatSize(setting.file.size), setting.file.uploaded_at]
                                .filter(Boolean)
                                .map((detail) => ` · ${detail}`)
                                .join('')}
                        </p>
                    )}

                    <input
                        id={setting.key}
                        name={setting.key}
                        type="file"
                        accept="application/pdf"
                        className={inputClass}
                        aria-describedby={`${setting.key}-help`}
                        onChange={(e) =>
                            setData('uploads', {
                                ...data.uploads,
                                [setting.key]: e.target.files[0] ?? null,
                            })
                        }
                    />

                    {setting.file && (
                        <label className="flex items-center gap-2 text-sm text-fg-dim">
                            <input
                                type="checkbox"
                                className="rounded border-border bg-panel text-dev focus:ring-0"
                                checked={data.remove[setting.key]}
                                onChange={(e) =>
                                    setData('remove', {
                                        ...data.remove,
                                        [setting.key]: e.target.checked,
                                    })
                                }
                            />
                            Remove the current file when saving
                        </label>
                    )}

                    <p id={`${setting.key}-help`} className="text-xs text-fg-dim">
                        PDF, up to 8 MB. Once uploaded it is served from <code>/resume</code> and
                        the Resume URL below is ignored.
                    </p>

                    {error && <p className="text-xs text-red-400">{error}</p>}
                </div>
            );
        }

        return (
            <>
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

                {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
            </>
        );
    };

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

                                    {renderField(setting)}
                                </div>
                            ))}
                        </div>
                    </section>
                ))}

                {progress && (
                    <progress value={progress.percentage} max="100" className="w-full">
                        {progress.percentage}%
                    </progress>
                )}

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
