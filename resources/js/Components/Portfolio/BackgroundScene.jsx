import { lazy, Suspense, useEffect, useState } from 'react';
import usePrefersReducedMotion from './usePrefersReducedMotion';
import {
    COARSE_POINTER_QUERY,
    MOBILE_SCENE_QUERY,
    sceneProfileForDevice,
} from './sceneProfile';

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

        const small = window.matchMedia(MOBILE_SCENE_QUERY);
        const coarse = window.matchMedia(COARSE_POINTER_QUERY);

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

        const update = () =>
            setProfile(
                sceneProfileForDevice({
                    small: small.matches,
                    coarse: coarse.matches,
                }),
            );

        update();
        small.addEventListener('change', update);
        coarse.addEventListener('change', update);

        return () => {
            small.removeEventListener('change', update);
            coarse.removeEventListener('change', update);
        };
    }, [reducedMotion]);

    return profile;
}

export default function BackgroundScene({ visible = true }) {
    const profile = useSceneProfile();

    // Hiding the scene used to mean fading it to opacity-0 and leaving it
    // running. On the photographer path — an opaque cream ground it can never
    // show through — that cost 892 KB of three plus a live WebGL render loop
    // for something invisible. It now unmounts instead.
    //
    // The unmount trails the 700ms fade so the landing page's hand-off to the
    // fork still cross-fades rather than popping.
    const [mounted, setMounted] = useState(visible);

    useEffect(() => {
        if (visible) {
            setMounted(true);
            return;
        }

        const timer = setTimeout(() => setMounted(false), 700);

        return () => clearTimeout(timer);
    }, [visible]);

    return (
        <div
            data-scene-quality={profile?.quality ?? 'static'}
            className={`pointer-events-none fixed inset-0 z-0 transition-opacity duration-700 ${
                visible ? 'opacity-100' : 'opacity-0'
            }`}
            aria-hidden="true"
        >
            {/* Always painted, so there is something behind the text even when
                the 3D scene is skipped or still loading. */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,#0d1626_0%,#070b14_70%)]" />

            {mounted && profile && (
                <Suspense fallback={null}>
                    <Scene
                        key={profile.quality}
                        particleCount={profile.particleCount}
                        dpr={profile.dpr}
                        antialias={profile.antialias}
                        powerPreference={profile.powerPreference}
                    />
                </Suspense>
            )}
        </div>
    );
}
