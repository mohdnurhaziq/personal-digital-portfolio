import { useEffect, useRef } from 'react';

/**
 * Fades content up as it scrolls into view.
 *
 * Reveal-on-scroll is decorative, so it must never be the reason content is
 * invisible: if the observer is unavailable or the user asked for reduced
 * motion, the element is shown immediately.
 */
export default function Reveal({ as: Tag = 'div', className = '', children, ...props }) {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReduced || typeof IntersectionObserver === 'undefined') {
            el.classList.add('in-view');
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add('in-view');
                    // One-shot: content stays visible once revealed.
                    observer.unobserve(entry.target);
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
        );

        observer.observe(el);

        return () => observer.disconnect();
    }, []);

    return (
        <Tag ref={ref} className={`reveal ${className}`} {...props}>
            {children}
        </Tag>
    );
}
