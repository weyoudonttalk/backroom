import { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Room } from './Room';
import { FluorescentLight } from './FluorescentLight';
import { AmbientAudio } from './AmbientAudio';
import { FootstepAudio } from './FootstepAudio';
import { EntityPresence } from './EntityPresence';
import { EntityManager } from './EntityManager';
import { ItemManager } from './ItemManager';
import { Props } from './Props';
import { MultiplayerPlayers } from './MultiplayerPlayers';
import { useGame } from '../store/GameContext';
import { LEVELS } from '../levels/LevelConfig';
import { buildCollisionMap } from '../systems/Collision';

interface RoomData {
  x: number;
  z: number;
  hasNorthWall: boolean;
  hasSouthWall: boolean;
  hasEastWall: boolean;
  hasWestWall: boolean;
}

function seededRandom(seed: number) {
  const x = Math.sin(seed * 127.1 + seed * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function isOpenArea(gx: number, gz: number, level: number): boolean {
  if (Math.abs(gx) <= 2 && Math.abs(gz) <= 2) return true;
  const clusterX = Math.floor(gx / 4);
  const clusterZ = Math.floor(gz / 4);
  const clusterSeed = clusterX * 1000 + clusterZ + level * 7777;
  return seededRandom(clusterSeed) < 0.35;
}

const MAP_EXTENT = 1000;
const RENDER_RADIUS = 40;
const COLLISION_RADIUS = 50;

function generateRoomAt(gx: number, gz: number, level: number, roomSize: number, density: number): RoomData {
  const seed = gx * 10007 + gz * 7919 + level * 100003;
  const open = isOpenArea(gx, gz, level);
  const atEdge = Math.abs(gx * roomSize) >= MAP_EXTENT || Math.abs(gz * roomSize) >= MAP_EXTENT;

  if (open) {
    // Open areas still get occasional walls to form corridors/tunnels — max 1 wall
    const openSeed = gx * 3571 + gz * 9137 + level * 44449;
    const wallChance = 0.25;
    let on = seededRandom(openSeed) < wallChance;
    let os = seededRandom(openSeed + 1) < wallChance;
    let oe = seededRandom(openSeed + 2) < wallChance;
    let ow = seededRandom(openSeed + 3) < wallChance;
    // Cap at 1 wall to keep it open but structured
    const oCount = [on, os, oe, ow].filter(Boolean).length;
    if (oCount > 1) {
      const pick = Math.floor(seededRandom(openSeed + 4) * 4);
      on = pick === 0;
      os = pick === 1;
      oe = pick === 2;
      ow = pick === 3;
    }
    return {
      x: gx * roomSize,
      z: gz * roomSize,
      hasNorthWall: on || (atEdge && gz < 0),
      hasSouthWall: os || (atEdge && gz > 0),
      hasEastWall: oe || (atEdge && gx > 0),
      hasWestWall: ow || (atEdge && gx < 0),
    };
  }

  let n = seededRandom(seed) > (1 - density * 0.75) || (atEdge && gz < 0);
  let s = seededRandom(seed + 1) > (1 - density * 0.75) || (atEdge && gz > 0);
  let e = seededRandom(seed + 2) > (1 - density * 0.7) || (atEdge && gx > 0);
  let w = seededRandom(seed + 3) > (1 - density * 0.7) || (atEdge && gx < 0);

  // Prevent dead ends: max 2 walls per room
  const wallCount = [n, s, e, w].filter(Boolean).length;
  if (wallCount >= 3) {
    // Remove walls until only 2 remain, keeping edge walls
    const walls = [
      { key: 'n', val: n, edge: atEdge && gz < 0 },
      { key: 's', val: s, edge: atEdge && gz > 0 },
      { key: 'e', val: e, edge: atEdge && gx > 0 },
      { key: 'w', val: w, edge: atEdge && gx < 0 },
    ];
    const removable = walls.filter(w => w.val && !w.edge);
    let toRemove = wallCount - 2;
    for (const wall of removable) {
      if (toRemove <= 0) break;
      if (wall.key === 'n') n = false;
      else if (wall.key === 's') s = false;
      else if (wall.key === 'e') e = false;
      else if (wall.key === 'w') w = false;
      toRemove--;
    }
  }

  return { x: gx * roomSize, z: gz * roomSize, hasNorthWall: n, hasSouthWall: s, hasEastWall: e, hasWestWall: w };
}

function getRoomsInRadius(px: number, pz: number, radius: number, level: number, roomSize: number, density: number): RoomData[] {
  const rooms: RoomData[] = [];
  const gridRadius = Math.ceil(radius / roomSize);
  const pgx = Math.round(px / roomSize);
  const pgz = Math.round(pz / roomSize);
  const maxGrid = Math.floor(MAP_EXTENT / roomSize);
  const rr = radius * radius;

  for (let dx = -gridRadius; dx <= gridRadius; dx++) {
    for (let dz = -gridRadius; dz <= gridRadius; dz++) {
      const gx = pgx + dx;
      const gz = pgz + dz;
      if (Math.abs(gx) > maxGrid || Math.abs(gz) > maxGrid) continue;
      const wx = gx * roomSize;
      const wz = gz * roomSize;
      const ddx = wx - px;
      const ddz = wz - pz;
      if (ddx * ddx + ddz * ddz > rr) continue;
      rooms.push(generateRoomAt(gx, gz, level, roomSize, density));
    }
  }
  return rooms;
}

export function BackroomsScene() {
  const { state, dispatch } = useGame();
  const { camera } = useThree();
  const levelConfig = LEVELS[state.level];
  const [visibleRooms, setVisibleRooms] = useState<RoomData[]>([]);
  const lastChunkX = useRef(Infinity);
  const lastChunkZ = useRef(Infinity);

  useFrame(() => {
    const px = camera.position.x;
    const pz = camera.position.z;
    const chunkX = Math.floor(px / 8);
    const chunkZ = Math.floor(pz / 8);

    if (chunkX !== lastChunkX.current || chunkZ !== lastChunkZ.current) {
      lastChunkX.current = chunkX;
      lastChunkZ.current = chunkZ;

      const rooms = getRoomsInRadius(px, pz, RENDER_RADIUS, state.level, levelConfig.roomSize, levelConfig.wallDensity);
      setVisibleRooms(rooms);

      const collisionRooms = getRoomsInRadius(px, pz, COLLISION_RADIUS, state.level, levelConfig.roomSize, levelConfig.wallDensity);
      buildCollisionMap(collisionRooms, levelConfig.roomSize);
    }

    dispatch({ type: 'SET_PLAYER_POSITION', x: px, z: pz });
  });

  const visibleLights = useMemo(() => {
    const l: { x: number; z: number }[] = [];
    const spacing = levelConfig.roomSize * 4;
    if (visibleRooms.length === 0) return l;
    const px = lastChunkX.current * 8;
    const pz = lastChunkZ.current * 8;
    const lightRadius = 28;
    const startX = Math.floor((px - lightRadius) / spacing) * spacing;
    const startZ = Math.floor((pz - lightRadius) / spacing) * spacing;
    for (let x = startX; x <= px + lightRadius; x += spacing) {
      for (let z = startZ; z <= pz + lightRadius; z += spacing) {
        const dx = x - px;
        const dz = z - pz;
        if (dx * dx + dz * dz < lightRadius * lightRadius) {
          l.push({ x, z });
        }
      }
    }
    return l.slice(0, 16);
  }, [visibleRooms, levelConfig.roomSize]);

  return (
    <group>
      <ambientLight intensity={levelConfig.ambientIntensity * 1.4} color={levelConfig.ambientColor} />
      <hemisphereLight args={[levelConfig.lightColor, levelConfig.floorColor, 0.5]} />
      <directionalLight color={levelConfig.lightColor} intensity={0.3} position={[0, 3, 0]} />

      {visibleRooms.map((room, i) => (
        <Room key={`${state.level}-${room.x}-${room.z}`} {...room} levelConfig={levelConfig} />
      ))}

      {visibleLights.map((light, i) => (
        <FluorescentLight
          key={`l-${light.x}-${light.z}`}
          position={[light.x, 2.9, light.z]}
          lightColor={levelConfig.lightColor}
          lightIntensity={levelConfig.lightIntensity}
        />
      ))}

      <Props />
      <MultiplayerPlayers />
      <EntityManager />
      <ItemManager />
      <AmbientAudio />
      <FootstepAudio />
      <EntityPresence />
    </group>
  );
}
