import * as THREE from "three";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { GarmentVariant } from "@/lib/samples";

export default function Garment({
  color = "#202020",
  accent,
  variant = "aline",
  rotate = false,
}: {
  color?: string;
  accent?: string;
  variant?: GarmentVariant;
  rotate?: boolean;
}) {
  const mesh = useRef<THREE.Mesh>(null!);
  useFrame((_, delta) => {
    if (rotate && mesh.current) mesh.current.rotation.y += delta * 0.5;
  });

  const geometry = useMemo(() => {
    const pts: THREE.Vector2[] = [];
    const push = (x: number, y: number) => pts.push(new THREE.Vector2(x, y));

    switch (variant) {
      case "aline": {
        push(0.0, -1.2);
        push(0.35, -1.0);
        push(0.4, -0.6);
        push(0.38, -0.2);
        push(0.25, 0.4);
        push(0.2, 0.9);
        push(0.18, 1.2);
        break;
      }
      case "mermaid": {
        push(0.0, -1.2);
        push(0.2, -1.0);
        push(0.18, -0.6);
        push(0.22, -0.2);
        push(0.24, 0.2);
        push(0.2, 0.6);
        push(0.15, 1.1);
        break;
      }
      case "coat": {
        push(0.0, -1.2);
        push(0.28, -1.05);
        push(0.3, -0.6);
        push(0.3, -0.1);
        push(0.28, 0.5);
        push(0.26, 0.9);
        push(0.22, 1.2);
        break;
      }
      case "gown": {
        push(0.0, -1.2);
        push(0.38, -1.0);
        push(0.42, -0.5);
        push(0.35, 0.0);
        push(0.22, 0.6);
        push(0.18, 1.1);
        break;
      }
    }

    const geom = new THREE.LatheGeometry(pts, 128);
    geom.computeVertexNormals();
    return geom;
  }, [variant]);

  const material = useMemo(() => new THREE.MeshStandardMaterial({
    color,
    metalness: 0.3,
    roughness: 0.5,
  }), [color]);

  return (
    <group>
      <mesh ref={mesh} geometry={geometry} material={material} castShadow receiveShadow />
      {accent && (
        <mesh position={[0, 0.6, 0]} rotation={[0, 0, 0.02]}
          geometry={new THREE.TorusGeometry(0.1, 0.02, 32, 64)}
          material={new THREE.MeshStandardMaterial({ color: accent, metalness: 0.6, roughness: 0.2 })}
          castShadow
        />
      )}
    </group>
  );
}
