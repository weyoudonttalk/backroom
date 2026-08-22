import { useMemo, memo } from 'react';
import * as THREE from 'three';
import { LevelConfig } from '../levels/LevelConfig';

interface RoomProps {
  x: number;
  z: number;
  hasNorthWall: boolean;
  hasSouthWall: boolean;
  hasEastWall: boolean;
  hasWestWall: boolean;
  levelConfig: LevelConfig;
}

const WALL_HEIGHT = 3;
const WALL_THICKNESS = 0.1;

const materialCache = new Map<string, THREE.MeshStandardMaterial>();

function getMaterial(color: string, roughness: number, key: string): THREE.MeshStandardMaterial {
  const cacheKey = `${key}-${color}`;
  if (materialCache.has(cacheKey)) return materialCache.get(cacheKey)!;

  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 64, 64);

  for (let i = 0; i < 64; i += 2) {
    for (let j = 0; j < 64; j += 2) {
      ctx.fillStyle = `rgba(0,0,0,${(Math.random() * 12) / 255})`;
      ctx.fillRect(i, j, 2, 2);
    }
  }

  if (key === 'wall') {
    for (let x = 0; x < 64; x += 16) {
      ctx.strokeStyle = 'rgba(0,0,0,0.1)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 64);
      ctx.stroke();
    }
  } else if (key === 'ceiling') {
    ctx.strokeStyle = 'rgba(0,0,0,0.15)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= 64; x += 32) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 64); ctx.stroke();
    }
    for (let y = 0; y <= 64; y += 32) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(64, y); ctx.stroke();
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  if (key === 'floor') tex.repeat.set(2, 2);

  const mat = new THREE.MeshStandardMaterial({ map: tex, roughness });
  materialCache.set(cacheKey, mat);
  return mat;
}

const geoCache = new Map<string, THREE.BufferGeometry>();

function getGeo(type: string, roomSize: number): THREE.BufferGeometry {
  const key = `${type}-${roomSize}`;
  if (geoCache.has(key)) return geoCache.get(key)!;

  let geo: THREE.BufferGeometry;
  switch (type) {
    case 'floor':
    case 'ceiling':
      geo = new THREE.PlaneGeometry(roomSize, roomSize);
      break;
    case 'wallWide':
      geo = new THREE.BoxGeometry(roomSize, WALL_HEIGHT, WALL_THICKNESS);
      break;
    case 'wallDeep':
      geo = new THREE.BoxGeometry(WALL_THICKNESS, WALL_HEIGHT, roomSize);
      break;
    default:
      geo = new THREE.PlaneGeometry(1, 1);
  }
  geoCache.set(key, geo);
  return geo;
}

export const Room = memo(function Room({ x, z, hasNorthWall, hasSouthWall, hasEastWall, hasWestWall, levelConfig }: RoomProps) {
  const roomSize = levelConfig.roomSize;
  const wallMat = useMemo(() => getMaterial(levelConfig.wallColor, 0.9, 'wall'), [levelConfig.wallColor]);
  const floorMat = useMemo(() => getMaterial(levelConfig.floorColor, 1, 'floor'), [levelConfig.floorColor]);
  const ceilMat = useMemo(() => getMaterial(levelConfig.ceilingColor, 0.8, 'ceiling'), [levelConfig.ceilingColor]);

  const floorGeo = useMemo(() => getGeo('floor', roomSize), [roomSize]);
  const ceilGeo = useMemo(() => getGeo('ceiling', roomSize), [roomSize]);
  const wallWide = useMemo(() => getGeo('wallWide', roomSize), [roomSize]);
  const wallDeep = useMemo(() => getGeo('wallDeep', roomSize), [roomSize]);

  return (
    <group position={[x, 0, z]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} geometry={floorGeo} material={floorMat} />
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, WALL_HEIGHT, 0]} geometry={ceilGeo} material={ceilMat} />

      {hasNorthWall && (
        <mesh position={[0, WALL_HEIGHT / 2, -roomSize / 2]} geometry={wallWide} material={wallMat} />
      )}
      {hasSouthWall && (
        <mesh position={[0, WALL_HEIGHT / 2, roomSize / 2]} geometry={wallWide} material={wallMat} />
      )}
      {hasEastWall && (
        <mesh position={[roomSize / 2, WALL_HEIGHT / 2, 0]} geometry={wallDeep} material={wallMat} />
      )}
      {hasWestWall && (
        <mesh position={[-roomSize / 2, WALL_HEIGHT / 2, 0]} geometry={wallDeep} material={wallMat} />
      )}
    </group>
  );
});
