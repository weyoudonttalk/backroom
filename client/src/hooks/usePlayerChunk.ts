import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

const CHUNK_RADIUS = 44;

export function usePlayerChunk() {
  const { camera } = useThree();
  const playerPos = useRef({ x: 0, z: 0 });

  useFrame(() => {
    playerPos.current.x = camera.position.x;
    playerPos.current.z = camera.position.z;
  });

  return {
    isVisible: (x: number, z: number) => {
      const dx = x - playerPos.current.x;
      const dz = z - playerPos.current.z;
      return dx * dx + dz * dz < CHUNK_RADIUS * CHUNK_RADIUS;
    },
    getPlayerPos: () => playerPos.current,
  };
}
