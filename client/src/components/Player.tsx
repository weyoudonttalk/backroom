import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGame } from '../store/GameContext';
import { resolveCollision } from '../systems/Collision';
import { touch } from '../touch';

const SPEED = 3;
const SPRINT_SPEED = 5.5;
const CROUCH_SPEED = 1.5;
const PLAYER_HEIGHT = 1.6;
const CROUCH_HEIGHT = 1.0;
const BOB_SPEED = 8;
const BOB_AMOUNT = 0.03;

const WATER_DRAIN = 0.05;
const WATER_DRAIN_SPRINT = 0.1;
const FOOD_DRAIN = 0.03;
const STARVATION_DAMAGE = 0.1;
const DEHYDRATION_DAMAGE = 0.15;

export function Player() {
  const { camera } = useThree();
  const { state, dispatch } = useGame();
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());
  const keys = useRef<Record<string, boolean>>({});
  const isMoving = useRef(false);
  const bobPhase = useRef(0);
  const currentHeight = useRef(PLAYER_HEIGHT);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keys.current[e.code] = true;
      if (e.code === 'KeyC') {
        dispatch({ type: 'SET_CROUCHING', value: !state.isCrouching });
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [state.isCrouching, dispatch]);

  useFrame((_, delta) => {
    if (state.paused) return;

    const k = keys.current;
    const sprinting = ((k['ShiftLeft'] || k['ShiftRight']) || touch.sprint) && !state.isCrouching;
    const crouching = state.isCrouching;

    dispatch({ type: 'SET_SPRINTING', value: sprinting });

    const speed = crouching ? CROUCH_SPEED : sprinting ? SPRINT_SPEED : SPEED;
    const targetHeight = crouching ? CROUCH_HEIGHT : PLAYER_HEIGHT;
    currentHeight.current += (targetHeight - currentHeight.current) * 8 * delta;

    direction.current.set(0, 0, 0);
    if (k['KeyW'] || k['ArrowUp']) direction.current.z -= 1;
    if (k['KeyS'] || k['ArrowDown']) direction.current.z += 1;
    if (k['KeyA'] || k['ArrowLeft']) direction.current.x -= 1;
    if (k['KeyD'] || k['ArrowRight']) direction.current.x += 1;

    // touch joystick (analog) — up = forward
    direction.current.x += touch.mx;
    direction.current.z += touch.my;

    direction.current.normalize();
    isMoving.current = direction.current.length() > 0;

    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

    velocity.current.set(0, 0, 0);
    velocity.current.addScaledVector(forward, -direction.current.z);
    velocity.current.addScaledVector(right, direction.current.x);
    velocity.current.normalize().multiplyScalar(speed * delta);

    const currentPos = new THREE.Vector3(camera.position.x, 0, camera.position.z);
    const resolved = resolveCollision(currentPos, velocity.current);
    camera.position.x = resolved.x;
    camera.position.z = resolved.z;

    if (isMoving.current) {
      bobPhase.current += delta * BOB_SPEED * (sprinting ? 1.4 : crouching ? 0.7 : 1);
      camera.position.y = currentHeight.current + Math.sin(bobPhase.current) * BOB_AMOUNT;
    } else {
      camera.position.y = currentHeight.current;
      bobPhase.current = 0;
    }

    // Survival drain
    const waterDrain = sprinting ? WATER_DRAIN_SPRINT : WATER_DRAIN;
    dispatch({ type: 'DRAIN_WATER', amount: waterDrain * delta });
    dispatch({ type: 'DRAIN_FOOD', amount: FOOD_DRAIN * delta });

    if (state.water <= 0) {
      dispatch({ type: 'DAMAGE', amount: DEHYDRATION_DAMAGE * delta });
    }
    if (state.food <= 0) {
      dispatch({ type: 'DAMAGE', amount: STARVATION_DAMAGE * delta });
    }
  });

  return null;
}
