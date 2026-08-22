import { useRef, memo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { EntityDef, EntityState } from '../entities/EntityData';

interface EntityProps {
  def: EntityDef;
  position: THREE.Vector3;
  state: EntityState;
}

function SmilerModel({ state }: { state: EntityState }) {
  const intensity = state === 'chase' ? 4 : state === 'alert' ? 2.5 : 1.5;
  return (
    <group>
      {/* Invisible dark mass - barely perceptible */}
      <mesh position={[0, 1.4, 0]}>
        <sphereGeometry args={[0.35, 8, 6]} />
        <meshStandardMaterial color="#010101" roughness={1} transparent opacity={0.3} />
      </mesh>
      {/* Two glowing eyes - the signature feature */}
      <mesh position={[-0.09, 1.48, 0.28]}>
        <circleGeometry args={[0.04, 8]} />
        <meshBasicMaterial color="#ffff00" />
      </mesh>
      <mesh position={[0.09, 1.48, 0.28]}>
        <circleGeometry args={[0.04, 8]} />
        <meshBasicMaterial color="#ffff00" />
      </mesh>
      {/* Wide hostile grin - curved line of teeth */}
      <mesh position={[0, 1.3, 0.28]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.11, 0.012, 4, 20, Math.PI]} />
        <meshBasicMaterial color="#ffff00" />
      </mesh>
      {/* Sharp teeth along the grin */}
      {[-0.09, -0.06, -0.03, 0, 0.03, 0.06, 0.09].map((x, i) => (
        <mesh key={i} position={[x, 1.235, 0.29]}>
          <coneGeometry args={[0.008, 0.03, 3]} />
          <meshBasicMaterial color="#ffff00" />
        </mesh>
      ))}
      <pointLight color="#ffff00" intensity={intensity} distance={6} decay={2} position={[0, 1.4, 0.3]} />
    </group>
  );
}

function HoundModel({ state }: { state: EntityState }) {
  const eyeColor = state === 'chase' ? '#ff0000' : '#ff4400';
  return (
    <group>
      {/* Muscular body - crawls on all fours */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[0.35, 0.3, 0.8]} />
        <meshStandardMaterial color="#1a0808" roughness={0.95} />
      </mesh>
      {/* Ribcage */}
      <mesh position={[0, 0.42, -0.1]}>
        <boxGeometry args={[0.38, 0.25, 0.4]} />
        <meshStandardMaterial color="#200e0e" roughness={0.9} />
      </mesh>
      {/* Mangled head */}
      <mesh position={[0, 0.5, 0.4]}>
        <boxGeometry args={[0.24, 0.22, 0.25]} />
        <meshStandardMaterial color="#2a1010" roughness={0.9} />
      </mesh>
      {/* Long matted hair strands */}
      {[-0.1, -0.05, 0, 0.05, 0.1].map((x, i) => (
        <mesh key={`hair${i}`} position={[x, 0.6, 0.35]} rotation={[0.3, 0, (i - 2) * 0.1]}>
          <cylinderGeometry args={[0.008, 0.005, 0.25, 3]} />
          <meshStandardMaterial color="#1a0505" roughness={1} />
        </mesh>
      ))}
      {[-0.08, 0, 0.08].map((x, i) => (
        <mesh key={`hair2${i}`} position={[x, 0.58, 0.28]} rotation={[-0.2, 0, (i - 1) * 0.15]}>
          <cylinderGeometry args={[0.006, 0.004, 0.2, 3]} />
          <meshStandardMaterial color="#2a0808" roughness={1} />
        </mesh>
      ))}
      {/* Mangled jaw / snout with exposed teeth */}
      <mesh position={[0, 0.43, 0.56]}>
        <boxGeometry args={[0.14, 0.1, 0.16]} />
        <meshStandardMaterial color="#1a0808" roughness={0.9} />
      </mesh>
      {/* Exposed teeth */}
      <mesh position={[0, 0.4, 0.64]}>
        <boxGeometry args={[0.1, 0.03, 0.04]} />
        <meshBasicMaterial color="#ccccaa" />
      </mesh>
      {/* Bloodshot eyes */}
      <mesh position={[-0.08, 0.54, 0.52]}>
        <sphereGeometry args={[0.028, 5, 5]} />
        <meshBasicMaterial color={eyeColor} />
      </mesh>
      <mesh position={[0.08, 0.54, 0.52]}>
        <sphereGeometry args={[0.028, 5, 5]} />
        <meshBasicMaterial color={eyeColor} />
      </mesh>
      {/* Four limbs - crawling posture */}
      {[[-0.14, 0.3], [0.14, 0.3], [-0.14, -0.3], [0.14, -0.3]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.17, z]}>
          <boxGeometry args={[0.07, 0.34, 0.07]} />
          <meshStandardMaterial color="#1a0808" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function FacelingModel({ state }: { state: EntityState }) {
  return (
    <group>
      {/* Smooth featureless head */}
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.14, 10, 8]} />
        <meshStandardMaterial color="#d4b898" roughness={0.6} />
      </mesh>
      {/* Body - plain clothes */}
      <mesh position={[0, 1.0, 0]}>
        <boxGeometry args={[0.3, 0.6, 0.18]} />
        <meshStandardMaterial color="#8a7a6a" roughness={0.9} />
      </mesh>
      {/* Arms */}
      <mesh position={[-0.22, 1.0, 0]}>
        <boxGeometry args={[0.08, 0.5, 0.08]} />
        <meshStandardMaterial color="#8a7a6a" roughness={0.9} />
      </mesh>
      <mesh position={[0.22, 1.0, 0]}>
        <boxGeometry args={[0.08, 0.5, 0.08]} />
        <meshStandardMaterial color="#8a7a6a" roughness={0.9} />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.08, 0.4, 0]}>
        <boxGeometry args={[0.1, 0.6, 0.1]} />
        <meshStandardMaterial color="#5a4a3a" roughness={0.9} />
      </mesh>
      <mesh position={[0.08, 0.4, 0]}>
        <boxGeometry args={[0.1, 0.6, 0.1]} />
        <meshStandardMaterial color="#5a4a3a" roughness={0.9} />
      </mesh>
    </group>
  );
}

function SkinStealerModel({ state }: { state: EntityState }) {
  const eyeColor = state === 'chase' ? '#ff8800' : '#ff6600';
  return (
    <group>
      {/* Head - ill-fitting skin draped over skull */}
      <mesh position={[0, 1.7, 0]}>
        <sphereGeometry args={[0.13, 8, 6]} />
        <meshStandardMaterial color="#c8a080" roughness={0.6} />
      </mesh>
      {/* Sagging skin flap under chin */}
      <mesh position={[0, 1.58, 0.06]}>
        <boxGeometry args={[0.1, 0.06, 0.04]} />
        <meshStandardMaterial color="#b89070" roughness={0.7} />
      </mesh>
      {/* Eyes peering through stolen skin */}
      <mesh position={[-0.04, 1.72, 0.11]}>
        <sphereGeometry args={[0.02, 4, 4]} />
        <meshBasicMaterial color={eyeColor} />
      </mesh>
      <mesh position={[0.04, 1.72, 0.11]}>
        <sphereGeometry args={[0.02, 4, 4]} />
        <meshBasicMaterial color={eyeColor} />
      </mesh>
      {/* Torso - skin stretched over wrong proportions */}
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[0.3, 0.7, 0.15]} />
        <meshStandardMaterial color="#b89070" roughness={0.7} />
      </mesh>
      {/* Visible seam lines on torso */}
      <mesh position={[0, 1.2, 0.08]}>
        <boxGeometry args={[0.01, 0.5, 0.01]} />
        <meshStandardMaterial color="#6a3020" roughness={0.9} />
      </mesh>
      <mesh position={[0.1, 1.2, 0.07]}>
        <boxGeometry args={[0.01, 0.3, 0.01]} />
        <meshStandardMaterial color="#6a3020" roughness={0.9} />
      </mesh>
      {/* Elongated arms - too long for the skin */}
      <mesh position={[-0.22, 1.0, 0]} rotation={[0, 0, 0.08]}>
        <boxGeometry args={[0.07, 0.85, 0.07]} />
        <meshStandardMaterial color="#c8a080" roughness={0.7} />
      </mesh>
      <mesh position={[0.22, 1.0, 0]} rotation={[0, 0, -0.08]}>
        <boxGeometry args={[0.07, 0.85, 0.07]} />
        <meshStandardMaterial color="#c8a080" roughness={0.7} />
      </mesh>
      {/* Clawed fingers poking through */}
      <mesh position={[-0.24, 0.52, 0]}>
        <coneGeometry args={[0.02, 0.08, 4]} />
        <meshStandardMaterial color="#3a2010" roughness={0.9} />
      </mesh>
      <mesh position={[0.24, 0.52, 0]}>
        <coneGeometry args={[0.02, 0.08, 4]} />
        <meshStandardMaterial color="#3a2010" roughness={0.9} />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.08, 0.4, 0]}>
        <boxGeometry args={[0.09, 0.65, 0.09]} />
        <meshStandardMaterial color="#8a7060" roughness={0.8} />
      </mesh>
      <mesh position={[0.08, 0.4, 0]}>
        <boxGeometry args={[0.09, 0.65, 0.09]} />
        <meshStandardMaterial color="#8a7060" roughness={0.8} />
      </mesh>
    </group>
  );
}

function WretchModel({ state }: { state: EntityState }) {
  return (
    <group>
      {/* Hunched head low */}
      <mesh position={[0, 0.9, 0.15]}>
        <sphereGeometry args={[0.1, 6, 6]} />
        <meshStandardMaterial color="#5a5a3a" roughness={0.9} />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.03, 0.92, 0.23]}>
        <sphereGeometry args={[0.015, 4, 4]} />
        <meshBasicMaterial color={state === 'chase' ? '#ffff00' : '#666600'} />
      </mesh>
      <mesh position={[0.03, 0.92, 0.23]}>
        <sphereGeometry args={[0.015, 4, 4]} />
        <meshBasicMaterial color={state === 'chase' ? '#ffff00' : '#666600'} />
      </mesh>
      {/* Hunched body */}
      <mesh position={[0, 0.7, 0]} rotation={[0.4, 0, 0]}>
        <boxGeometry args={[0.25, 0.4, 0.2]} />
        <meshStandardMaterial color="#4a4a2a" roughness={0.95} />
      </mesh>
      {/* Dragging arms */}
      <mesh position={[-0.18, 0.5, 0.1]} rotation={[0.6, 0, 0.2]}>
        <boxGeometry args={[0.06, 0.5, 0.06]} />
        <meshStandardMaterial color="#5a5a3a" roughness={0.9} />
      </mesh>
      <mesh position={[0.18, 0.5, 0.1]} rotation={[0.6, 0, -0.2]}>
        <boxGeometry args={[0.06, 0.5, 0.06]} />
        <meshStandardMaterial color="#5a5a3a" roughness={0.9} />
      </mesh>
      {/* Short legs */}
      <mesh position={[-0.07, 0.25, 0]}>
        <boxGeometry args={[0.08, 0.4, 0.08]} />
        <meshStandardMaterial color="#3a3a2a" roughness={0.95} />
      </mesh>
      <mesh position={[0.07, 0.25, 0]}>
        <boxGeometry args={[0.08, 0.4, 0.08]} />
        <meshStandardMaterial color="#3a3a2a" roughness={0.95} />
      </mesh>
    </group>
  );
}
// MODELS_CONTINUE

function CrawlerModel({ state }: { state: EntityState }) {
  return (
    <group>
      {/* Flat body on ceiling */}
      <mesh position={[0, 2.75, 0]}>
        <boxGeometry args={[0.6, 0.08, 0.5]} />
        <meshStandardMaterial color="#0a0a0a" roughness={1} />
      </mesh>
      {/* Multiple spindly legs hanging down */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map(i => {
        const angle = (i / 8) * Math.PI * 2;
        const r = 0.22;
        return (
          <mesh key={i} position={[Math.cos(angle) * r, 2.55, Math.sin(angle) * r]} rotation={[Math.cos(angle) * 0.3, 0, Math.sin(angle) * 0.3]}>
            <cylinderGeometry args={[0.012, 0.008, 0.4, 3]} />
            <meshStandardMaterial color="#1a0505" roughness={0.9} />
          </mesh>
        );
      })}
      {/* Single red eye */}
      <mesh position={[0, 2.72, 0.26]}>
        <sphereGeometry args={[0.04, 6, 6]} />
        <meshBasicMaterial color={state === 'chase' ? '#ff0000' : '#880000'} />
      </mesh>
    </group>
  );
}

function DullerModel() {
  return (
    <group>
      {/* Tall grey faceless head - smooth, no features at all */}
      <mesh position={[0, 1.9, 0]}>
        <sphereGeometry args={[0.13, 10, 8]} />
        <meshStandardMaterial color="#808080" roughness={0.5} />
      </mesh>
      {/* Tall thin torso */}
      <mesh position={[0, 1.3, 0]}>
        <boxGeometry args={[0.26, 0.9, 0.14]} />
        <meshStandardMaterial color="#6a6a6a" roughness={0.7} />
      </mesh>
      {/* Long thin arms hanging */}
      <mesh position={[-0.18, 1.1, 0]}>
        <boxGeometry args={[0.06, 0.8, 0.06]} />
        <meshStandardMaterial color="#707070" roughness={0.7} />
      </mesh>
      <mesh position={[0.18, 1.1, 0]}>
        <boxGeometry args={[0.06, 0.8, 0.06]} />
        <meshStandardMaterial color="#707070" roughness={0.7} />
      </mesh>
      {/* Long legs */}
      <mesh position={[-0.07, 0.4, 0]}>
        <boxGeometry args={[0.08, 0.7, 0.08]} />
        <meshStandardMaterial color="#5a5a5a" roughness={0.8} />
      </mesh>
      <mesh position={[0.07, 0.4, 0]}>
        <boxGeometry args={[0.08, 0.7, 0.08]} />
        <meshStandardMaterial color="#5a5a5a" roughness={0.8} />
      </mesh>
      {/* Dullness aura - double layer */}
      <mesh position={[0, 1.1, 0]}>
        <sphereGeometry args={[0.8, 12, 8]} />
        <meshBasicMaterial color="#505050" transparent opacity={0.05} side={THREE.BackSide} />
      </mesh>
      <mesh position={[0, 1.1, 0]}>
        <sphereGeometry args={[0.5, 8, 6]} />
        <meshBasicMaterial color="#404040" transparent opacity={0.04} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

function PartygoerModel({ state }: { state: EntityState }) {
  return (
    <group>
      {/* Bright yellow head with wide unnatural smile */}
      <mesh position={[0, 1.35, 0]}>
        <sphereGeometry args={[0.14, 8, 6]} />
        <meshStandardMaterial color="#ffee00" emissive="#ffee00" emissiveIntensity={0.3} roughness={0.5} />
      </mesh>
      {/* Wide permanent smile - too wide */}
      <mesh position={[0, 1.27, 0.12]} rotation={[0.1, 0, 0]}>
        <torusGeometry args={[0.08, 0.012, 4, 14, Math.PI]} />
        <meshBasicMaterial color="#111100" />
      </mesh>
      {/* Dark hollow eyes */}
      <mesh position={[-0.04, 1.37, 0.12]}>
        <sphereGeometry args={[0.025, 4, 4]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh position={[0.04, 1.37, 0.12]}>
        <sphereGeometry args={[0.025, 4, 4]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      {/* Party hat */}
      <mesh position={[0, 1.55, 0]}>
        <coneGeometry args={[0.08, 0.2, 6]} />
        <meshStandardMaterial color="#ff00cc" emissive="#ff00cc" emissiveIntensity={0.4} />
      </mesh>
      {/* Balloons tied to hand */}
      {[[-0.15, 2.0, 0.1, '#ff3333'], [-.05, 2.1, -0.05, '#33ff33'], [0.1, 1.95, 0.05, '#3333ff']].map(([x, y, z, color], i) => (
        <group key={`balloon${i}`}>
          <mesh position={[x as number, y as number, z as number]}>
            <sphereGeometry args={[0.06, 6, 5]} />
            <meshStandardMaterial color={color as string} emissive={color as string} emissiveIntensity={0.2} />
          </mesh>
          <mesh position={[x as number, (y as number) - 0.08, z as number]}>
            <cylinderGeometry args={[0.003, 0.003, 0.3, 3]} />
            <meshStandardMaterial color="#888888" />
          </mesh>
        </group>
      ))}
      {/* Body */}
      <mesh position={[0, 0.9, 0]}>
        <boxGeometry args={[0.3, 0.55, 0.18]} />
        <meshStandardMaterial color="#eedd00" emissive="#ffee00" emissiveIntensity={0.2} roughness={0.6} />
      </mesh>
      {/* Arms reaching out */}
      <mesh position={[-0.22, 1.0, 0.1]} rotation={[0.3, 0, 0.3]}>
        <boxGeometry args={[0.07, 0.45, 0.07]} />
        <meshStandardMaterial color="#eecc00" roughness={0.6} />
      </mesh>
      <mesh position={[0.22, 1.0, 0.1]} rotation={[0.3, 0, -0.3]}>
        <boxGeometry args={[0.07, 0.45, 0.07]} />
        <meshStandardMaterial color="#eecc00" roughness={0.6} />
      </mesh>
      <mesh position={[-0.07, 0.35, 0]}>
        <boxGeometry args={[0.09, 0.5, 0.09]} />
        <meshStandardMaterial color="#ddcc00" roughness={0.7} />
      </mesh>
      <mesh position={[0.07, 0.35, 0]}>
        <boxGeometry args={[0.09, 0.5, 0.09]} />
        <meshStandardMaterial color="#ddcc00" roughness={0.7} />
      </mesh>
      {state === 'chase' && (
        <pointLight color="#ffee00" intensity={1.5} distance={4} decay={2} position={[0, 1, 0]} />
      )}
    </group>
  );
}

function DeathRatModel({ state }: { state: EntityState }) {
  return (
    <group>
      {/* Body */}
      <mesh position={[0, 0.08, 0]} rotation={[0.1, 0, 0]}>
        <sphereGeometry args={[0.09, 8, 6]} />
        <meshStandardMaterial color="#2a1818" roughness={0.9} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.1, 0.09]}>
        <sphereGeometry args={[0.05, 6, 5]} />
        <meshStandardMaterial color="#3a2020" roughness={0.9} />
      </mesh>
      {/* Ears */}
      <mesh position={[-0.03, 0.14, 0.08]}>
        <sphereGeometry args={[0.015, 4, 4]} />
        <meshStandardMaterial color="#4a2828" roughness={0.8} />
      </mesh>
      <mesh position={[0.03, 0.14, 0.08]}>
        <sphereGeometry args={[0.015, 4, 4]} />
        <meshStandardMaterial color="#4a2828" roughness={0.8} />
      </mesh>
      {/* Glowing red eyes */}
      <mesh position={[-0.02, 0.11, 0.13]}>
        <sphereGeometry args={[0.01, 4, 4]} />
        <meshBasicMaterial color={state === 'chase' ? '#ff0000' : '#cc3333'} />
      </mesh>
      <mesh position={[0.02, 0.11, 0.13]}>
        <sphereGeometry args={[0.01, 4, 4]} />
        <meshBasicMaterial color={state === 'chase' ? '#ff0000' : '#cc3333'} />
      </mesh>
      {/* Hairless tail */}
      <mesh position={[0, 0.06, -0.12]} rotation={[0.5, 0, 0]}>
        <cylinderGeometry args={[0.005, 0.003, 0.15, 3]} />
        <meshStandardMaterial color="#4a2828" roughness={0.7} />
      </mesh>
    </group>
  );
}

function DeathmothModel({ state }: { state: EntityState }) {
  const wingFlap = state === 'chase' ? 0.5 : 0.2;
  return (
    <group>
      {/* Fuzzy body */}
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.08, 8, 6]} />
        <meshStandardMaterial color="#7a6a50" roughness={1} />
      </mesh>
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.09, 6, 4]} />
        <meshStandardMaterial color="#8a7a60" transparent opacity={0.4} roughness={1} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.55, 0.08]}>
        <sphereGeometry args={[0.04, 6, 5]} />
        <meshStandardMaterial color="#6a5a40" roughness={0.9} />
      </mesh>
      {/* Antennae */}
      <mesh position={[-0.02, 1.6, 0.1]} rotation={[0.5, 0, -0.3]}>
        <cylinderGeometry args={[0.003, 0.002, 0.08, 3]} />
        <meshStandardMaterial color="#5a4a30" />
      </mesh>
      <mesh position={[0.02, 1.6, 0.1]} rotation={[0.5, 0, 0.3]}>
        <cylinderGeometry args={[0.003, 0.002, 0.08, 3]} />
        <meshStandardMaterial color="#5a4a30" />
      </mesh>
      {/* Wings */}
      <mesh position={[-0.18, 1.5, 0]} rotation={[0, 0, wingFlap]}>
        <planeGeometry args={[0.25, 0.18]} />
        <meshStandardMaterial color="#9a8a70" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0.18, 1.5, 0]} rotation={[0, 0, -wingFlap]}>
        <planeGeometry args={[0.25, 0.18]} />
        <meshStandardMaterial color="#9a8a70" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
      {/* Amber eyes */}
      <mesh position={[-0.015, 1.56, 0.11]}>
        <sphereGeometry args={[0.012, 4, 4]} />
        <meshBasicMaterial color={state === 'chase' ? '#ffaa00' : '#aa8844'} />
      </mesh>
      <mesh position={[0.015, 1.56, 0.11]}>
        <sphereGeometry args={[0.012, 4, 4]} />
        <meshBasicMaterial color={state === 'chase' ? '#ffaa00' : '#aa8844'} />
      </mesh>
    </group>
  );
}

function JerryModel() {
  return (
    <group>
      <mesh position={[0, 1.35, 0]}>
        <sphereGeometry args={[0.13, 8, 6]} />
        <meshStandardMaterial color="#7aaacc" roughness={0.6} />
      </mesh>
      <mesh position={[-0.04, 1.37, 0.11]}>
        <sphereGeometry args={[0.02, 4, 4]} />
        <meshBasicMaterial color="#88ddff" />
      </mesh>
      <mesh position={[0.04, 1.37, 0.11]}>
        <sphereGeometry args={[0.02, 4, 4]} />
        <meshBasicMaterial color="#88ddff" />
      </mesh>
      <mesh position={[0, 0.9, 0]}>
        <boxGeometry args={[0.3, 0.55, 0.18]} />
        <meshStandardMaterial color="#4477aa" roughness={0.8} />
      </mesh>
      <mesh position={[-0.07, 0.35, 0]}>
        <boxGeometry args={[0.1, 0.5, 0.1]} />
        <meshStandardMaterial color="#334466" roughness={0.9} />
      </mesh>
      <mesh position={[0.07, 0.35, 0]}>
        <boxGeometry args={[0.1, 0.5, 0.1]} />
        <meshStandardMaterial color="#334466" roughness={0.9} />
      </mesh>
      <mesh position={[-0.22, 0.9, 0]}>
        <boxGeometry args={[0.07, 0.45, 0.07]} />
        <meshStandardMaterial color="#4477aa" roughness={0.8} />
      </mesh>
      <mesh position={[0.22, 0.9, 0]}>
        <boxGeometry args={[0.07, 0.45, 0.07]} />
        <meshStandardMaterial color="#4477aa" roughness={0.8} />
      </mesh>
      <pointLight color="#88ccff" intensity={0.4} distance={4} decay={2} position={[0, 1.2, 0]} />
    </group>
  );
}

function ClumpModel({ state }: { state: EntityState }) {
  return (
    <group>
      {/* Central mass of flesh */}
      <mesh position={[0, 1.8, 0]}>
        <sphereGeometry args={[0.35, 8, 6]} />
        <meshStandardMaterial color="#6a3030" roughness={0.95} />
      </mesh>
      <mesh position={[0.1, 1.9, 0.1]}>
        <sphereGeometry args={[0.2, 6, 5]} />
        <meshStandardMaterial color="#5a2525" roughness={0.9} />
      </mesh>
      {/* Multiple arms reaching outward */}
      {[0, 1, 2, 3, 4, 5].map(i => {
        const angle = (i / 6) * Math.PI * 2;
        const hang = 0.3 + Math.sin(i * 2.1) * 0.2;
        return (
          <mesh key={i} position={[Math.cos(angle) * 0.3, 1.8 - hang, Math.sin(angle) * 0.3]} rotation={[hang, angle, 0.5]}>
            <cylinderGeometry args={[0.03, 0.02, 0.4, 4]} />
            <meshStandardMaterial color="#7a4040" roughness={0.9} />
          </mesh>
        );
      })}
      {/* Fingers/claws at arm ends */}
      {[0, 2, 4].map(i => {
        const angle = (i / 6) * Math.PI * 2;
        return (
          <mesh key={`h${i}`} position={[Math.cos(angle) * 0.45, 1.4, Math.sin(angle) * 0.45]}>
            <sphereGeometry args={[0.04, 4, 4]} />
            <meshStandardMaterial color="#8a5050" roughness={0.8} />
          </mesh>
        );
      })}
      {/* Veiny texture patches */}
      <mesh position={[-0.15, 1.7, 0.2]}>
        <sphereGeometry args={[0.08, 4, 4]} />
        <meshStandardMaterial color="#4a2020" roughness={1} />
      </mesh>
      {state === 'chase' && (
        <pointLight color="#ff3333" intensity={0.5} distance={3} decay={2} position={[0, 1.8, 0]} />
      )}
    </group>
  );
}

function WindowModel({ state }: { state: EntityState }) {
  const glowIntensity = state === 'chase' ? 1.5 : 0.6;
  return (
    <group>
      {/* Window frame */}
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[0.9, 1.3, 0.08]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.9} />
      </mesh>
      {/* Glass pane - glowing hostile blue */}
      <mesh position={[0, 1.2, 0.02]}>
        <boxGeometry args={[0.7, 1.1, 0.02]} />
        <meshStandardMaterial color="#2244aa" emissive="#4488ff" emissiveIntensity={glowIntensity} transparent opacity={0.7} />
      </mesh>
      {/* Cross frame divider */}
      <mesh position={[0, 1.2, 0.04]}>
        <boxGeometry args={[0.04, 1.1, 0.03]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.2, 0.04]}>
        <boxGeometry args={[0.7, 0.04, 0.03]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>
      {/* Hostile eye-like shape in glass */}
      <mesh position={[0, 1.3, 0.04]}>
        <sphereGeometry args={[0.08, 6, 6]} />
        <meshBasicMaterial color={state === 'chase' ? '#ff4444' : '#6688cc'} />
      </mesh>
      <pointLight color="#4488ff" intensity={glowIntensity * 0.5} distance={4} decay={2} position={[0, 1.2, 0.2]} />
    </group>
  );
}

export const Entity = memo(function Entity({ def, position, state }: EntityProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.position.set(position.x, 0, position.z);
    const t = clock.getElapsedTime();
    if (state === 'chase') {
      groupRef.current.position.y = Math.sin(t * 10) * 0.03;
    } else if (state === 'patrol') {
      groupRef.current.position.y = Math.sin(t * 2) * 0.01;
    }
  });

  const model = (() => {
    switch (def.id) {
      case 'smiler': return <SmilerModel state={state} />;
      case 'hound': return <HoundModel state={state} />;
      case 'facelings': return <FacelingModel state={state} />;
      case 'skin-stealer': return <SkinStealerModel state={state} />;
      case 'wretches': return <WretchModel state={state} />;
      case 'crawlers': return <CrawlerModel state={state} />;
      case 'dullers': return <DullerModel />;
      case 'partygoers': return <PartygoerModel state={state} />;
      case 'death-rats': return <DeathRatModel state={state} />;
      case 'deathmoths': return <DeathmothModel state={state} />;
      case 'jerry': return <JerryModel />;
      case 'clumps': return <ClumpModel state={state} />;
      case 'windows': return <WindowModel state={state} />;
      default: return <FacelingModel state={state} />;
    }
  })();

  return <group ref={groupRef}>{model}</group>;
});