import Seo from '@/Components/Portfolio/Seo';
import { useEffect, useMemo, useState } from 'react';
import Card from '@/Components/Portfolio/Card';
import ContactSection from '@/Components/Portfolio/ContactSection';
import PageHero from '@/Components/Portfolio/PageHero';
import PageNav from '@/Components/Portfolio/PageNav';
import Reveal from '@/Components/Portfolio/Reveal';
import Section from '@/Components/Portfolio/Section';
import TagRow from '@/Components/Portfolio/TagRow';
import { themeFor } from '@/Components/Portfolio/theme';
import PortfolioLayout, { usePortfolio } from '@/Layouts/PortfolioLayout';

const theme = themeFor('photo');

const label = (category) => category.charAt(0).toUpperCase() + category.slice(1);

function Photographer({ settings, tags, gear, photos, categories, contactLinks }) {
    const [active, setActive] = useState('all');
    const { navigate, setCursorTheme } = usePortfolio();

    useEffect(() => {
        setCursorTheme('photo');
    }, [setCursorTheme]);

    const visible = useMemo(
        () => (active === 'all' ? photos : photos.filter((photo) => photo.category === active)),
        [active, photos],
    );

    return (
        <div className={`min-h-screen pb-25 ${theme.page}`}>
            <Seo title="Photography" description={settings.photo_intro} type="profile" />

            <PageNav
                brand={settings.brand_short}
                mode="WEEKEND MODE"
                theme={theme}
                onBack={(event) =>
                    navigate('/', {
                        kind: 'aperture',
                        origin: { x: event.clientX, y: event.clientY },
                    })
                }
            />

            <main
                id="content"
                // Makes the skip link land reliably: some browsers move
                // focus to a fragment target only when it is focusable.
                tabIndex={-1}
                className="outline-none"
            >
                <PageHero
                    kicker={settings.photo_kicker}
                    heading={settings.photo_heading}
                    intro={settings.photo_intro}
                    theme={theme}
                />

                <Section
                    title="Gear"
                    theme={theme}
                    preTitle={<TagRow tags={tags} theme={theme} />}
                >
                    <div className="grid grid-cols-6 gap-5">
                        {gear.map((item) => (
                            <Card
                                key={item.category}
                                theme={theme}
                                span="small"
                                title={item.category}
                            >
                                <p className={`text-sm ${theme.cardBody}`}>{item.value}</p>
                            </Card>
                        ))}
                    </div>
                </Section>

                <Section title="Gallery" theme={theme}>
                    {/* Radio-group semantics: these buttons select one view of the
                        same grid rather than navigating anywhere. */}
                    <Reveal
                        className="mb-6 flex flex-wrap gap-2.5"
                        role="radiogroup"
                        aria-label="Filter photos by category"
                    >
                        {['all', ...categories].map((category) => {
                            const isActive = active === category;

                            return (
                                <button
                                    key={category}
                                    type="button"
                                    role="radio"
                                    aria-checked={isActive}
                                    onClick={() => setActive(category)}
                                    className={`rounded-full border px-4 py-2 font-mono text-xs transition-colors ${
                                        isActive
                                            ? 'border-photo bg-photo/10 text-ink'
                                            : 'border-cream-border text-ink-dim hover:border-photo'
                                    }`}
                                >
                                    {category === 'all' ? 'All' : label(category)}
                                </button>
                            );
                        })}
                    </Reveal>

                    <ul className="grid grid-cols-2 gap-5 md:grid-cols-4">
                        {visible.map((photo, index) => (
                            <li
                                key={photo.id}
                                className={`polaroid aspect-3/4 rounded ${index % 4 === 1 ? 'md:aspect-4/3' : ''}`}
                                style={{
                                    // Staggered drift so the grid feels alive rather than static.
                                    '--float-dur': `${6 + (index % 3)}s`,
                                    '--float-delay': `${(index % 5) * 0.4}s`,
                                }}
                            >
                                {photo.thumb_url && (
                                    <img
                                        src={photo.thumb_url}
                                        alt={photo.title ?? ''}
                                        loading="lazy"
                                        className="absolute inset-2.5 z-1 size-[calc(100%-1.25rem)] rounded-[2px] object-cover"
                                    />
                                )}
                            </li>
                        ))}
                    </ul>

                    {visible.length === 0 && (
                        <p className={`mt-6 text-sm ${theme.body}`}>No photos in this category yet.</p>
                    )}
                </Section>

                <Section title={settings.photo_about_title} theme={theme}>
                    <div className="flex flex-col items-start gap-10 sm:flex-row">
                        <Reveal
                            className={`aspect-3/4 w-45 shrink-0 overflow-hidden rounded ${theme.portrait}`}
                            aria-hidden={!settings.photo_about_photo_url}
                        >
                            {settings.photo_about_photo_url && (
                                <img
                                    src={settings.photo_about_photo_url}
                                    alt={settings.owner_name ? `${settings.owner_name} portrait` : 'About portrait'}
                                    className="absolute inset-2.5 z-1 size-[calc(100%-1.25rem)] rounded-[2px] object-cover"
                                />
                            )}
                        </Reveal>
                        <Reveal as="p" className="max-w-[480px] pt-1 leading-[1.8] text-ink-dim">
                            {settings.photo_about_bio}
                        </Reveal>
                    </div>
                </Section>

                <Section title="Bookings" theme={theme}>
                    <Reveal as="p" className={`mb-7 max-w-[480px] leading-relaxed ${theme.body}`}>
                        {settings.bookings_lead}
                    </Reveal>
                    <Reveal>
                        <a
                            href={`mailto:${settings.contact_email}?subject=Booking%20inquiry`}
                            className={`inline-block rounded border px-5.5 py-3 font-mono text-sm transition-colors ${theme.outlineLink}`}
                        >
                            {settings.bookings_cta} &rarr;
                        </a>
                    </Reveal>
                </Section>

                <ContactSection
                    lead={settings.photo_contact_lead}
                    links={contactLinks}
                    theme={theme}
                    path="photo"
                />
            </main>

        </div>
    );
}

// scene={false}: this path runs on an opaque cream ground the navy 3D field
// could never show through, so three is not downloaded here at all.
Photographer.layout = (page) => <PortfolioLayout scene={false}>{page}</PortfolioLayout>;

export default Photographer;
