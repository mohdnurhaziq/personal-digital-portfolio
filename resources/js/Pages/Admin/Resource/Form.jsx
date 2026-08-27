import { Head, Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import ImageCollectionField from '@/Components/Admin/ImageCollectionField';
import TechnologyCombobox from '@/Components/Admin/TechnologyCombobox';
import { fileInputClass } from '@/Components/Admin/fileInput';

const inputClass =
    'w-full rounded border border-border bg-panel px-3 py-2 text-sm text-fg placeholder:text-fg-dim focus:border-dev focus:ring-0';

export default function Form({ resource, record }) {
    const editing = Boolean(record);

    const initial = {
        ...Object.fromEntries(
            resource.fields.map((field) => [
                field.name,
                // Uploads start empty rather than echoing what is already
                // stored: the value here is what gets *added* on save.
                field.type === 'image' || field.type === 'file'
                    ? null
                    : field.type === 'images'
                      ? []
                      : (record?.[field.name] ?? ''),
            ]),
        ),
        // Uploads mean multipart, and PHP does not parse multipart bodies on
        // PUT, so updates post with a method override. It has to live in the
        // form data — Inertia builds the request from there, not from options.
        ...(editing ? { _method: 'put' } : {}),
    };

    const { data, setData, post, processing, errors, progress } = useForm(initial);

    const submit = (event) => {
        event.preventDefault();

        post(editing ? `/admin/${resource.key}/${record.id}` : `/admin/${resource.key}`, {
            forceFormData: true,
        });
    };

    // A multi-upload reports per-file errors as `screenshots.0`, so the
    // field's own key alone would show nothing when one file in a batch is
    // rejected — the upload would look like it silently did nothing.
    const fieldError = (field) =>
        errors[field.name] ??
        Object.entries(errors).find(([key]) => key.startsWith(`${field.name}.`))?.[1];

    const renderField = (field) => {
        const value = data[field.name] ?? '';
        const common = {
            id: field.name,
            name: field.name,
            className: inputClass,
            'aria-describedby': field.help ? `${field.name}-help` : undefined,
        };

        if (field.type === 'textarea' || field.type === 'list') {
            return (
                <textarea
                    {...common}
                    rows={field.type === 'list' ? 5 : 4}
                    value={value}
                    onChange={(e) => setData(field.name, e.target.value)}
                />
            );
        }

        if (field.type === 'select') {
            if (field.searchable) {
                return (
                    <TechnologyCombobox
                        field={field}
                        value={value}
                        onChange={(nextValue) => setData(field.name, nextValue)}
                        className={inputClass}
                    />
                );
            }

            return (
                <select
                    {...common}
                    value={value}
                    onChange={(e) => setData(field.name, e.target.value)}
                >
                    <option value="">Choose…</option>
                    {field.options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            );
        }

        if (field.type === 'images') {
            return (
                <ImageCollectionField
                    field={field}
                    record={record}
                    resourceKey={resource.key}
                    onPick={(files) => setData(field.name, files)}
                />
            );
        }
        if (field.type === 'image') {
            return (
                <div className="space-y-3">
                    {record?.[field.name] && (
                        <img
                            src={record[field.name]}
                            alt=""
                            className="h-32 w-32 rounded object-cover"
                        />
                    )}
                    <input
                        {...common}
                        className={fileInputClass}
                        type="file"
                        accept={field.accept ?? 'image/jpeg,image/png,image/webp'}
                        onChange={(e) => setData(field.name, e.target.files[0] ?? null)}
                    />
                </div>
            );
        }
        if (field.type === 'file') {
            const existing = record?.[field.name];

            return (
                <div className="space-y-3">
                    {existing && (
                        <div className="rounded border border-border bg-panel p-3">
                            <div className="flex items-center gap-3">
                                {existing.kind === 'image' ? (
                                    <img
                                        src={existing.preview_url}
                                        alt=""
                                        className="h-20 w-24 rounded object-contain"
                                    />
                                ) : (
                                    <span className="flex h-20 w-16 items-center justify-center rounded border border-red-400/30 bg-red-400/10 font-mono text-xs text-red-300">
                                        PDF
                                    </span>
                                )}
                                <div className="min-w-0 flex-1">
                                    <a
                                        href={existing.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="block truncate text-sm text-dev-bright hover:underline"
                                    >
                                        {existing.name}
                                    </a>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            router.delete(
                                                `/admin/${resource.key}/${record.id}/media/${existing.id}`,
                                                { preserveScroll: true },
                                            )
                                        }
                                        className="mt-2 text-xs text-fg-dim hover:text-red-300"
                                    >
                                        Remove current file
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    <input
                        {...common}
                        className={fileInputClass}
                        type="file"
                        accept={field.accept}
                        onChange={(e) => setData(field.name, e.target.files[0] ?? null)}
                    />
                </div>
            );
        }

        return (
            <input
                {...common}
                type={field.type === 'number' ? 'number' : 'text'}
                value={value}
                onChange={(e) => setData(field.name, e.target.value)}
            />
        );
    };

    return (
        <AdminLayout title={`${editing ? 'Edit' : 'New'} ${resource.singular.toLowerCase()}`}>
            <Head title={`${editing ? 'Edit' : 'New'} ${resource.singular} — Admin`} />

            <form onSubmit={submit} className="max-w-2xl space-y-6">
                {resource.fields.map((field) => (
                    <div key={field.name}>
                        <label
                            htmlFor={field.name}
                            className="mb-1.5 block text-sm font-medium text-fg"
                        >
                            {field.label}
                            {field.required && (
                                <span className="ml-1 text-dev-bright" aria-hidden="true">
                                    *
                                </span>
                            )}
                        </label>

                        {renderField(field)}

                        {field.help && (
                            <p id={`${field.name}-help`} className="mt-1.5 text-xs text-fg-dim">
                                {field.help}
                            </p>
                        )}

                        {fieldError(field) && (
                            <p className="mt-1.5 text-xs text-red-400">{fieldError(field)}</p>
                        )}
                    </div>
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
                        {editing ? 'Save changes' : `Create ${resource.singular.toLowerCase()}`}
                    </button>
                    <Link
                        href={`/admin/${resource.key}`}
                        className="text-sm text-fg-dim hover:text-fg"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </AdminLayout>
    );
}
