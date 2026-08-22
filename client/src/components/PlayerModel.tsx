import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGame } from '../store/GameContext';

export function PlayerModel() {
  const { camera } = useThree();
  const { state } = useGame();
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!leftArmRef.current || !rightArmRef.current) return;

    const t = clock.getElapsedTime();
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);

    const baseY = state.isCrouching ? -0.4 : -0.5;
    const bobAmount = state.isSprinting ? 0.04 : 0.02;
    const bob = Math.sin(t * (state.isSprinting ? 12 : 8)) * bobAmount;

    // Position arms relative to camera
    leftArmRef.current.position.copy(camera.position);
    leftArmRef.current.position.x += forward.x * 0.3 - forward.z * 0.25;
    leftArmRef.current.position.z += forward.z * 0.3 + forward.x * 0.25;
    leftArmRef.current.position.y += baseY + bob;
    leftArmRef.current.rotation.copy(camera.rotation);

    rightArmRef.current.position.copy(camera.position);
    rightArmRef.current.position.x += forward.x * 0.3 + forward.z * 0.25;
    rightArmRef.current.position.z += forward.z * 0.3 - forward.x * 0.25;
    rightArmRef.current.position.y += baseY - bob;
    rightArmRef.current.rotation.copy(camera.rotation);
  });

  return (
    <>
      {/* Left arm */}
      <group ref={leftArmRef}>
        <mesh position={[0, 0, 0.15]} rotation={[1.2, 0, 0]}>
          <boxGeometry args={[0.06, 0.25, 0.06]} />
          <meshStandardMaterial color="#c4a882" roughness={0.8} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.05, 0.28]} rotation={[0.8, 0, 0]}>
          <boxGeometry args={[0.07, 0.04, 0.08]} />
          <meshStandardMaterial color="#d4b892" roughness={0.7} />
        </mesh>
      </group>
      {/* Right arm */}
      <group ref={rightArmRef}>
        <mesh position={[0, 0, 0.15]} rotation={[1.2, 0, 0]}>
          <boxGeometry args={[0.06, 0.25, 0.06]} />
          <meshStandardMaterial color="#c4a882" roughness={0.8} />
        </mesh>
        <mesh position={[0, -0.05, 0.28]} rotation={[0.8, 0, 0]}>
          <boxGeometry args={[0.07, 0.04, 0.08]} />
          <meshStandardMaterial color="#d4b892" roughness={0.7} />
        </mesh>
      </group>
    </>
  );
}
