import { useForm, usePage } from '@inertiajs/react';
import { useRef } from 'react';
import Reveal from './Reveal';

/**
 * The honeypot: a real visitor never sees or fills this, so anything arriving
 * with it filled in is automated. Paired with rate limiting on the route.
 */
const HONEYPOT = 'website';

export default function ContactForm({ path, theme }) {
    const { contact } = usePage().props;
    const successRef = useRef(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        message: '',
        path,
        [HONEYPOT]: '',
    });

    const submit = (event) => {
        event.preventDefault();

        post('/contact', {
            preserveScroll: true,
            onSuccess: () => {
                // Leaving the typed text sitting there reads as "nothing happened".
                reset('name', 'email', 'message');
                // Move focus to the confirmation so it isn't missed by screen readers.
                successRef.current?.focus();
            },
        });
    };

    const inputClass = `w-full rounded border px-3 py-2 text-sm transition-colors focus:ring-0 ${
        path === 'photo'
            ? 'border-cream-border bg-white text-ink focus:border-photo'
            : 'border-border bg-panel text-fg focus:border-dev'
    }`;

    const field = (name, label, render) => (
        <div>
            <label htmlFor={`contact-${name}`} className={`mb-1.5 block text-sm ${theme.body}`}>
                {label}
            </label>
            {render}
            {errors[name] && (
                <p className="mt-1.5 text-xs text-red-500" role="alert">
                    {errors[name]}
                </p>
            )}
        </div>
    );

    return (
        <Reveal className="mt-10 max-w-[480px]">
            {contact && (
                <p
                    ref={successRef}
                    tabIndex={-1}
                    role="status"
                    className={`mb-6 rounded border px-4 py-3 text-sm ${
                        path === 'photo'
                            ? 'border-photo bg-photo/10 text-ink'
                            : 'border-dev bg-dev/10 text-dev-bright'
                    }`}
                >
                    {contact}
                </p>
            )}

            <form onSubmit={submit} className="space-y-4" noValidate>
                {field(
                    'name',
                    'Your name',
                    <input
                        id="contact-name"
                        type="text"
                        autoComplete="name"
                        className={inputClass}
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                    />,
                )}

                {field(
                    'email',
                    'Your email',
                    <input
                        id="contact-email"
                        type="email"
                        autoComplete="email"
                        className={inputClass}
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                    />,
                )}

                {field(
                    'message',
                    'Message',
                    <textarea
                        id="contact-message"
                        rows={5}
                        className={inputClass}
                        value={data.message}
                        onChange={(e) => setData('message', e.target.value)}
                    />,
                )}

                {/* Hidden from people and from assistive tech; only bots fill it. */}
                <div className="hidden" aria-hidden="true">
                    <label htmlFor={`contact-${HONEYPOT}`}>Leave this field empty</label>
                    <input
                        id={`contact-${HONEYPOT}`}
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        value={data[HONEYPOT]}
                        onChange={(e) => setData(HONEYPOT, e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className={`inline-block rounded border px-5.5 py-3 font-mono text-sm transition-colors disabled:opacity-50 ${theme.outlineLink}`}
                >
                    {processing ? 'Sending…' : 'Send message'}
                </button>
            </form>
        </Reveal>
    );
}
