import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

const BASE_COUNT = 1800;
const FIELD_RADIUS = 14;

/**
 * Points distributed evenly through a sphere. The cube root is what keeps them
 * from bunching at the centre — sampling radius linearly would.
 */
function useParticlePositions(count) {
    return useMemo(() => {
        const positions = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            const r = FIELD_RADIUS * Math.cbrt(Math.random());
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);

            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = r * Math.cos(phi);
        }

        return positions;
    }, [count]);
}

function scrollProgress() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    return scrollable > 0 ? window.scrollY / scrollable : 0;
}

function SceneContents({ particleCount }) {
    const particlesRef = useRef();
    const wireRef = useRef();
    const pointer = useRef({ x: 0, y: 0 });
    const positions = useParticlePositions(particleCount);
    const { camera } = useThree();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        const progress = scrollProgress();

        // r3f normalises pointer to -1..1 already, unlike the raw preview code.
        pointer.current.x = state.pointer.x;
        pointer.current.y = state.pointer.y;

        if (wireRef.current) {
            wireRef.current.rotation.y = -t * 0.08;
            wireRef.current.rotation.x = t * 0.05;
        }

        if (particlesRef.current) {
            particlesRef.current.rotation.y = t * 0.02 + progress * 0.6;
        }

        // Dolly the camera through the field as the page scrolls, with a little
        // lag on the mouse so it feels weighted rather than glued to the cursor.
        camera.position.z = 8 - progress * 4.5;
        camera.position.x += (pointer.current.x * 0.6 - camera.position.x) * 0.04;
        camera.position.y += (pointer.current.y * 0.4 - camera.position.y) * 0.04;
        camera.lookAt(0, 0, 0);
    });

    return (
        <>
            <fogExp2 attach="fog" args={[0x070b14, 0.045]} />

            <points ref={particlesRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        args={[positions, 3]}
                        count={particleCount}
                    />
                </bufferGeometry>
                <pointsMaterial
                    color={0x5b8def}
                    size={0.035}
                    transparent
                    opacity={0.5}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </points>

            <mesh ref={wireRef}>
                <icosahedronGeometry args={[2.6, 1]} />
                <meshBasicMaterial color={0x5b8def} wireframe transparent opacity={0.12} />
            </mesh>
        </>
    );
}

export default function Scene({
    particleCount = BASE_COUNT,
    dpr = [1, 2],
    antialias = true,
    powerPreference = 'high-performance',
}) {
    return (
        <Canvas
            className="pointer-events-none"
            camera={{ fov: 55, position: [0, 0, 8], near: 0.1, far: 100 }}
            // Mobile is fixed at 1x while desktop may render up to 2x. An
            // uncapped 3x phone buffer is the biggest avoidable scene cost.
            dpr={dpr}
            gl={{ antialias, alpha: true, powerPreference }}
        >
            <SceneContents particleCount={particleCount} />
        </Canvas>
    );
}
