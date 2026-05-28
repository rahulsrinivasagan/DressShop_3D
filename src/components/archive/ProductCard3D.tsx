import { Center, Environment, Html, OrbitControls, PerspectiveCamera, View } from "@react-three/drei";
import { memo, Suspense, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import * as THREE from "three";
import { SkeletonUtils } from "three-stdlib";
import { useGLTF } from "@react-three/drei";

function normalizeObject(root: THREE.Object3D, targetSize = 1.8) {
  const box = new THREE.Box3().setFromObject(root);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  const scale = maxDim > 0 ? targetSize / maxDim : 1;

  root.position.sub(center.multiplyScalar(scale));
  root.scale.setScalar(scale);
  root.position.y += 0.1;
}

function collectColorMaterials(root: THREE.Object3D) {
  const materials: THREE.Material[] = [];
  root.traverse((child) => {
    if (!(child as THREE.Mesh).isMesh) return;
    const mesh = child as THREE.Mesh;
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    mats.forEach((m) => {
      if (m && (m as THREE.MeshStandardMaterial).color) materials.push(m);
    });
  });
  return materials;
}

const ProductModel = memo(function ProductModel({
  url,
  colorHex,
  onLoaded,
}: {
  url: string;
  colorHex: string;
  onLoaded?: () => void;
}) {
  const gltf = useGLTF(url);

  const instance = useMemo(() => {
    const cloned = SkeletonUtils.clone(gltf.scene) as THREE.Object3D;
    normalizeObject(cloned);
    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = false;
        mesh.receiveShadow = false;
        if (mesh.material) {
          if (Array.isArray(mesh.material)) mesh.material = mesh.material.map((m) => m.clone());
          else mesh.material = mesh.material.clone();
        }
      }
    });
    return cloned;
  }, [gltf.scene]);

  const materials = useMemo(() => collectColorMaterials(instance), [instance]);

  useEffect(() => {
    const c = new THREE.Color(colorHex);
    materials.forEach((m) => {
      const mat = m as THREE.MeshStandardMaterial;
      if (!mat.color) return;
      mat.color.copy(c);
      mat.needsUpdate = true;
    });
  }, [colorHex, materials]);

  useEffect(() => {
    onLoaded?.();
  }, [onLoaded]);

  return <primitive object={instance} />;
});

function Loader() {
  return (
    <Html center>
      <div className="w-20 h-20 rounded-full border border-border bg-background/60 backdrop-blur-sm animate-pulse" />
    </Html>
  );
}

export const ProductCard3D = memo(function ProductCard3D({
  model,
  colorHex,
  className,
  onPointerDownCapture,
}: {
  model: string;
  colorHex: string;
  className?: string;
  onPointerDownCapture?: (e: ReactPointerEvent<HTMLDivElement>) => void;
}) {
  const track = useRef<HTMLDivElement>(null!);
  const [loaded, setLoaded] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) setInView(entry.isIntersecting);
      },
      { root: null, rootMargin: "250px", threshold: 0.01 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={track}
      className={className}
      onPointerDownCapture={onPointerDownCapture}
      style={{ touchAction: "none" }}
    >
      <div
        aria-hidden
        className={`absolute inset-0 transition-opacity duration-700 ease-[var(--ease-cinema)] ${
          loaded ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="w-full h-full bg-card" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/10 to-background/25" />
        <div className="absolute inset-0 animate-pulse bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.10),transparent_55%)]" />
      </div>

      {inView ? (
        <View track={track} className="absolute inset-0">
          <PerspectiveCamera makeDefault fov={42} position={[0, 0.4, 3.2]} />
          <ambientLight intensity={0.55} color={0xfaf9f7} />
          <directionalLight intensity={1.1} position={[4, 6, 5]} />
          <directionalLight intensity={0.45} position={[-4, 2, -3]} color={0xe8e4dc} />
          <directionalLight intensity={0.35} position={[0, 3, -5]} color={0xb8a88a} />

          <Environment preset="city" />

          <Center>
            <Suspense fallback={<Loader />}>
              <ProductModel url={model} colorHex={colorHex} onLoaded={() => setLoaded(true)} />
            </Suspense>
          </Center>

          <OrbitControls
            makeDefault
            enablePan={false}
            enableZoom
            enableDamping
            dampingFactor={0.06}
            minDistance={1.8}
            maxDistance={6}
            maxPolarAngle={Math.PI * 0.85}
            minPolarAngle={Math.PI * 0.2}
            autoRotate={!dragging}
            autoRotateSpeed={1.2}
            onStart={() => setDragging(true)}
            onEnd={() => setDragging(false)}
          />

        </View>
      ) : null}
    </div>
  );
});

if (typeof window !== "undefined") {
  const preload = () => {
    useGLTF.preload("/models/gown.glb");
    useGLTF.preload("/models/dress.glb");
    useGLTF.preload("/models/jacket.glb");
    useGLTF.preload("/models/jacket1.glb");
    useGLTF.preload("/models/shoes.glb");
  };

  // Keep first paint fast; warm the cache when the browser is idle.
  if ("requestIdleCallback" in window) (window as any).requestIdleCallback(preload);
  else setTimeout(preload, 250);
}
