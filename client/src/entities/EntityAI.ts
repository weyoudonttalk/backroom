import * as THREE from 'three';
import { EntityState, EntityDef } from './EntityData';
import { getDifficultyMultipliers, Difficulty } from '../store/GameContext';
import { getWallSegments } from '../systems/Collision';

export interface EntityInstance {
  id: number;
  def: EntityDef;
  position: THREE.Vector3;
  targetPosition: THREE.Vector3;
  state: EntityState;
  stateTimer: number;
  alertLevel: number;
  lastKnownPlayerPos: THREE.Vector3 | null;
  hp: number;
}

function seededRandom(seed: number) {
  const x = Math.sin(seed * 127.1 + seed * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export function getRandomWaypoint(current: THREE.Vector3, range: number): THREE.Vector3 {
  const angle = Math.random() * Math.PI * 2;
  const dist = 4 + Math.random() * range;
  return new THREE.Vector3(
    current.x + Math.cos(angle) * dist,
    current.y,
    current.z + Math.sin(angle) * dist
  );
}

export function updateEntityAI(
  entity: EntityInstance,
  playerPos: THREE.Vector3,
  playerCrouching: boolean,
  playerMoving: boolean,
  delta: number,
  difficulty: Difficulty
): EntityInstance {
  const mult = getDifficultyMultipliers(difficulty);
  const detectionRadius = entity.def.detectionRadius * mult.detectionRadius;
  const hearingRadius = entity.def.hearingRadius * mult.detectionRadius;
  const speed = entity.def.speed * mult.entitySpeed;
  const chaseSpeed = entity.def.chaseSpeed * mult.entitySpeed;

  const distToPlayer = entity.position.distanceTo(playerPos);
  const crouchMod = playerCrouching ? 0.4 : 1;
  const moveMod = playerMoving ? 1 : 0.5;

  const effectiveDetection = detectionRadius * crouchMod;
  const effectiveHearing = hearingRadius * moveMod * crouchMod;

  const canSee = distToPlayer < effectiveDetection;
  const canHear = distToPlayer < effectiveHearing;

  let newState = entity.state;
  let newTimer = entity.stateTimer + delta;
  let newAlert = entity.alertLevel;
  let newTarget = entity.targetPosition.clone();
  let newLastKnown = entity.lastKnownPlayerPos;

  if (!entity.def.hostile) {
    if (newState === 'idle' && newTimer > 3) {
      newState = 'patrol';
      newTarget = getRandomWaypoint(entity.position, 8);
      newTimer = 0;
    } else if (newState === 'patrol') {
      if (entity.position.distanceTo(newTarget) < 1 || newTimer > 10) {
        newState = 'idle';
        newTimer = 0;
      }
    }
  } else {
    switch (entity.state) {
      case 'idle':
        if (canSee || canHear) {
          newAlert += delta * 2;
          if (newAlert > 1) {
            newState = 'alert';
            newLastKnown = playerPos.clone();
            newTimer = 0;
          }
        } else {
          newAlert = Math.max(0, newAlert - delta * 0.5);
          if (newTimer > 2 + Math.random() * 3) {
            newState = 'patrol';
            newTarget = getRandomWaypoint(entity.position, 10);
            newTimer = 0;
          }
        }
        break;

      case 'patrol':
        if (canSee || canHear) {
          newAlert += delta * 2;
          if (newAlert > 1) {
            newState = 'alert';
            newLastKnown = playerPos.clone();
            newTimer = 0;
          }
        } else {
          newAlert = Math.max(0, newAlert - delta * 0.3);
        }
        if (entity.position.distanceTo(newTarget) < 1 || newTimer > 12) {
          newState = 'idle';
          newTimer = 0;
        }
        break;

      case 'alert':
        if (canSee) {
          newLastKnown = playerPos.clone();
          newAlert += delta * 3;
          if (newAlert > 2) {
            newState = 'chase';
            newTimer = 0;
          }
        } else {
          newAlert -= delta * 0.5;
          if (newAlert <= 0 || newTimer > 5) {
            newState = 'return';
            newTarget = getRandomWaypoint(entity.position, 6);
            newTimer = 0;
            newAlert = 0;
          }
        }
        break;

      case 'chase':
        newTarget = playerPos.clone();
        newLastKnown = playerPos.clone();
        if (distToPlayer < 1.5) {
          newState = 'attack';
          newTimer = 0;
        }
        if (!canSee && !canHear && newTimer > 6) {
          newState = 'return';
          newTarget = newLastKnown || getRandomWaypoint(entity.position, 8);
          newTimer = 0;
          newAlert = 0;
        }
        break;

      case 'attack':
        if (newTimer > 1) {
          newState = 'chase';
          newTimer = 0;
        }
        break;

      case 'return':
        if (canSee || canHear) {
          newState = 'alert';
          newLastKnown = playerPos.clone();
          newTimer = 0;
          newAlert = 1;
        }
        if (entity.position.distanceTo(newTarget) < 2 || newTimer > 8) {
          newState = 'idle';
          newTimer = 0;
        }
        break;
    }
  }

  // Movement
  const moveSpeed = newState === 'chase' ? chaseSpeed : speed;
  const newPos = entity.position.clone();

  if (newState === 'patrol' || newState === 'chase' || newState === 'return' || (newState === 'alert' && newLastKnown)) {
    const moveTarget = newState === 'alert' && newLastKnown ? newLastKnown : newTarget;
    const dir = new THREE.Vector3().subVectors(moveTarget, newPos).normalize();
    dir.y = 0;
    const velocity = dir.multiplyScalar(moveSpeed * delta);
    const candidatePos = newPos.clone().add(velocity);

    // Entity wall collision
    const ENTITY_RADIUS = 0.35;
    const walls = getWallSegments();
    let resolvedX = candidatePos.x;
    let resolvedZ = candidatePos.z;

    for (const wall of walls) {
      if (
        resolvedX + ENTITY_RADIUS > wall.minX &&
        resolvedX - ENTITY_RADIUS < wall.maxX &&
        resolvedZ + ENTITY_RADIUS > wall.minZ &&
        resolvedZ - ENTITY_RADIUS < wall.maxZ
      ) {
        const overlapLeft = (resolvedX + ENTITY_RADIUS) - wall.minX;
        const overlapRight = wall.maxX - (resolvedX - ENTITY_RADIUS);
        const overlapTop = (resolvedZ + ENTITY_RADIUS) - wall.minZ;
        const overlapBottom = wall.maxZ - (resolvedZ - ENTITY_RADIUS);
        const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

        if (minOverlap === overlapLeft) resolvedX = wall.minX - ENTITY_RADIUS;
        else if (minOverlap === overlapRight) resolvedX = wall.maxX + ENTITY_RADIUS;
        else if (minOverlap === overlapTop) resolvedZ = wall.minZ - ENTITY_RADIUS;
        else resolvedZ = wall.maxZ + ENTITY_RADIUS;
      }
    }

    newPos.x = resolvedX;
    newPos.z = resolvedZ;
  }

  return {
    ...entity,
    position: newPos,
    targetPosition: newTarget,
    state: newState,
    stateTimer: newTimer,
    alertLevel: newAlert,
    lastKnownPlayerPos: newLastKnown,
  };
}
