"use client";

import { Canvas } from "@react-three/fiber";
import TechDeck from "./tech-deck";
import { ContactShadows, OrbitControls } from "@react-three/drei";

interface SceneProps {
  isAnimating: boolean;
  animations: string[];
}

export default function Scene({ isAnimating, animations }: SceneProps) {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [3, 2, 2], fov: 30 }}>
        {/* <color attach="background" args={["#1a1a1a"]} /> */}
        <ambientLight intensity={0.5} />
        <directionalLight intensity={7} position={[1, 2, 3]} />
        <TechDeck isAnimating={isAnimating} animations={animations} />
        <ContactShadows opacity={0.5} position={[0, -0.1, 0]} />
        <axesHelper scale={2} />
        <OrbitControls />
      </Canvas>
    </div>
  );
}
