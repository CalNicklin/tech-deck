import { useGLTF } from "@react-three/drei";
import gsap from "gsap";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

interface TechDeckProps {
  isAnimating: boolean;
  animations: string[];
}

export default function TechDeck({ isAnimating, animations }: TechDeckProps) {
  const skateboardFile = useGLTF("/assets/skateboard.gltf");
  const skateboardRef = useRef<THREE.Group>(null);

  const animationFunctions = useMemo(
    () => ({
      flip: () => {
        if (!skateboardRef.current) return;
        gsap.set(skateboardRef.current.rotation, { z: 0 });
        return gsap.to(skateboardRef.current.rotation, {
          z: Math.PI * 2,
          duration: 0.8,
          ease: "power2.out",
        });
      },

      heelFlip: () => {
        if (!skateboardRef.current) return;
        gsap.set(skateboardRef.current.rotation, { z: 0 });
        return gsap.to(skateboardRef.current.rotation, {
          z: Math.PI * -2,
          duration: 0.8,
          ease: "power2.out",
        });
      },

      shuvit: () => {
        if (!skateboardRef.current) return;
        gsap.set(skateboardRef.current.rotation, { y: 0 });
        return gsap.to(skateboardRef.current.rotation, {
          y: Math.PI * 2,
          duration: 1,
          ease: "power2.out",
        });
      },

      ollie: () => {
        if (!skateboardRef.current) return;
        gsap.set(skateboardRef.current.position, { y: 0 });
        gsap.set(skateboardRef.current.rotation, { x: 0 });

        const tl = gsap.timeline();
        tl.to(skateboardRef.current.position, {
          y: 0.6,
          duration: 0.4,
          ease: "power2.out",
        })
          .to(
            skateboardRef.current.rotation,
            {
              x: Math.PI * 0.25,
              duration: 0.25,
              ease: "power1.out",
            },
            -0.07
          )
          .to(
            skateboardRef.current.rotation,
            {
              x: 0,
              duration: 0.4,
              ease: "power2.out",
            },
            0.1
          )
          .to(
            skateboardRef.current.position,
            {
              y: 0,
              duration: 0.3,
              ease: "power2.in",
            },
            0.4
          );
        return tl;
      },
    }),
    [skateboardRef]
  );

  useEffect(() => {
    if (isAnimating && animations.length > 0) {
      const timeline = gsap.timeline();
      animations.forEach((animation: string) => {
        if (animation in animationFunctions) {
          timeline.add(
            animationFunctions[animation as keyof typeof animationFunctions](),
            0
          );
        }
      });
    }
  }, [isAnimating, animations, animationFunctions]);

  return (
    <group ref={skateboardRef} rotation={[0, 0, 0]} scale={1.5}>
      <primitive object={skateboardFile.scene} dispose={null} />
    </group>
  );
}

useGLTF.preload("/assets/skateboard.gltf");

