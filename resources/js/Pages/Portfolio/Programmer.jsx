import { Head } from '@inertiajs/react';
import { useEffect } from 'react';
import Card from '@/Components/Portfolio/Card';
import ContactSection from '@/Components/Portfolio/ContactSection';
import PageHero from '@/Components/Portfolio/PageHero';
import PageNav from '@/Components/Portfolio/PageNav';
import Reveal from '@/Components/Portfolio/Reveal';
import Section from '@/Components/Portfolio/Section';
import StackIcon from '@/Components/Portfolio/StackIcon';
import TagRow from '@/Components/Portfolio/TagRow';
import { themeFor } from '@/Components/Portfolio/theme';
import PortfolioLayout, { usePortfolio } from '@/Layouts/PortfolioLayout';

const theme = themeFor('dev');

function Programmer({
    settings,
    tags,
    techStacks,
    projects,
    experiences,
    testimonials,
    certifications,
    contactLinks,
}) {
    const { navigate, setCursorTheme, setSceneVisible } = usePortfolio();

    useEffect(() => {
        setCursorTheme('dev');
        // The navy page is translucent over the field, so the scene keeps
        // running here and dollies with the scroll.
        setSceneVisible(true);
    }, [setCursorTheme, setSceneVisible]);

    return (
        <div className={`min-h-screen pb-25 ${theme.page}`}>
            <Head title="Programmer & project manager">
                <meta name="description" content={settings.dev_intro} />
            </Head>

            <PageNav
                brand={settings.brand_short}
                mode="WEEKDAY MODE"
                theme={theme}
                onBack={() => navigate('/', { kind: 'matrix' })}
            />

            <PageHero
                kicker={settings.dev_kicker}
                heading={settings.dev_heading}
                intro={settings.dev_intro}
                theme={theme}
            />

            <Section
                title="Tech stack"
                theme={theme}
                preTitle={<TagRow tags={tags} theme={theme} />}
            >
                <div className="grid grid-cols-6 gap-5">
                    {Object.entries(techStacks).map(([group, items]) => (
                        <Card key={group} theme={theme} span="small" title={group}>
                            <ul className="mt-1.5 flex flex-wrap gap-4">
                                {items.map((item) => (
                                    <StackIcon
                                        key={item.name}
                                        slug={item.icon_slug}
                                        name={item.name}
                                    />
                                ))}
                            </ul>
                        </Card>
                    ))}
                </div>
            </Section>

            <Section title="Selected projects" theme={theme}>
                <div className="grid grid-cols-6 gap-5">
                    {projects.map((project) => (
                        <Card
                            key={project.title}
                            theme={theme}
                            span={project.size}
                            title={project.title}
                            className="flex min-h-65 flex-col"
                        >
                            <p className={`text-sm leading-relaxed ${theme.cardBody}`}>
                                {project.description}
                            </p>

                            {project.role && (
                                <p className="mt-3 font-mono text-xs text-fg-dim">{project.role}</p>
                            )}

                            {project.tech?.length > 0 && (
                                <ul className="mt-3 flex flex-wrap gap-2">
                                    {project.tech.map((tech) => (
                                        <li
                                            key={tech}
                                            className="rounded-full border border-border px-2.5 py-1 font-mono text-[11px] text-fg-dim"
                                        >
                                            {tech}
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {(project.repo_url || project.demo_url) && (
                                <div className="mt-auto flex gap-4 pt-4 font-mono text-xs">
                                    {project.repo_url && (
                                        <a
                                            href={project.repo_url}
                                            className="text-dev-bright hover:underline"
                                        >
                                            Repo &rarr;
                                        </a>
                                    )}
                                    {project.demo_url && (
                                        <a
                                            href={project.demo_url}
                                            className="text-dev-bright hover:underline"
                                        >
                                            Demo &rarr;
                                        </a>
                                    )}
                                </div>
                            )}
                        </Card>
                    ))}
                </div>
            </Section>

            <Section title="Experience" theme={theme}>
                <ol className="timeline mb-9">
                    {experiences.map((job) => (
                        <Reveal as="li" key={`${job.company}-${job.title}`} className="timeline-item">
                            <p className="mb-2 font-mono text-xs tracking-[0.08em] text-dev-bright uppercase">
                                {job.date_range}
                            </p>
                            <h3 className="font-display text-xl font-semibold">{job.title}</h3>
                            <p className="mt-1 mb-3 text-sm text-fg-dim">{job.company}</p>
                            {job.bullets?.length > 0 && (
                                <ul className="list-disc pl-4.5">
                                    {job.bullets.map((bullet) => (
                                        <li
                                            key={bullet}
                                            className="mb-1 text-sm leading-relaxed text-fg-dim"
                                        >
                                            {bullet}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </Reveal>
                    ))}
                </ol>

                {settings.resume_url && settings.resume_url !== '#' && (
                    <a
                        href={settings.resume_url}
                        className={`inline-block rounded border px-5.5 py-3 font-mono text-[13px] transition-colors ${theme.outlineLink}`}
                    >
                        Download resume (PDF) &rarr;
                    </a>
                )}
            </Section>

            <Section title={settings.dev_about_title} theme={theme}>
                <div className="flex flex-col items-start gap-10 sm:flex-row">
                    <Reveal
                        className={`aspect-3/4 w-45 shrink-0 rounded ${theme.portrait}`}
                        aria-hidden="true"
                    />
                    <Reveal
                        as="p"
                        className="max-w-[480px] pt-1 leading-[1.8] text-fg-dim"
                    >
                        {settings.dev_about_bio}
                    </Reveal>
                </div>
            </Section>

            <Section title="What people say" theme={theme}>
                <div className="grid gap-5 md:grid-cols-2">
                    {testimonials.map((testimonial) => (
                        <Reveal
                            key={testimonial.quote}
                            className={`rounded-[10px] border p-7 backdrop-blur-[6px] ${theme.card}`}
                        >
                            <blockquote className="mb-3.5 leading-[1.7]">
                                {testimonial.quote}
                            </blockquote>
                            <figcaption className="font-mono text-xs text-fg-dim">
                                {[
                                    testimonial.author_name,
                                    [testimonial.author_title, testimonial.author_company]
                                        .filter(Boolean)
                                        .join(', '),
                                ]
                                    .filter(Boolean)
                                    .join(' — ')}
                            </figcaption>
                        </Reveal>
                    ))}
                </div>
            </Section>

            <Section title="Certifications" theme={theme}>
                <div className="grid grid-cols-6 gap-5">
                    {certifications.map((cert, index) => (
                        <Card
                            key={`${cert.name}-${index}`}
                            theme={theme}
                            span="small"
                            title={cert.name}
                        >
                            <p className={`text-sm ${theme.cardBody}`}>
                                {[cert.issuer, cert.year].filter(Boolean).join(' — ')}
                            </p>
                            {cert.credential_url && (
                                <a
                                    href={cert.credential_url}
                                    className="mt-3 inline-block font-mono text-xs text-dev-bright hover:underline"
                                >
                                    View credential &rarr;
                                </a>
                            )}
                        </Card>
                    ))}
                </div>
            </Section>

            <ContactSection lead={settings.dev_contact_lead} links={contactLinks} theme={theme} />
        </div>
    );
}

Programmer.layout = (page) => <PortfolioLayout>{page}</PortfolioLayout>;

export default Programmer;
