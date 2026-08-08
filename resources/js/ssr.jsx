import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { renderToString } from 'react-dom/server';
import { route } from 'ziggy-js';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

/**
 * Server-side render entry.
 *
 * The point of this is SEO and resilience: without it the served HTML is an
 * empty <div id="app"> and every heading, project, and photo caption lives only
 * in the data-page JSON. Recruiters' browsers and crawlers with flaky JS would
 * see nothing (see "Performance & accessibility" in portfolio-plan.md).
 *
 * Everything motion-related — the 3D scene, custom cursor, digit rain, drifting
 * polaroids — reads the DOM inside effects only, which never run on the server,
 * so those components render to nothing here and hydrate on the client.
 */
createServer((page) =>
    createInertiaApp({
        page,
        render: renderToString,
        title: (title) => `${title} - ${appName}`,
        resolve: (name) =>
            resolvePageComponent(
                `./Pages/${name}.jsx`,
                import.meta.glob('./Pages/**/*.jsx'),
            ),
        setup: ({ App, props }) => {
            // Breeze's auth pages call the global route(). On the client that
            // comes from the @routes directive; here it has to be built from the
            // shared Ziggy props.
            global.route = (name, params, absolute) =>
                route(name, params, absolute, {
                    ...page.props.ziggy,
                    location: new URL(page.props.ziggy.location),
                });

            return <App {...props} />;
        },
    }),
);
