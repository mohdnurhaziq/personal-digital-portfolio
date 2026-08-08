import { FaAws } from 'react-icons/fa';
import {
    SiFigma,
    SiJavascript,
    SiJira,
    SiLaravel,
    SiMysql,
    SiNodedotjs,
    SiNotion,
    SiPostgresql,
    SiReact,
    SiRedis,
    SiTypescript,
} from 'react-icons/si';

/**
 * The preview pulled these from cdn.simpleicons.org at runtime. Bundling them
 * instead means no third-party request on page load and no broken icons if that
 * CDN is unreachable — per portfolio-plan.md.
 *
 * Keyed by the Simple Icons slug stored on tech_stacks.icon_slug. AWS comes from
 * Font Awesome because Simple Icons dropped it over trademark policy.
 */
const icons = {
    laravel: SiLaravel,
    react: SiReact,
    nodedotjs: SiNodedotjs,
    typescript: SiTypescript,
    javascript: SiJavascript,
    mysql: SiMysql,
    postgresql: SiPostgresql,
    redis: SiRedis,
    amazonaws: FaAws,
    jira: SiJira,
    notion: SiNotion,
    figma: SiFigma,
};

export default function StackIcon({ slug, name }) {
    const Icon = icons[slug];

    return (
        <li className="flex w-13 flex-col items-center gap-1.5">
            {/* An unrecognised slug still renders its label — the skill is the
                point, the logo is decoration. */}
            {Icon ? (
                <Icon className="size-6.5 text-fg" aria-hidden="true" />
            ) : (
                <span className="size-6.5" aria-hidden="true" />
            )}
            <span className="text-center text-[10px] leading-tight text-fg-dim">{name}</span>
        </li>
    );
}
