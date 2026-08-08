import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Every piece of motion on this site checks this first. Reduced motion is not a
 * "nice to have" here: the site is heavy enough that ignoring the preference
 * would make it unusable for some visitors.
 */
export default function usePrefersReducedMotion() {
    // Assume reduced until the media query is read, so nothing animates during
    // the first paint for someone who asked for stillness.
    const [reduced, setReduced] = useState(true);

    useEffect(() => {
        const mq = window.matchMedia(QUERY);
        setReduced(mq.matches);

        const onChange = (event) => setReduced(event.matches);
        mq.addEventListener('change', onChange);

        return () => mq.removeEventListener('change', onChange);
    }, []);

    return reduced;
}
