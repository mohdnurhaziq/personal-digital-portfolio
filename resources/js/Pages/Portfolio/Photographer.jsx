import Seo from '@/Components/Portfolio/Seo';
import { useEffect, useMemo, useState } from 'react';
import Card from '@/Components/Portfolio/Card';
import ContactSection from '@/Components/Portfolio/ContactSection';
import PageHero from '@/Components/Portfolio/PageHero';
import PageNav from '@/Components/Portfolio/PageNav';
import Reveal from '@/Components/Portfolio/Reveal';
import ScreenshotViewer from '@/Components/Portfolio/ScreenshotViewer';
import Section from '@/Components/Portfolio/Section';
import TagRow from '@/Components/Portfolio/TagRow';
import { themeFor } from '@/Components/Portfolio/theme';
import PortfolioLayout, { usePortfolio } from '@/Layouts/PortfolioLayout';

const theme = themeFor('photo');

const label = (category) => category.charAt(0).toUpperCase() + category.slice(1);

// Mixed portrait and landscape frames without changing column width. Keeping
// the sequence deterministic avoids a reshuffle after hydration or reload.
const galleryOrientations = [
    'aspect-3/4',
    'aspect-4/3',
    'aspect-3/4',
    'aspect-3/4',
    'aspect-4/3',
    'aspect-3/4',
    'aspect-4/3',
    'aspect-4/3',
    'aspect-3/4',
    'aspect-3/4',
];

function Photographer({ settings, tags, gear, photos, categories, contactLinks }) {
    const [active, setActive] = useState('all');
    const [gearIndex, setGearIndex] = useState(null);
    const [photoIndex, setPhotoIndex] = useState(null);
    const { navigate, setCursorTheme } = usePortfolio();

    useEffect(() => {
        setCursorTheme('photo');
    }, [setCursorTheme]);

    const visible = useMemo(
        () => (active === 'all' ? photos : photos.filter((photo) => photo.category === active)),
        [active, photos],
    );
    const viewableGear = useMemo(
        () =>
            gear
                .filter((item) => item.image_url)
                .map((item) => ({ ...item, title: item.category })),
        [gear],
    );
    const viewablePhotos = useMemo(
        () => visible.filter((photo) => photo.thumb_url && photo.image_url),
        [visible],
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
                                {item.image_url && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setGearIndex(
                                                viewableGear.findIndex(
                                                    (viewable) =>
                                                        viewable.category === item.category,
                                                ),
                                            )
                                        }
                                        aria-label={`View ${item.category} gear photo fullscreen`}
                                        aria-haspopup="dialog"
                                        className="group mb-4 block w-full cursor-zoom-in overflow-hidden rounded border border-cream-border focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-photo"
                                    >
                                        <img
                                            src={item.image_url}
                                            alt={`${item.category}: ${item.value}`}
                                            loading="lazy"
                                            className="aspect-4/3 w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025]"
                                        />
                                    </button>
                                )}
                                <p className={`text-sm ${theme.cardBody}`}>{item.value}</p>
                            </Card>
                        ))}
                    </div>

                    <ScreenshotViewer
                        screenshots={viewableGear}
                        index={gearIndex}
                        title="Photography gear"
                        itemLabel="photo"
                        onClose={() => setGearIndex(null)}
                        onIndexChange={setGearIndex}
                    />
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
                                    onClick={() => {
                                        setActive(category);
                                        setPhotoIndex(null);
                                    }}
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

                    <ul className="columns-2 gap-5 md:columns-4">
                        {viewablePhotos.map((photo, index) => (
                            <li
                                key={photo.id}
                                className={`polaroid mb-5 inline-block w-full break-inside-avoid rounded align-top ${galleryOrientations[index % galleryOrientations.length]}`}
                                style={{
                                    // Staggered drift so the grid feels alive rather than static.
                                    '--float-dur': `${6 + (index % 3)}s`,
                                    '--float-delay': `${(index % 5) * 0.4}s`,
                                }}
                            >
                                {photo.thumb_url && photo.image_url && (
                                    <button
                                        type="button"
                                        onClick={() => setPhotoIndex(index)}
                                        aria-label={`View ${photo.title || 'gallery photo'} fullscreen`}
                                        aria-haspopup="dialog"
                                        className="group absolute inset-2.5 z-1 cursor-zoom-in overflow-hidden rounded-[2px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-photo"
                                    >
                                        <img
                                            src={photo.thumb_url}
                                            alt={photo.title ?? ''}
                                            loading="lazy"
                                            className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025]"
                                        />
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>

                    <ScreenshotViewer
                        screenshots={viewablePhotos}
                        index={photoIndex}
                        title="Photography gallery"
                        itemLabel="photo"
                        onClose={() => setPhotoIndex(null)}
                        onIndexChange={setPhotoIndex}
                    />

                    {viewablePhotos.length === 0 && (
                        <p className={`mt-6 text-sm ${theme.body}`}>No photos in this category yet.</p>
                    )}
                </Section>

                <Section
                    title={settings.photo_about_title}
                    theme={theme}
                    className="!pt-8 !pb-10 sm:!pt-10 sm:!pb-12"
                >
                    <div className="flex flex-col items-start gap-8 md:flex-row md:gap-12 xl:gap-16">
                        <Reveal
                            className={`aspect-3/4 w-48 shrink-0 overflow-hidden rounded sm:w-56 xl:w-70 ${theme.portrait}`}
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
                        <Reveal
                            as="p"
                            className="w-full min-w-0 max-w-3xl flex-1 pt-1 text-[15px] leading-[1.85] text-ink-dim sm:text-[16px]"
                        >
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
