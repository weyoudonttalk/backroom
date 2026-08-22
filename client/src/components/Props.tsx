import { useMemo, memo } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGame } from '../store/GameContext';
import { LEVELS } from '../levels/LevelConfig';

function seededRandom(seed: number) {
  const x = Math.sin(seed * 127.1 + seed * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

interface PropData {
  type: string;
  x: number;
  z: number;
  rotation: number;
}

const PROP_RADIUS = 35;

const Pillar = memo(function Pillar({ x, z }: { x: number; z: number }) {
  return (
    <mesh position={[x, 1.5, z]}>
      <boxGeometry args={[0.3, 3, 0.3]} />
      <meshStandardMaterial color="#888888" roughness={0.9} />
    </mesh>
  );
});

const Pipe = memo(function Pipe({ x, z, rotation }: { x: number; z: number; rotation: number }) {
  return (
    <mesh position={[x, 2.6, z]} rotation={[0, rotation, Math.PI / 2]}>
      <cylinderGeometry args={[0.04, 0.04, 2.5, 6]} />
      <meshStandardMaterial color="#5a5a5a" metalness={0.6} roughness={0.4} />
    </mesh>
  );
});

const Desk = memo(function Desk({ x, z, rotation }: { x: number; z: number; rotation: number }) {
  return (
    <group position={[x, 0, z]} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[0.8, 0.05, 0.5]} />
        <meshStandardMaterial color="#6b4a2a" roughness={0.9} />
      </mesh>
      {[[-0.35, -0.2], [0.35, -0.2], [-0.35, 0.2], [0.35, 0.2]].map(([lx, lz], i) => (
        <mesh key={i} position={[lx, 0.2, lz]}>
          <boxGeometry args={[0.04, 0.4, 0.04]} />
          <meshStandardMaterial color="#5a3a1a" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
});

const Chair = memo(function Chair({ x, z, rotation }: { x: number; z: number; rotation: number }) {
  return (
    <group position={[x, 0, z]} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[0.35, 0.04, 0.35]} />
        <meshStandardMaterial color="#3a3a3a" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.45, -0.15]}>
        <boxGeometry args={[0.35, 0.35, 0.04]} />
        <meshStandardMaterial color="#3a3a3a" roughness={0.9} />
      </mesh>
    </group>
  );
});

const FilingCabinet = memo(function FilingCabinet({ x, z }: { x: number; z: number }) {
  return (
    <mesh position={[x, 0.5, z]}>
      <boxGeometry args={[0.4, 1.0, 0.35]} />
      <meshStandardMaterial color="#6a6a6a" metalness={0.3} roughness={0.7} />
    </mesh>
  );
});

const Debris = memo(function Debris({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.05, 0]} rotation={[0.2, 0.5, 0.1]}>
        <boxGeometry args={[0.3, 0.1, 0.2]} />
        <meshStandardMaterial color="#4a4030" roughness={1} />
      </mesh>
      <mesh position={[0.2, 0.03, 0.1]} rotation={[0.1, 1.2, 0]}>
        <boxGeometry args={[0.15, 0.06, 0.25]} />
        <meshStandardMaterial color="#5a5040" roughness={1} />
      </mesh>
    </group>
  );
});

const Barrel = memo(function Barrel({ x, z }: { x: number; z: number }) {
  return (
    <mesh position={[x, 0.4, z]}>
      <cylinderGeometry args={[0.2, 0.2, 0.8, 8]} />
      <meshStandardMaterial color="#4a6040" roughness={0.8} />
    </mesh>
  );
});

function getPropsForLevel(level: number): string[] {
  switch (level) {
    case 0: return ['debris'];
    case 1: return ['pipe', 'barrel', 'debris'];
    case 2: return ['pipe', 'barrel', 'debris'];
    case 3: return ['pipe', 'barrel', 'debris'];
    case 4: return ['desk', 'chair', 'filing', 'debris'];
    default: return ['debris'];
  }
}

function isOpenArea(gx: number, gz: number, level: number): boolean {
  if (Math.abs(gx) <= 2 && Math.abs(gz) <= 2) return true;
  const clusterX = Math.floor(gx / 5);
  const clusterZ = Math.floor(gz / 5);
  const clusterSeed = clusterX * 1000 + clusterZ + level * 7777;
  return seededRandom(clusterSeed) < 0.3;
}

export function Props() {
  const { state } = useGame();
  const { camera } = useThree();
  const levelConfig = LEVELS[state.level];
  const propTypes = getPropsForLevel(state.level);

  const props = useMemo(() => {
    const generated: PropData[] = [];
    const px = Math.round(camera.position.x);
    const pz = Math.round(camera.position.z);
    const spacing = levelConfig.roomSize * 2;
    const startX = Math.floor((px - PROP_RADIUS) / spacing) * spacing;
    const startZ = Math.floor((pz - PROP_RADIUS) / spacing) * spacing;

    for (let x = startX; x <= px + PROP_RADIUS; x += spacing) {
      for (let z = startZ; z <= pz + PROP_RADIUS; z += spacing) {
        const seed = x * 7919 + z * 10007 + state.level * 54321;
        if (seededRandom(seed) > 0.4) continue;
        const dx = x - px;
        const dz = z - pz;
        if (dx * dx + dz * dz > PROP_RADIUS * PROP_RADIUS) continue;
        const gx = Math.round(x / levelConfig.roomSize);
        const gz = Math.round(z / levelConfig.roomSize);
        if (isOpenArea(gx, gz, state.level)) continue;
        const type = propTypes[Math.floor(seededRandom(seed + 1) * propTypes.length)];
        const offsetX = (seededRandom(seed + 2) - 0.5) * levelConfig.roomSize * 0.6;
        const offsetZ = (seededRandom(seed + 3) - 0.5) * levelConfig.roomSize * 0.6;
        generated.push({ type, x: x + offsetX, z: z + offsetZ, rotation: seededRandom(seed + 4) * Math.PI * 2 });
      }
    }
    return generated;
  }, [Math.floor(camera.position.x / 8), Math.floor(camera.position.z / 8), state.level]);

  return (
    <group>
      {props.map((p, i) => {
        switch (p.type) {
          case 'pillar': return <Pillar key={i} x={p.x} z={p.z} />;
          case 'pipe': return <Pipe key={i} x={p.x} z={p.z} rotation={p.rotation} />;
          case 'desk': return <Desk key={i} x={p.x} z={p.z} rotation={p.rotation} />;
          case 'chair': return <Chair key={i} x={p.x} z={p.z} rotation={p.rotation} />;
          case 'filing': return <FilingCabinet key={i} x={p.x} z={p.z} />;
          case 'debris': return <Debris key={i} x={p.x} z={p.z} />;
          case 'barrel': return <Barrel key={i} x={p.x} z={p.z} />;
          default: return null;
        }
      })}
    </group>
  );
}
