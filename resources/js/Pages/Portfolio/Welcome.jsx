import Seo from '@/Components/Portfolio/Seo';
import { useEffect, useRef, useState } from 'react';
import HeroPolaroids from '@/Components/Portfolio/HeroPolaroids';
import HeroRain from '@/Components/Portfolio/HeroRain';
import PortfolioLayout, { usePortfolio } from '@/Layouts/PortfolioLayout';

/**
 * Landing screen. The welcome panel shows first and crossfades into the
 * Programmer/Photographer fork on Continue — deliberately a button, not a
 * scroll, per portfolio-plan.md.
 */
function Welcome({ settings, stats }) {
    const [showFork, setShowFork] = useState(false);
    const [hovered, setHovered] = useState(null);
    const { navigate, setCursorTheme, setSceneVisible } = usePortfolio();
    const firstForkRef = useRef(null);

    // Revealing the fork hides the welcome panel from assistive tech, but the
    // Continue button that triggered it still holds focus — a focused element
    // inside an aria-hidden subtree, which browsers refuse to honour, and which
    // strands a keyboard user on a control they can no longer see. Hand focus to
    // the first half instead, which is where they were heading anyway.
    const revealFork = () => {
        setShowFork(true);
        requestAnimationFrame(() => firstForkRef.current?.focus());
    };

    // The 3D field sits behind the welcome panel, but the fork's two halves are
    // opaque, so keeping it running underneath them would just burn frames.
    useEffect(() => {
        setSceneVisible(!showFork);
    }, [showFork, setSceneVisible]);

    useEffect(() => {
        setCursorTheme(hovered === 'photo' ? 'photo' : 'dev');
    }, [hovered, setCursorTheme]);

    return (
        <>
            <Seo title="Portfolio" description={settings.meta_description} />

            <main className="relative min-h-screen overflow-hidden">
                {/* Welcome */}
                <section
                    className={`absolute inset-0 z-12 flex flex-col items-center justify-center px-10 text-center transition-all duration-700 ${
                        showFork
                            ? 'pointer-events-none -translate-y-4 opacity-0'
                            : 'translate-y-0 opacity-100'
                    }`}
                    aria-hidden={showFork}
                >
                    <p className="mb-4.5 font-mono text-xs tracking-[0.12em] text-fg-dim uppercase">
                        {settings.welcome_kicker}
                    </p>

                    <h1 className="mx-auto max-w-[760px] font-display text-[clamp(28px,6vw,62px)] leading-[1.08] font-extrabold">
                        {settings.owner_name}
                    </h1>

                    <p className="mt-5.5 max-w-[540px] text-lg">
                        {settings.welcome_tagline_lead}{' '}
                        <span className="text-dev-bright">weekdays</span>
                        {settings.welcome_tagline_mid}{' '}
                        <span className="text-photo">weekends</span>
                        {settings.welcome_tagline_end}
                    </p>

                    <p className="mt-3 max-w-[440px] leading-relaxed text-fg-dim">
                        {settings.welcome_bio}
                    </p>

                    <dl className="mt-7.5 flex flex-wrap items-center justify-center gap-5.5">
                        {stats.map((stat, index) => (
                            // One div per group, and no deeper: a <dl> may hold
                            // dt/dd pairs or divs wrapping them, but not a div
                            // inside a div. The separator is a left border for
                            // the same reason — a bare <span> is not allowed
                            // in here either.
                            <div
                                key={stat.label}
                                className={`flex flex-col items-center gap-1 ${
                                    index > 0 ? 'border-l border-border pl-5.5' : ''
                                }`}
                            >
                                <dt className="order-2 font-mono text-[10px] tracking-[0.06em] text-fg-dim uppercase">
                                    {stat.label}
                                </dt>
                                <dd className="order-1 font-display text-xl font-extrabold">
                                    {stat.value}
                                </dd>
                            </div>
                        ))}
                    </dl>

                    <button
                        type="button"
                        onClick={revealFork}
                        // Matches the panel's own aria-hidden: once the fork is
                        // up this button is invisible, so it must leave the tab
                        // order too.
                        tabIndex={showFork ? -1 : undefined}
                        className="mt-10 flex items-center gap-2 rounded bg-fg px-7.5 py-4 text-sm font-medium text-base transition-opacity hover:opacity-90"
                    >
                        {settings.welcome_cta}
                        <span className="animate-[bounceDown_1.8s_ease-in-out_infinite]">&darr;</span>
                    </button>
                </section>

                {/* Fork */}
                <section
                    className={`absolute inset-0 z-10 flex flex-col transition-opacity duration-700 sm:flex-row ${
                        showFork ? 'opacity-100' : 'pointer-events-none opacity-0'
                    }`}
                    aria-hidden={!showFork}
                >
                    <span className="absolute top-8 left-6 z-20 font-mono text-[13px] tracking-[0.1em] sm:left-12">
                        {settings.brand_short}
                    </span>
                    <span className="absolute top-8 right-6 z-20 font-mono text-xs tracking-[0.1em] text-fg-dim sm:right-12">
                        {settings.welcome_kicker}
                    </span>

                    <ForkHalf
                        href="/programmer"
                        title="Programmer"
                        tagline={
                            <>
                                {settings.welcome_tagline_lead}{' '}
                                <span className="text-dev-bright">weekdays</span>,
                            </>
                        }
                        tabbable={showFork}
                        innerRef={firstForkRef}
                        dimmed={hovered !== null && hovered !== 'dev'}
                        onHover={() => setHovered('dev')}
                        onLeave={() => setHovered(null)}
                        onActivate={() => navigate('/programmer', { kind: 'matrix' })}
                        className="border-border bg-base text-fg sm:border-r"
                        accent="text-dev-bright"
                        ambient={<HeroRain active={showFork} />}
                        icon={
                            <path
                                d="M8 4L2 12l6 8M16 4l6 8-6 8"
                                fill="none"
                                strokeWidth="1.4"
                                strokeLinecap="round"
                            />
                        }
                    />

                    <ForkHalf
                        href="/photographer"
                        title="Photographer"
                        tagline={
                            <>
                                photographer on the{' '}
                                <span className="text-photo-deep">weekends</span>.
                            </>
                        }
                        tabbable={showFork}
                        dimmed={hovered !== null && hovered !== 'photo'}
                        onHover={() => setHovered('photo')}
                        onLeave={() => setHovered(null)}
                        // The aperture opens from wherever the visitor clicked,
                        // which is what sells it as a camera shutter.
                        onActivate={(event) =>
                            navigate('/photographer', {
                                kind: 'aperture',
                                origin: { x: event.clientX, y: event.clientY },
                            })
                        }
                        className="bg-cream text-ink"
                        accent="text-photo-deep"
                        ambient={<HeroPolaroids />}
                        icon={
                            <>
                                <path
                                    d="M4 8h3l2-3h6l2 3h3v12H4V8z"
                                    fill="none"
                                    strokeWidth="1.4"
                                    strokeLinejoin="round"
                                />
                                <circle cx="12" cy="14" r="3.5" fill="none" strokeWidth="1.4" />
                            </>
                        }
                    />
                </section>
            </main>
        </>
    );
}

function ForkHalf({
    href,
    title,
    tagline,
    icon,
    accent,
    className,
    dimmed,
    tabbable,
    innerRef,
    ambient,
    onHover,
    onLeave,
    onActivate,
}) {
    return (
        <a
            href={href}
            ref={innerRef}
            // Until the fork is revealed it sits behind the welcome panel, so it
            // must stay out of the tab order.
            tabIndex={tabbable ? undefined : -1}
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
            onFocus={onHover}
            onBlur={onLeave}
            onClick={(event) => {
                // Let modified clicks open a new tab like any normal link.
                if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
                event.preventDefault();
                onActivate(event);
            }}
            // A half fills its side of the viewport, so a normal outline is
            // drawn along the screen edges where it is all but invisible.
            // Pulling it inside puts the focus indicator where it can be seen.
            className={`relative isolate flex flex-1 flex-col justify-end overflow-hidden p-10 transition-opacity duration-300 focus-visible:-outline-offset-4 sm:p-15 ${className} ${
                dimmed ? 'opacity-55' : 'opacity-100'
            }`}
        >
            {ambient}

            <svg
                viewBox="0 0 24 24"
                className={`mb-5 size-10.5 stroke-current ${accent}`}
                aria-hidden="true"
            >
                {icon}
            </svg>

            <h2 className="font-display text-[clamp(30px,4.5vw,50px)] font-extrabold">{title}</h2>

            <p className="mt-4 max-w-[380px] opacity-70">{tagline}</p>

            <span className={`mt-6 font-mono text-xs tracking-[0.05em] ${accent}`}>ENTER &rarr;</span>
        </a>
    );
}

Welcome.layout = (page) => <PortfolioLayout>{page}</PortfolioLayout>;

export default Welcome;
