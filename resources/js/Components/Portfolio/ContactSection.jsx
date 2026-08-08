import ContactForm from './ContactForm';
import Reveal from './Reveal';
import Section from './Section';

export default function ContactSection({ title = 'Get in touch', lead, links, theme, path }) {
    return (
        <Section title={title} theme={theme}>
            {lead && (
                <Reveal as="p" className={`mb-7 max-w-[480px] leading-relaxed ${theme.body}`}>
                    {lead}
                </Reveal>
            )}

            <Reveal as="ul" className="flex flex-wrap gap-4">
                {links.map((link) => (
                    <li key={`${link.label}-${link.url}`}>
                        <a
                            href={link.url}
                            className={`inline-block rounded border px-5.5 py-3 font-mono text-sm transition-colors ${theme.outlineLink}`}
                        >
                            {link.label}
                        </a>
                    </li>
                ))}
            </Reveal>

            {/* The links suit anyone who prefers their own mail client; the form
                is for the visitor who would otherwise bounce. */}
            <ContactForm path={path} theme={theme} />
        </Section>
    );
}
