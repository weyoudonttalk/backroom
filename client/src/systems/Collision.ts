import * as THREE from 'three';

export interface WallSegment {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

const PLAYER_RADIUS = 0.3;

let wallSegments: WallSegment[] = [];

export function buildCollisionMap(
  rooms: { x: number; z: number; hasNorthWall: boolean; hasSouthWall: boolean; hasEastWall: boolean; hasWestWall: boolean }[],
  roomSize: number
) {
  const walls: WallSegment[] = [];
  const thickness = 0.15;
  const half = roomSize / 2;

  for (const room of rooms) {
    if (room.hasNorthWall) {
      walls.push({
        minX: room.x - half,
        maxX: room.x + half,
        minZ: room.z - half - thickness,
        maxZ: room.z - half + thickness,
      });
    }
    if (room.hasSouthWall) {
      walls.push({
        minX: room.x - half,
        maxX: room.x + half,
        minZ: room.z + half - thickness,
        maxZ: room.z + half + thickness,
      });
    }
    if (room.hasEastWall) {
      walls.push({
        minX: room.x + half - thickness,
        maxX: room.x + half + thickness,
        minZ: room.z - half,
        maxZ: room.z + half,
      });
    }
    if (room.hasWestWall) {
      walls.push({
        minX: room.x - half - thickness,
        maxX: room.x - half + thickness,
        minZ: room.z - half,
        maxZ: room.z + half,
      });
    }
  }

  wallSegments = walls;
}

export function resolveCollision(position: THREE.Vector3, velocity: THREE.Vector3): THREE.Vector3 {
  const newPos = position.clone().add(velocity);
  const px = newPos.x;
  const pz = newPos.z;

  for (const wall of wallSegments) {
    if (
      px + PLAYER_RADIUS > wall.minX &&
      px - PLAYER_RADIUS < wall.maxX &&
      pz + PLAYER_RADIUS > wall.minZ &&
      pz - PLAYER_RADIUS < wall.maxZ
    ) {
      const overlapLeft = (px + PLAYER_RADIUS) - wall.minX;
      const overlapRight = wall.maxX - (px - PLAYER_RADIUS);
      const overlapTop = (pz + PLAYER_RADIUS) - wall.minZ;
      const overlapBottom = wall.maxZ - (pz - PLAYER_RADIUS);

      const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

      if (minOverlap === overlapLeft) {
        newPos.x = wall.minX - PLAYER_RADIUS;
      } else if (minOverlap === overlapRight) {
        newPos.x = wall.maxX + PLAYER_RADIUS;
      } else if (minOverlap === overlapTop) {
        newPos.z = wall.minZ - PLAYER_RADIUS;
      } else {
        newPos.z = wall.maxZ + PLAYER_RADIUS;
      }
    }
  }

  return newPos;
}

export function getWallSegments(): WallSegment[] {
  return wallSegments;
}
