import { useRef, memo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RemotePlayer, useMultiplayer } from '../hooks/useMultiplayer';
import { useGame } from '../store/GameContext';

const OtherPlayer = memo(function OtherPlayer({ player }: { player: RemotePlayer }) {
  const groupRef = useRef<THREE.Group>(null);
  const targetPos = useRef(new THREE.Vector3(player.x, 0, player.z));
  const targetRot = useRef(player.rotationY);

  useFrame(() => {
    if (!groupRef.current) return;
    targetPos.current.set(player.x, 0, player.z);
    targetRot.current = player.rotationY;

    groupRef.current.position.lerp(targetPos.current, 0.15);
    groupRef.current.rotation.y += (targetRot.current - groupRef.current.rotation.y) * 0.15;
  });

  const height = player.isCrouching ? 1.0 : 1.6;

  return (
    <group ref={groupRef} position={[player.x, 0, player.z]}>
      {/* Body */}
      <mesh position={[0, height - 0.4, 0]}>
        <boxGeometry args={[0.35, 0.5, 0.2]} />
        <meshStandardMaterial color="#4488cc" roughness={0.7} />
      </mesh>
      {/* Head */}
      <mesh position={[0, height, 0]}>
        <sphereGeometry args={[0.14, 8, 6]} />
        <meshStandardMaterial color="#ffcc88" roughness={0.8} />
      </mesh>
      {/* Arms */}
      <mesh position={[-0.24, height - 0.4, 0]}>
        <boxGeometry args={[0.08, 0.4, 0.08]} />
        <meshStandardMaterial color="#4488cc" roughness={0.7} />
      </mesh>
      <mesh position={[0.24, height - 0.4, 0]}>
        <boxGeometry args={[0.08, 0.4, 0.08]} />
        <meshStandardMaterial color="#4488cc" roughness={0.7} />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.08, height - 0.9, 0]}>
        <boxGeometry args={[0.1, 0.45, 0.1]} />
        <meshStandardMaterial color="#334466" roughness={0.8} />
      </mesh>
      <mesh position={[0.08, height - 0.9, 0]}>
        <boxGeometry args={[0.1, 0.45, 0.1]} />
        <meshStandardMaterial color="#334466" roughness={0.8} />
      </mesh>
      {/* Nametag glow */}
      <pointLight color="#4488cc" intensity={0.3} distance={3} decay={2} position={[0, height + 0.3, 0]} />
    </group>
  );
});

export function MultiplayerPlayers() {
  const { state } = useGame();
  const { camera } = useThree();
  const { players, sendPosition, connected, playerCount } = useMultiplayer(state.level);
  const sendTimer = useRef(0);

  useFrame((_, delta) => {
    sendTimer.current += delta;
    if (sendTimer.current > 0.05) {
      sendTimer.current = 0;
      sendPosition(
        camera.position.x,
        camera.position.y,
        camera.position.z,
        camera.rotation.y,
        state.isCrouching
      );
    }
  });

  return (
    <>
      {players.map(p => (
        <OtherPlayer key={p.id} player={p} />
      ))}
    </>
  );
}
