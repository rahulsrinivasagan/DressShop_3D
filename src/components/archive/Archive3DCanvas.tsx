import { AdaptiveDpr, AdaptiveEvents, View } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { RefObject } from "react";

export function Archive3DCanvas({
  eventSource,
}: {
  eventSource: RefObject<HTMLElement>;
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      eventSource={eventSource}
      eventPrefix="client"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 20,
        pointerEvents: "none",
      }}
    >
      <View.Port />
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
    </Canvas>
  );
}
