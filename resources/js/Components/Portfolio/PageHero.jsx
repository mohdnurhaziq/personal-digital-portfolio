export default function PageHero({ kicker, heading, intro, theme }) {
    return (
        <header className="px-6 pt-15 pb-10 sm:px-12">
            {kicker && (
                <p
                    className={`mb-3.5 font-mono text-xs tracking-[0.1em] uppercase ${theme.accent}`}
                >
                    {kicker}
                </p>
            )}
            <h1
                className={`font-display text-[clamp(34px,6vw,64px)] leading-[1.05] font-extrabold ${theme.heading}`}
            >
                {heading}
            </h1>
            {intro && (
                <p className={`mt-4 max-w-[520px] leading-relaxed ${theme.body}`}>{intro}</p>
            )}
        </header>
    );
}
