import { useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { touch } from '../touch';

// Drives the first-person camera from touch-drag deltas, replacing
// PointerLockControls on touch devices (pointer lock is unavailable on mobile).
const SENS = 0.0028;

export function TouchLook() {
  const { camera } = useThree();
  const euler = useRef<THREE.Euler | null>(null);

  useFrame(() => {
    if (!euler.current) {
      euler.current = new THREE.Euler(0, 0, 0, 'YXZ');
      euler.current.setFromQuaternion(camera.quaternion);
    }
    if (touch.lookDX !== 0 || touch.lookDY !== 0) {
      const e = euler.current;
      e.y -= touch.lookDX * SENS;
      e.x -= touch.lookDY * SENS;
      const lim = Math.PI / 2 - 0.05;
      e.x = Math.max(-lim, Math.min(lim, e.x));
      camera.quaternion.setFromEuler(e);
      touch.lookDX = 0;
      touch.lookDY = 0;
    }
  });

  return null;
}
