/**
 * The site forks into two visual identities. Rather than scatter `path === 'dev'
 * ? ... : ...` through every component, each path's classes are declared once
 * here and looked up by name.
 *
 * dev   — blue accents on the shared navy base
 * photo — gold accents on a cream ground
 */
export const themes = {
    dev: {
        page: 'bg-base text-fg',
        accent: 'text-dev-bright',
        accentDeep: 'text-dev-bright',
        heading: 'text-fg',
        body: 'text-fg-dim',
        navMuted: 'text-fg-dim',
        card: 'bg-panel-glass border-border hover:border-dev backdrop-blur-[6px]',
        cardHeading: 'text-dev-bright',
        cardBody: 'text-fg-dim',
        tag: 'text-dev-bright border-border',
        outlineLink: 'text-dev-bright border-border hover:border-dev',
        portrait: 'polaroid polaroid-dark',
        rule: 'border-border',
        skipLink: 'bg-fg text-base',
    },
    photo: {
        page: 'bg-cream text-ink',
        // Every gold carrying text on this path is `photo-ink`. The lighter
        // golds stay decorative here: on cream and white they measure 3.0:1
        // and 1.65:1, which is unreadable rather than merely subtle.
        accent: 'text-photo-ink',
        accentDeep: 'text-photo-ink',
        heading: 'text-ink',
        body: 'text-ink-dim',
        navMuted: 'text-ink-dim',
        card: 'bg-white border-cream-border hover:border-photo',
        cardHeading: 'text-photo-ink',
        cardBody: 'text-ink-dim',
        tag: 'text-photo-ink border-cream-border',
        outlineLink: 'text-photo-ink border-cream-border hover:border-photo',
        portrait: 'polaroid',
        rule: 'border-cream-border',
        skipLink: 'bg-ink text-cream',
    },
};

export const themeFor = (path) => themes[path] ?? themes.dev;
