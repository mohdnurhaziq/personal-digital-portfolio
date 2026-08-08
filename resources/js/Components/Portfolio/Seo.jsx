import { Head, usePage } from '@inertiajs/react';

/**
 * Per-route metadata. Worth doing properly: for a portfolio the link preview in
 * a recruiter's inbox or a Slack message is often the first thing anyone sees.
 *
 * Rendered server-side, so crawlers get these without running any JavaScript.
 */
export default function Seo({ title, description, type = 'website', image }) {
    const { props } = usePage();
    const url = props.ziggy?.location;

    return (
        <Head title={title}>
            {description && <meta name="description" content={description} head-key="description" />}

            <meta property="og:type" content={type} head-key="og:type" />
            <meta property="og:title" content={title} head-key="og:title" />
            {description && (
                <meta property="og:description" content={description} head-key="og:description" />
            )}
            {url && <meta property="og:url" content={url} head-key="og:url" />}
            {image && <meta property="og:image" content={image} head-key="og:image" />}

            <meta
                name="twitter:card"
                content={image ? 'summary_large_image' : 'summary'}
                head-key="twitter:card"
            />
            <meta name="twitter:title" content={title} head-key="twitter:title" />
            {description && (
                <meta
                    name="twitter:description"
                    content={description}
                    head-key="twitter:description"
                />
            )}

            {url && <link rel="canonical" href={url} head-key="canonical" />}
        </Head>
    );
}
