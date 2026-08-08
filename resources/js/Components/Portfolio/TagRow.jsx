import Reveal from './Reveal';

export default function TagRow({ tags, theme }) {
    if (!tags?.length) return null;

    return (
        <Reveal as="ul" className="mb-15 flex flex-wrap gap-2.5">
            {tags.map((label) => (
                <li
                    key={label}
                    className={`rounded-full border px-3.5 py-1.5 font-mono text-xs ${theme.tag}`}
                >
                    {label}
                </li>
            ))}
        </Reveal>
    );
}
