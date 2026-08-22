import { useRef, memo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FluorescentLightProps {
  position: [number, number, number];
  lightColor?: string;
  lightIntensity?: number;
}

export const FluorescentLight = memo(function FluorescentLight({
  position,
  lightColor = '#fffde0',
  lightIntensity = 1.0,
}: FluorescentLightProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const flickerOffset = useRef(Math.random() * 1000);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime() + flickerOffset.current;
    const flicker = Math.sin(t * 60) * 0.04;
    const randomFlicker = Math.random() < 0.002 ? -0.3 : 0;
    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = Math.max(0.3, 0.88 + flicker + randomFlicker);
  });

  return (
    <group position={position}>
      {/* Fixture housing */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[1.2, 0.05, 0.3]} />
        <meshStandardMaterial color="#555555" roughness={0.7} metalness={0.2} />
      </mesh>
      {/* Light tube - emissive glow */}
      <mesh ref={meshRef} position={[0, -0.01, 0]}>
        <boxGeometry args={[1.0, 0.04, 0.1]} />
        <meshBasicMaterial color={lightColor} transparent opacity={0.9} />
      </mesh>
      {/* Glow plane below fixture for light pool effect */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.4, 0.6]} />
        <meshBasicMaterial color={lightColor} transparent opacity={0.12} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
});
