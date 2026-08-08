import Reveal from './Reveal';

/**
 * `span` drives the asymmetric project grid: 'big' cards take two thirds of the
 * row, 'small' cards a third, so the grid has rhythm instead of uniform boxes.
 */
const spans = {
    big: 'md:col-span-4',
    small: 'md:col-span-2',
    full: 'md:col-span-6',
};

export default function Card({ theme, span = 'small', title, children, className = '', ...props }) {
    return (
        <Reveal
            // min-h-65 (260px) matches the reference design's card height, which
            // is what gives each grid row its even rhythm.
            className={`col-span-6 min-h-65 rounded-[10px] border p-7 transition-colors duration-300 ${spans[span] ?? spans.small} ${theme.card} ${className}`}
            {...props}
        >
            {title && (
                <h3 className={`mb-2.5 font-display text-[22px] font-semibold ${theme.cardHeading}`}>
                    {title}
                </h3>
            )}
            {children}
        </Reveal>
    );
}
