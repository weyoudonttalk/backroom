import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Entity } from './Entity';
import { ENTITIES } from '../entities/EntityData';
import { EntityInstance, updateEntityAI, getRandomWaypoint } from '../entities/EntityAI';
import { useGame, getDifficultyMultipliers } from '../store/GameContext';
import { LEVELS } from '../levels/LevelConfig';
import { useEntitySounds } from '../hooks/useEntitySounds';
import { playAttackSound } from '../audio/sfx';

function seededRandom(seed: number) {
  const x = Math.sin(seed * 127.1 + seed * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

const DESPAWN_RADIUS = 120;
const MAX_ENTITIES = 30;
const MELEE_RANGE = 2.5;
const MELEE_DAMAGE = 20;

export function EntityManager() {
  const { state, dispatch } = useGame();
  const { camera } = useThree();
  const entitiesRef = useRef<EntityInstance[]>([]);
  const initialized = useRef(-1);
  const attackCooldown = useRef(0);
  const meleeCooldown = useRef(0);
  const spawnTimer = useRef(0);
  const nextId = useRef(0);

  const levelConfig = LEVELS[state.level];
  const mult = getDifficultyMultipliers(state.difficulty);

  if (initialized.current !== state.level) {
    const pool = levelConfig.entityPool;
    const count = Math.floor(15 * mult.spawnRate);
    const spawned: EntityInstance[] = [];

    for (let i = 0; i < count; i++) {
      const entityId = pool[Math.floor(seededRandom(i * 7 + state.level * 100) * pool.length)];
      const def = ENTITIES[entityId];
      if (!def) continue;
      const angle = seededRandom(i * 13) * Math.PI * 2;
      const dist = 25 + seededRandom(i * 31) * 80;
      const pos = new THREE.Vector3(Math.cos(angle) * dist, 0, Math.sin(angle) * dist);
      spawned.push({
        id: nextId.current++, def, position: pos,
        targetPosition: getRandomWaypoint(pos, 10),
        state: 'idle', stateTimer: 0, alertLevel: 0,
        lastKnownPlayerPos: null, hp: def.hp,
      });
    }
    entitiesRef.current = spawned;
    initialized.current = state.level;
  }

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (e.button !== 0 || state.paused || meleeCooldown.current > 0) return;
      meleeCooldown.current = 0.4;
      const playerPos = new THREE.Vector3(camera.position.x, 0, camera.position.z);
      const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
      forward.y = 0;
      forward.normalize();

      let closestDist = MELEE_RANGE;
      let closestIdx = -1;
      for (let i = 0; i < entitiesRef.current.length; i++) {
        const ent = entitiesRef.current[i];
        const toEntity = new THREE.Vector3().subVectors(ent.position, playerPos);
        toEntity.y = 0;
        const dist = toEntity.length();
        if (dist > MELEE_RANGE) continue;
        const dot = toEntity.normalize().dot(forward);
        if (dot > 0.4 && dist < closestDist) {
          closestDist = dist;
          closestIdx = i;
        }
      }

      const hit = closestIdx >= 0;
      playAttackSound(hit);

      if (hit) {
        const entity = entitiesRef.current[closestIdx];
        const newHp = entity.hp - MELEE_DAMAGE;
        if (newHp <= 0) {
          entitiesRef.current = entitiesRef.current.filter((_, i) => i !== closestIdx);
        } else {
          entitiesRef.current[closestIdx] = {
            ...entity, hp: newHp, state: 'chase', alertLevel: 3,
            lastKnownPlayerPos: playerPos.clone(), stateTimer: 0,
          };
        }
      }
    };
    window.addEventListener('mousedown', handleClick);
    return () => window.removeEventListener('mousedown', handleClick);
  }, [state.paused, camera]);

  useFrame((_, delta) => {
    if (state.paused) return;
    const playerPos = new THREE.Vector3(camera.position.x, 0, camera.position.z);
    attackCooldown.current = Math.max(0, attackCooldown.current - delta);
    meleeCooldown.current = Math.max(0, meleeCooldown.current - delta);
    spawnTimer.current += delta;

    if (spawnTimer.current > 5 && entitiesRef.current.length < MAX_ENTITIES) {
      spawnTimer.current = 0;
      const pool = levelConfig.entityPool;
      const entityId = pool[Math.floor(Math.random() * pool.length)];
      const def = ENTITIES[entityId];
      if (def) {
        const angle = Math.random() * Math.PI * 2;
        const dist = 60 + Math.random() * 40;
        const pos = new THREE.Vector3(
          playerPos.x + Math.cos(angle) * dist, 0,
          playerPos.z + Math.sin(angle) * dist
        );
        entitiesRef.current.push({
          id: nextId.current++, def, position: pos,
          targetPosition: getRandomWaypoint(pos, 15),
          state: 'patrol', stateTimer: 0, alertLevel: 0,
          lastKnownPlayerPos: null, hp: def.hp,
        });
      }
    }

    entitiesRef.current = entitiesRef.current.filter(e => e.position.distanceTo(playerPos) < DESPAWN_RADIUS);

    entitiesRef.current = entitiesRef.current.map(entity => {
      const dist = entity.position.distanceTo(playerPos);
      if (dist > 80) return entity;
      const updated = updateEntityAI(entity, playerPos, state.isCrouching, state.isSprinting, delta, state.difficulty);
      if (updated.state === 'attack' && updated.stateTimer < delta * 2 && attackCooldown.current <= 0) {
        dispatch({ type: 'DAMAGE', amount: updated.def.damage });
        attackCooldown.current = 1.5;
      }
      return updated;
    });
  });

  const visibleEntities = entitiesRef.current.filter(e => {
    const dx = e.position.x - camera.position.x;
    const dz = e.position.z - camera.position.z;
    return dx * dx + dz * dz < 2500;
  });

  useEntitySounds(visibleEntities.map(e => ({ id: e.id, type: e.def.id, position: e.position, state: e.state })));

  return (
    <>
      {visibleEntities.map(entity => (
        <Entity key={entity.id} def={entity.def} position={entity.position} state={entity.state} />
      ))}
    </>
  );
}
