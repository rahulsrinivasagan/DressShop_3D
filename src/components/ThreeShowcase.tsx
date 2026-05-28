import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, MeshDistortMaterial } from "@react-three/drei";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

export default function ThreeShowcase() {
  const root = useRef<HTMLElement>(null);
  const progress = useRef({ v: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(progress.current, {
        v: 1,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=250%",
          scrub: 1.2,
          pin: true,
        },
      });

      gsap.fromTo(
        ".three-title .line",
        { yPercent: 100 },
        {
          yPercent: 0,
          stagger: 0.2,
          ease: "expo.out",
          scrollTrigger: {
            trigger: root.current,
            start: "top center",
            end: "+=40%",
            scrub: 1,
          },
        },
      );

      gsap.utils.toArray<HTMLElement>(".three-detail").forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, x: i % 2 === 0 ? -40 : 40 },
          {
            opacity: 1,
            x: 0,
            scrollTrigger: {
              trigger: root.current,
              start: `top+=${(i + 1) * 25}% top`,
              end: `+=15%`,
              scrub: 1,
            },
          },
        );
      });
    }, root);
    return () => ctx.revert();
  }, [mounted]);

  return (
    <section ref={root} className="relative h-screen w-full overflow-hidden bg-background">
      <div className="absolute inset-0 z-0">
        {mounted && (
          <Canvas dpr={[1, 1.8]} camera={{ position: [0, 0, 8], fov: 32 }} gl={{ antialias: true, alpha: true }}>
            <ambientLight intensity={0.4} />
            <directionalLight position={[3, 4, 5]} intensity={1.6} color="#f5e6c8" />
            <directionalLight position={[-4, -2, 3]} intensity={0.6} color="#9aa8ff" />
            <DressObject progressRef={progress} />
            <Environment preset="studio" />
          </Canvas>
        )}
      </div>

      <div className="relative z-10 h-full w-full px-6 md:px-12 pt-32 pointer-events-none">
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-accent">04 — Form Study</p>
        <h3 className="three-title mt-6 text-6xl md:text-9xl font-display italic leading-[0.85] tracking-tighter">
          <span className="block overflow-hidden">
            <span className="line block text-foreground">Volume</span>
          </span>
          <span className="block overflow-hidden">
            <span className="line block not-italic font-sans font-extrabold text-accent">IN MOTION</span>
          </span>
        </h3>

        <div className="absolute bottom-16 left-6 md:left-12 right-6 md:right-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
          <div className="three-detail space-y-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-accent">Drape</span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Real-time fabric simulation. Light folds across the surface as the camera circles.
            </p>
          </div>
          <div className="three-detail space-y-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-accent">Light</span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Dual-source studio rig — warm key, cool fill. Mirrors our Chennai atelier.
            </p>
          </div>
          <div className="three-detail space-y-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-accent">Shadow</span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The negative space carries the silhouette. Sculpted entirely by raking light.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function DressObject({ progressRef }: { progressRef: React.MutableRefObject<{ v: number }> }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    const p = progressRef.current.v;
    if (!group.current) return;
    group.current.rotation.y = p * Math.PI * 2 + state.clock.elapsedTime * 0.15;
    group.current.rotation.x = Math.sin(p * Math.PI) * 0.25;
    const s = 1 + Math.sin(p * Math.PI) * 0.35;
    group.current.scale.setScalar(s);
    state.camera.position.z = 8 - p * 0.9;
    state.camera.position.y = Math.sin(p * Math.PI * 0.5) * 0.5;
    state.camera.lookAt(0, 0, 0);
  });
  return (
    <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.6}>
      <group ref={group}>
        {/* Bodice */}
        <mesh position={[0, 0.6, 0]}>
          <cylinderGeometry args={[0.22, 0.42, 0.85, 28]} />
          <MeshDistortMaterial color="#d2c2a1" roughness={0.32} metalness={0.18} distort={0.22} speed={1.05} />
        </mesh>

        {/* Straps */}
        <mesh position={[-0.22, 1.08, 0]} rotation={[0, 0, 0.25]}>
          <boxGeometry args={[0.08, 0.35, 0.08]} />
          <meshStandardMaterial color="#d2c2a1" roughness={0.4} metalness={0.05} />
        </mesh>
        <mesh position={[0.22, 1.08, 0]} rotation={[0, 0, -0.25]}>
          <boxGeometry args={[0.08, 0.35, 0.08]} />
          <meshStandardMaterial color="#d2c2a1" roughness={0.4} metalness={0.05} />
        </mesh>

        {/* Skirt */}
        <mesh position={[0, -0.35, 0]}>
          <cylinderGeometry args={[0.55, 1.2, 1.6, 34]} />
          <MeshDistortMaterial color="#c8b08a" roughness={0.3} metalness={0.15} distort={0.35} speed={1.1} />
        </mesh>
      </group>
    </Float>
  );
}
