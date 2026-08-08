import { lazy, Suspense, useEffect, useState } from 'react';
import usePrefersReducedMotion from './usePrefersReducedMotion';

// Lazily imported so three/@react-three never lands in the entry chunk; first
// paint must not wait on WebGL (see "Performance" in portfolio-plan.md).
const Scene = lazy(() => import('./Scene'));

/**
 * Decides whether the 3D field runs at all, and how heavy it should be.
 *
 * Returns null (a plain gradient shows through instead) when the visitor asked
 * for reduced motion or the device has no usable WebGL.
 */
function useSceneProfile() {
    const reducedMotion = usePrefersReducedMotion();
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        if (reducedMotion) {
            setProfile(null);
            return;
        }

        // A phone that can technically run WebGL still shouldn't run the
        // desktop particle count.
        const small = window.matchMedia('(max-width: 720px)').matches;
        const coarse = window.matchMedia('(pointer: coarse)').matches;

        let hasWebgl = false;
        try {
            const probe = document.createElement('canvas');
            hasWebgl = Boolean(
                probe.getContext('webgl2') || probe.getContext('webgl'),
            );
        } catch {
            hasWebgl = false;
        }

        if (!hasWebgl) {
            setProfile(null);
            return;
        }

        setProfile({ particleCount: small || coarse ? 600 : 1800 });
    }, [reducedMotion]);

    return profile;
}

export default function BackgroundScene({ visible = true }) {
    const profile = useSceneProfile();

    return (
        <div
            className={`pointer-events-none fixed inset-0 z-0 transition-opacity duration-700 ${
                visible ? 'opacity-100' : 'opacity-0'
            }`}
            aria-hidden="true"
        >
            {/* Always painted, so there is something behind the text even when
                the 3D scene is skipped or still loading. */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,#0d1626_0%,#070b14_70%)]" />

            {profile && (
                <Suspense fallback={null}>
                    <Scene particleCount={profile.particleCount} />
                </Suspense>
            )}
        </div>
    );
}
