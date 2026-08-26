import { Head, useForm } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { fileInputClass } from '@/Components/Admin/fileInput';

const inputClass =
    'w-full rounded border border-border bg-panel px-3 py-2 text-sm text-fg focus:border-dev focus:ring-0';

const isUpload = (setting) => setting.type === 'file' || setting.type === 'image';

const sectionDefinitions = [
    {
        key: 'programmer',
        label: 'Programmer',
        eyebrow: 'Weekday portfolio',
        description: 'Page intro, AI workflow, about section, resume, and contact copy.',
        groups: ['dev'],
        activeClass: 'border-dev/60 bg-dev/10',
        accentClass: 'text-dev-bright',
        markerClass: 'bg-dev-bright',
    },
    {
        key: 'photographer',
        label: 'Photographer',
        eyebrow: 'Weekend portfolio',
        description: 'Page intro, photographer bio, booking details, and contact copy.',
        groups: ['photo'],
        activeClass: 'border-photo/60 bg-photo/10',
        accentClass: 'text-photo-bright',
        markerClass: 'bg-photo',
    },
    {
        key: 'shared',
        label: 'Shared site',
        eyebrow: 'Both paths',
        description: 'Welcome screen, identity, contact email, and search metadata.',
        groups: ['welcome', 'meta'],
        activeClass: 'border-fg-dim/60 bg-panel',
        accentClass: 'text-fg',
        markerClass: 'bg-fg-dim',
    },
];

const formatSize = (bytes) => {
    if (!bytes) return null;
    // Floor of 1 KB: a small file reading as "0 KB" looks like a failed upload.
    if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;

    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

export default function Settings({ groups }) {
    const [activeSection, setActiveSection] = useState('programmer');
    const all = useMemo(() => groups.flatMap((group) => group.settings), [groups]);
    const sections = useMemo(
        () =>
            sectionDefinitions
                .map((section) => ({
                    ...section,
                    contentGroups: groups.filter((group) => section.groups.includes(group.key)),
                }))
                .filter((section) => section.contentGroups.length > 0),
        [groups],
    );
    const sectionBySetting = useMemo(
        () =>
            Object.fromEntries(
                sections.flatMap((section) =>
                    section.contentGroups.flatMap((group) =>
                        group.settings.map((setting) => [setting.key, section.key]),
                    ),
                ),
            ),
        [sections],
    );

    const { data, setData, post, processing, errors, progress } = useForm({
        settings: Object.fromEntries(
            all.filter((s) => !isUpload(s)).map((s) => [s.key, s.value ?? '']),
        ),
        // File & image settings are uploaded, not typed: they carry a File (or null)
        // and a removal flag rather than a value.
        uploads: Object.fromEntries(all.filter(isUpload).map((s) => [s.key, null])),
        remove: Object.fromEntries(all.filter(isUpload).map((s) => [s.key, false])),
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

    useEffect(() => {
        const firstFieldError = Object.keys(errors)
            .map((key) => key.split('.')[1])
            .find((key) => sectionBySetting[key]);

        if (firstFieldError) {
            setActiveSection(sectionBySetting[firstFieldError]);
        }
    }, [errors, sectionBySetting]);

    const sectionHasErrors = (section) =>
        Object.keys(errors).some((key) => sectionBySetting[key.split('.')[1]] === section.key);

    const renderField = (setting) => {
        const error = errors[`settings.${setting.key}`] ?? errors[`uploads.${setting.key}`];

        if (setting.type === 'image') {
            return (
                <div className="space-y-3">
                    {setting.file && (
                        <div className="flex items-center gap-4">
                            <img
                                src={setting.file.thumb_url || setting.file.url}
                                alt={setting.label}
                                className="aspect-3/4 w-20 rounded border border-border object-cover"
                            />
                            <div className="text-sm text-fg-dim">
                                <p className="font-medium text-fg">{setting.file.name}</p>
                                <p className="text-xs">
                                    {[formatSize(setting.file.size), setting.file.uploaded_at]
                                        .filter(Boolean)
                                        .join(' · ')}
                                </p>
                            </div>
                        </div>
                    )}

                    <input
                        id={setting.key}
                        name={setting.key}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className={fileInputClass}
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
                            Remove the current photo when saving
                        </label>
                    )}

                    <p id={`${setting.key}-help`} className="text-xs text-fg-dim">
                        JPG, PNG, or WebP, up to 8 MB. Displayed next to your bio.
                    </p>

                    {error && <p className="text-xs text-red-400">{error}</p>}
                </div>
            );
        }

        if (setting.type === 'file') {
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
                        className={fileInputClass}
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

            <p className="mb-6 max-w-3xl text-sm text-fg-dim">
                Choose the part of the portfolio you want to edit. Shared site settings apply to
                both paths.
            </p>

            <div
                role="tablist"
                aria-label="Portfolio settings sections"
                className="mb-8 grid max-w-4xl gap-3 md:grid-cols-3"
            >
                {sections.map((section) => {
                    const selected = section.key === activeSection;
                    const hasErrors = sectionHasErrors(section);

                    return (
                        <button
                            key={section.key}
                            id={`settings-tab-${section.key}`}
                            type="button"
                            role="tab"
                            aria-selected={selected}
                            aria-controls={`settings-panel-${section.key}`}
                            onClick={() => setActiveSection(section.key)}
                            className={`group rounded border p-4 text-left transition-colors ${
                                selected
                                    ? section.activeClass
                                    : 'border-border bg-base hover:border-fg-dim/60 hover:bg-panel/60'
                            }`}
                        >
                            <span className="flex items-center justify-between gap-3">
                                <span
                                    className={`font-mono text-[10px] tracking-[0.14em] uppercase ${
                                        selected ? section.accentClass : 'text-fg-dim'
                                    }`}
                                >
                                    {section.eyebrow}
                                </span>
                                <span
                                    aria-hidden="true"
                                    className={`h-2 w-2 rounded-full ${section.markerClass}`}
                                />
                            </span>
                            <span className="mt-2 block font-display text-lg font-semibold text-fg">
                                {section.label}
                            </span>
                            <span className="mt-1 block text-xs leading-5 text-fg-dim">
                                {section.description}
                            </span>
                            {hasErrors && (
                                <span className="mt-3 inline-block text-xs font-medium text-red-400">
                                    Needs attention
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            <form onSubmit={submit} className="max-w-3xl space-y-8">
                {sections.map((section) => (
                    <section
                        key={section.key}
                        id={`settings-panel-${section.key}`}
                        role="tabpanel"
                        aria-labelledby={`settings-tab-${section.key}`}
                        hidden={activeSection !== section.key}
                        className="space-y-8"
                    >
                        <header className="border-b border-border pb-4">
                            <p
                                className={`font-mono text-[11px] tracking-[0.14em] uppercase ${section.accentClass}`}
                            >
                                {section.eyebrow}
                            </p>
                            <h2 className="mt-1 font-display text-2xl font-semibold text-fg">
                                {section.label} settings
                            </h2>
                            <p className="mt-1 max-w-2xl text-sm text-fg-dim">
                                {section.description}
                            </p>
                        </header>

                        {section.contentGroups.map((group) => (
                            <div key={group.key}>
                                {section.contentGroups.length > 1 && (
                                    <h3 className="mb-5 font-display text-lg font-semibold text-fg">
                                        {group.label}
                                    </h3>
                                )}

                                <div className="space-y-5 rounded border border-border bg-panel/35 p-5 sm:p-6">
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
                            </div>
                        ))}
                    </section>
                ))}

                {progress && (
                    <progress value={progress.percentage} max="100" className="w-full">
                        {progress.percentage}%
                    </progress>
                )}

                <div className="flex items-center gap-4 border-t border-border pt-6">
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded bg-fg px-4 py-2 text-sm font-medium text-base transition-opacity hover:opacity-90 disabled:opacity-50"
                    >
                        Save settings
                    </button>
                    <p className="text-xs text-fg-dim">
                        Saves changes from every section.
                    </p>
                </div>
            </form>
        </AdminLayout>
    );
}
