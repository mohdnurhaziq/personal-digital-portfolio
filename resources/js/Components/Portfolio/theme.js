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
        accent: 'text-photo-deep',
        accentDeep: 'text-photo-deep',
        heading: 'text-ink',
        body: 'text-ink-dim',
        navMuted: 'text-ink-dim',
        card: 'bg-white border-cream-border hover:border-photo',
        cardHeading: 'text-photo-bright',
        cardBody: 'text-ink-dim',
        tag: 'text-photo-deep border-cream-border',
        outlineLink: 'text-photo-deep border-cream-border hover:border-photo',
        portrait: 'polaroid',
        rule: 'border-cream-border',
        skipLink: 'bg-ink text-cream',
    },
};

export const themeFor = (path) => themes[path] ?? themes.dev;
