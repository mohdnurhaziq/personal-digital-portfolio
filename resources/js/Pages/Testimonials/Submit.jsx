import { Head, Link, useForm, usePage } from '@inertiajs/react';

const inputClass =
    'w-full rounded border border-border bg-panel px-3 py-2.5 text-sm text-fg placeholder:text-fg-dim focus:border-dev focus:ring-0';

export default function Submit({ action, submitted }) {
    const { status } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        quote: '',
        author_name: '',
        author_title: '',
        author_company: '',
        website: '',
    });

    const submit = (event) => {
        event.preventDefault();
        post(action);
    };

    return (
        <main className="min-h-screen bg-base px-5 py-10 text-fg sm:py-16">
            <Head title="Share a testimonial" />

            <div className="mx-auto max-w-2xl">
                <p className="font-mono text-xs tracking-[0.14em] text-dev-bright uppercase">
                    Haziq / Testimonial
                </p>

                {submitted ? (
                    <section className="mt-8 rounded-[10px] border border-dev/40 bg-panel p-7 sm:p-10">
                        <p className="font-mono text-[11px] tracking-[0.14em] text-dev-bright uppercase">
                            Received
                        </p>
                        <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
                            Thank you for sharing your experience.
                        </h1>
                        <p className="mt-4 max-w-xl leading-7 text-fg-dim">
                            {status ??
                                'Your testimonial has been submitted and is waiting for review.'}
                        </p>
                        <Link
                            href="/programmer"
                            className="mt-7 inline-block text-sm font-medium text-dev-bright hover:underline"
                        >
                            View the portfolio
                        </Link>
                    </section>
                ) : (
                    <>
                        <header className="mt-8 border-b border-border pb-7">
                            <h1 className="font-display text-3xl font-bold sm:text-5xl">
                                What was it like working together?
                            </h1>
                            <p className="mt-4 max-w-xl leading-7 text-fg-dim">
                                Share a short, honest recommendation. Your response will only appear
                                on the portfolio after it has been reviewed.
                            </p>
                        </header>

                        <form onSubmit={submit} className="mt-8 space-y-6">
                            <div>
                                <label htmlFor="quote" className="mb-1.5 block text-sm font-medium">
                                    Your testimonial
                                </label>
                                <textarea
                                    id="quote"
                                    rows={7}
                                    required
                                    value={data.quote}
                                    onChange={(event) => setData('quote', event.target.value)}
                                    placeholder="A project, strength, or moment that stood out…"
                                    className={inputClass}
                                />
                                {errors.quote && (
                                    <p className="mt-1.5 text-xs text-red-400">{errors.quote}</p>
                                )}
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div>
                                    <label
                                        htmlFor="author_name"
                                        className="mb-1.5 block text-sm font-medium"
                                    >
                                        Your name
                                    </label>
                                    <input
                                        id="author_name"
                                        type="text"
                                        required
                                        value={data.author_name}
                                        onChange={(event) =>
                                            setData('author_name', event.target.value)
                                        }
                                        className={inputClass}
                                    />
                                    {errors.author_name && (
                                        <p className="mt-1.5 text-xs text-red-400">
                                            {errors.author_name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="author_title"
                                        className="mb-1.5 block text-sm font-medium"
                                    >
                                        Role or title <span className="text-fg-dim">(optional)</span>
                                    </label>
                                    <input
                                        id="author_title"
                                        type="text"
                                        value={data.author_title}
                                        onChange={(event) =>
                                            setData('author_title', event.target.value)
                                        }
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="author_company"
                                    className="mb-1.5 block text-sm font-medium"
                                >
                                    Company or organisation{' '}
                                    <span className="text-fg-dim">(optional)</span>
                                </label>
                                <input
                                    id="author_company"
                                    type="text"
                                    value={data.author_company}
                                    onChange={(event) =>
                                        setData('author_company', event.target.value)
                                    }
                                    className={inputClass}
                                />
                            </div>

                            <div className="hidden" aria-hidden="true">
                                <label htmlFor="website">Website</label>
                                <input
                                    id="website"
                                    type="text"
                                    tabIndex={-1}
                                    autoComplete="off"
                                    value={data.website}
                                    onChange={(event) => setData('website', event.target.value)}
                                />
                            </div>

                            <div className="flex flex-wrap items-center gap-4 border-t border-border pt-6">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded bg-dev px-5 py-2.5 text-sm font-semibold text-white-soft transition-opacity hover:opacity-90 disabled:opacity-50"
                                >
                                    {processing ? 'Sending…' : 'Send testimonial'}
                                </button>
                                <p className="text-xs text-fg-dim">
                                    This private link can be used once.
                                </p>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </main>
    );
}
