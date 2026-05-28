import { AdaptiveDpr, Environment, Html, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { memo, Suspense, useEffect, useMemo } from "react";
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

const Model = memo(function Model({ url, colorHex }: { url: string; colorHex: string }) {
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

  return <primitive object={instance} />;
});

function Loader() {
  return (
    <Html center>
      <div className="w-24 h-24 rounded-full border border-border bg-background/60 backdrop-blur-sm animate-pulse" />
    </Html>
  );
}

export const ProductViewer3D = memo(function ProductViewer3D({
  model,
  colorHex,
  className,
}: {
  model: string;
  colorHex: string;
  className?: string;
}) {
  return (
    <div className={className} style={{ touchAction: "none" }}>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ fov: 42, position: [0, 0.4, 3.2] }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <AdaptiveDpr pixelated />
        <ambientLight intensity={0.55} color={0xfaf9f7} />
        <directionalLight intensity={1.1} position={[4, 6, 5]} />
        <directionalLight intensity={0.45} position={[-4, 2, -3]} color={0xe8e4dc} />
        <directionalLight intensity={0.35} position={[0, 3, -5]} color={0xb8a88a} />
        <Environment preset="city" />

        <Suspense fallback={<Loader />}>
          <Model url={model} colorHex={colorHex} />
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom
          enableDamping
          dampingFactor={0.06}
          minDistance={1.8}
          maxDistance={6}
          maxPolarAngle={Math.PI * 0.85}
          minPolarAngle={Math.PI * 0.2}
          autoRotate
          autoRotateSpeed={1.2}
        />
      </Canvas>
    </div>
  );
});

