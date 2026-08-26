import { useEffect, useMemo, useState } from 'react';
import { FaAws } from 'react-icons/fa';

/**
 * Simple Icons slugs contain only lowercase letters and numbers. Restricting the
 * admin value to that format keeps it safely inside the CDN path rather than
 * allowing it to become an arbitrary URL.
 */
const validSlug = /^[a-z0-9]+$/;

const initialsFor = (name) =>
    String(name ?? '')
        .trim()
        .split(/\s+/)
        .map((word) => word[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

export default function StackIcon({ slug, name }) {
    const normalizedSlug = String(slug ?? '').trim().toLowerCase();
    const [failed, setFailed] = useState(false);
    const iconUrl = useMemo(
        () =>
            validSlug.test(normalizedSlug)
                ? `https://cdn.simpleicons.org/${normalizedSlug}?viewbox=auto`
                : null,
        [normalizedSlug],
    );

    useEffect(() => setFailed(false), [iconUrl]);

    const isAws = normalizedSlug === 'amazonaws' || normalizedSlug === 'aws';

    return (
        <li className="flex w-16 flex-col items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-md bg-white/95 shadow-[inset_0_0_0_1px_rgba(7,11,20,0.1)]">
                {isAws ? (
                    <FaAws className="size-5.5 text-[#ff9900]" aria-hidden="true" />
                ) : iconUrl && !failed ? (
                    <img
                        src={iconUrl}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        className="size-5.5 object-contain"
                        aria-hidden="true"
                        onError={() => setFailed(true)}
                    />
                ) : (
                    <span
                        className="font-mono text-[10px] font-bold tracking-tight text-[#070b14]"
                        aria-hidden="true"
                    >
                        {initialsFor(name)}
                    </span>
                )}
            </span>
            <span className="text-center text-[10px] leading-tight text-fg-dim">{name}</span>
        </li>
    );
}
