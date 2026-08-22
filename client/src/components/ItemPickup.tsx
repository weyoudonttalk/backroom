import { useRef, memo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ItemDef } from '../items/ItemData';

interface ItemPickupProps {
  def: ItemDef;
  position: [number, number, number];
  onPickup: () => void;
  playerPos: THREE.Vector3;
}

function RedCrossModel() {
  return (
    <group>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.12, 0.35, 0.06]} />
        <meshStandardMaterial color="#ff2222" emissive="#ff0000" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.35, 0.12, 0.06]} />
        <meshStandardMaterial color="#ff2222" emissive="#ff0000" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[0, 0, -0.04]}>
        <boxGeometry args={[0.4, 0.4, 0.02]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>
    </group>
  );
}

function BurgerModel() {
  return (
    <group scale={[0.7, 0.7, 0.7]}>
      {/* Bottom bun */}
      <mesh position={[0, -0.06, 0]}>
        <cylinderGeometry args={[0.15, 0.16, 0.06, 8]} />
        <meshStandardMaterial color="#c8923a" roughness={0.8} />
      </mesh>
      {/* Patty */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.14, 0.14, 0.04, 8]} />
        <meshStandardMaterial color="#4a2a10" roughness={0.9} />
      </mesh>
      {/* Lettuce */}
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.15, 0.13, 0.02, 8]} />
        <meshStandardMaterial color="#44aa22" roughness={0.7} />
      </mesh>
      {/* Top bun */}
      <mesh position={[0, 0.08, 0]}>
        <sphereGeometry args={[0.15, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#d4a040" roughness={0.7} />
      </mesh>
    </group>
  );
}

function WaterBottleModel() {
  return (
    <group>
      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.07, 0.28, 8]} />
        <meshStandardMaterial color="#88ccff" transparent opacity={0.6} roughness={0.1} />
      </mesh>
      {/* Cap */}
      <mesh position={[0, 0.16, 0]}>
        <cylinderGeometry args={[0.035, 0.04, 0.05, 8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>
      {/* Water inside */}
      <mesh position={[0, -0.02, 0]}>
        <cylinderGeometry args={[0.05, 0.06, 0.2, 8]} />
        <meshStandardMaterial color="#4488ff" transparent opacity={0.4} />
      </mesh>
      {/* Label */}
      <mesh position={[0, 0, 0.065]}>
        <boxGeometry args={[0.08, 0.1, 0.005]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>
    </group>
  );
}

function getItemModel(def: ItemDef) {
  if (def.effect.health && def.effect.health > 0 && !def.effect.water && !def.effect.food) {
    return <RedCrossModel />;
  }
  if (def.effect.food && def.effect.food > 0 && !def.effect.water) {
    return <BurgerModel />;
  }
  if (def.effect.water && def.effect.water > 0) {
    return <WaterBottleModel />;
  }
  return null;
}

export const ItemPickup = memo(function ItemPickup({ def, position, onPickup, playerPos }: ItemPickupProps) {
  const groupRef = useRef<THREE.Group>(null);
  const collected = useRef(false);

  useFrame(({ clock }) => {
    if (!groupRef.current || collected.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.position.set(position[0], 0.15 + Math.sin(t * 2) * 0.02, position[2]);
    groupRef.current.rotation.y = t * 1.2;

    const dx = position[0] - playerPos.x;
    const dz = position[2] - playerPos.z;
    if (dx * dx + dz * dz < 2.25) {
      collected.current = true;
      onPickup();
    }
  });

  if (collected.current) return null;

  const specialModel = getItemModel(def);

  return (
    <group ref={groupRef} position={position}>
      {specialModel || (
        <mesh>
          {def.shape === 'sphere' && <sphereGeometry args={[def.scale[0], 8, 6]} />}
          {def.shape === 'box' && <boxGeometry args={def.scale} />}
          {def.shape === 'cylinder' && <cylinderGeometry args={[def.scale[0], def.scale[0], def.scale[1], 8]} />}
          <meshStandardMaterial
            color={def.color}
            emissive={def.emissive}
            emissiveIntensity={1.5}
            roughness={0.2}
          />
        </mesh>
      )}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]}>
        <circleGeometry args={[0.2, 8]} />
        <meshBasicMaterial color={def.emissive} transparent opacity={0.25} />
      </mesh>
    </group>
  );
});
