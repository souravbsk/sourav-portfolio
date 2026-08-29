"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, type ThreeElements } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

type SceneTheme = {
  core: string;
  shell: string;
  satellites: [string, string, string];
  key: string;
  fill: string;
};

const THEMES: Record<"dark" | "light", SceneTheme> = {
  dark: {
    core: "#3fe6d6",
    shell: "#9c7cff",
    satellites: ["#9c7cff", "#3fe6d6", "#ffb673"],
    key: "#eaf1ff",
    fill: "#9c7cff",
  },
  light: {
    core: "#0f9b90",
    shell: "#6b4bd8",
    satellites: ["#6b4bd8", "#0f9b90", "#b8611a"],
    key: "#ffffff",
    fill: "#6b4bd8",
  },
};

/**
 * A stepped luminance ramp. MeshToonMaterial samples this instead of shading
 * smoothly, which is what produces the flat cartoon banding the brief asks for
 * rather than a photoreal PBR falloff.
 */
function useToonGradient(steps = 3) {
  return useMemo(() => {
    const data = new Uint8Array(steps);
    for (let i = 0; i < steps; i += 1) {
      data[i] = Math.round((255 * (i + 1)) / steps);
    }

    const texture = new THREE.DataTexture(data, steps, 1, THREE.RedFormat);
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
    texture.generateMipmaps = false;
    texture.needsUpdate = true;
    return texture;
  }, [steps]);
}

type SatelliteProps = {
  radius: number;
  speed: number;
  tilt: [number, number, number];
  size: number;
  color: string;
  gradientMap: THREE.DataTexture;
  offset: number;
  animate: boolean;
};

function Satellite({
  radius,
  speed,
  tilt,
  size,
  color,
  gradientMap,
  offset,
  animate,
}: SatelliteProps) {
  const orbit = useRef<THREE.Group>(null);
  const body = useRef<THREE.Mesh>(null);

  useFrame((_state, delta) => {
    if (!animate) return;
    if (orbit.current) orbit.current.rotation.y += delta * speed;
    if (body.current) {
      body.current.rotation.x += delta * speed * 1.6;
      body.current.rotation.y += delta * speed * 1.1;
    }
  });

  return (
    <group rotation={tilt}>
      <group ref={orbit} rotation={[0, offset, 0]}>
        <mesh ref={body} position={[radius, 0, 0]} castShadow={false}>
          <octahedronGeometry args={[size, 0]} />
          <meshToonMaterial color={color} gradientMap={gradientMap} />
        </mesh>
      </group>

      {/* The orbit path itself, drawn thin so it reads as a guide not a ring. */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.006, 6, 128]} />
        <meshBasicMaterial color={color} transparent opacity={0.28} />
      </mesh>
    </group>
  );
}

function Core({
  theme,
  gradientMap,
  animate,
}: {
  theme: SceneTheme;
  gradientMap: THREE.DataTexture;
  animate: boolean;
}) {
  const core = useRef<THREE.Mesh>(null);
  const shell = useRef<THREE.Mesh>(null);

  useFrame((_state, delta) => {
    if (!animate) return;
    if (core.current) core.current.rotation.y += delta * 0.14;
    if (shell.current) {
      shell.current.rotation.y -= delta * 0.08;
      shell.current.rotation.x += delta * 0.04;
    }
  });

  return (
    <group>
      <mesh ref={core}>
        <icosahedronGeometry args={[1.05, 1]} />
        <meshToonMaterial color={theme.core} gradientMap={gradientMap} />
      </mesh>

      <mesh ref={shell}>
        <icosahedronGeometry args={[1.65, 1]} />
        <meshBasicMaterial
          color={theme.shell}
          wireframe
          transparent
          opacity={0.42}
        />
      </mesh>
    </group>
  );
}

function Rig({
  theme,
  animate,
  children,
}: {
  theme: SceneTheme;
  animate: boolean;
  children: React.ReactNode;
} & Omit<ThreeElements["group"], "children">) {
  const group = useRef<THREE.Group>(null);
  void theme;

  useFrame((state, delta) => {
    if (!group.current || !animate) return;

    // Pointer is already normalised to -1..1 by r3f. The rotation is kept small
    // so the parallax reads as depth rather than as the object being dragged.
    const targetY = state.pointer.x * 0.35;
    const targetX = -state.pointer.y * 0.22;

    const lerp = 1 - Math.pow(0.001, delta);
    group.current.rotation.y += (targetY - group.current.rotation.y) * lerp;
    group.current.rotation.x += (targetX - group.current.rotation.x) * lerp;
  });

  return <group ref={group}>{children}</group>;
}

export type HeroSceneProps = {
  themeName: "dark" | "light";
  animate: boolean;
  quality: "high" | "low";
};

export default function HeroScene({
  themeName,
  animate,
  quality,
}: HeroSceneProps) {
  const theme = THEMES[themeName];
  const gradientMap = useToonGradient(3);

  return (
    <Canvas
      camera={{ position: [0, 0.4, 6], fov: 42 }}
      dpr={quality === "high" ? [1, 1.75] : 1}
      gl={{ antialias: quality === "high", alpha: true }}
      // No animation loop at all when motion is reduced: the scene renders once.
      frameloop={animate ? "always" : "demand"}
      style={{ pointerEvents: "none" }}
    >
      <ambientLight intensity={themeName === "dark" ? 0.55 : 0.85} />
      <directionalLight position={[4, 5, 5]} intensity={2.1} color={theme.key} />
      <directionalLight position={[-5, -2, -3]} intensity={1.1} color={theme.fill} />

      <Rig theme={theme} animate={animate}>
        <Float
          speed={animate ? 1.1 : 0}
          rotationIntensity={animate ? 0.22 : 0}
          floatIntensity={animate ? 0.5 : 0}
          floatingRange={[-0.12, 0.12]}
        >
          <Core theme={theme} gradientMap={gradientMap} animate={animate} />

          <Satellite
            radius={2.5}
            speed={0.55}
            tilt={[0.4, 0, 0.18]}
            size={0.26}
            color={theme.satellites[0]}
            gradientMap={gradientMap}
            offset={0}
            animate={animate}
          />
          <Satellite
            radius={3.15}
            speed={0.34}
            tilt={[-0.55, 0, -0.3]}
            size={0.2}
            color={theme.satellites[1]}
            gradientMap={gradientMap}
            offset={2.1}
            animate={animate}
          />
          <Satellite
            radius={3.8}
            speed={0.22}
            tilt={[0.18, 0, 0.62]}
            size={0.15}
            color={theme.satellites[2]}
            gradientMap={gradientMap}
            offset={4.2}
            animate={animate}
          />
        </Float>
      </Rig>
    </Canvas>
  );
}
