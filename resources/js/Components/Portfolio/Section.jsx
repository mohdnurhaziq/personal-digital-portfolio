import Reveal from './Reveal';

/**
 * `preTitle` renders above the heading — the teaser tag row sits there in the
 * reference design, ahead of the first section title on each path.
 */
export default function Section({ title, theme, preTitle, children, className = '', ...props }) {
    return (
        <section className={`px-6 py-12 sm:px-12 sm:py-15 ${className}`} {...props}>
            {preTitle}
            {title && (
                <Reveal
                    as="h2"
                    className={`mb-8 font-display text-[26px] font-extrabold ${theme.heading}`}
                >
                    {title}
                </Reveal>
            )}
            {children}
        </section>
    );
}
