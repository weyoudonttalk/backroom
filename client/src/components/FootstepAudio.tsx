import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGame } from '../store/GameContext';

export function FootstepAudio() {
  const { camera } = useThree();
  const { state } = useGame();
  const lastPos = useRef({ x: 0, z: 0 });
  const stepAccum = useRef(0);
  const audioCtx = useRef<AudioContext | null>(null);
  const leftRight = useRef(false);

  useEffect(() => {
    audioCtx.current = new AudioContext();
    return () => { audioCtx.current?.close(); };
  }, []);

  const playStep = (volume: number, pitch: number) => {
    const ctx = audioCtx.current;
    if (!ctx || ctx.state === 'suspended') return;

    const duration = 0.1;
    const buffer = ctx.createBuffer(2, ctx.sampleRate * duration, ctx.sampleRate);
    const left = buffer.getChannelData(0);
    const right = buffer.getChannelData(1);

    leftRight.current = !leftRight.current;
    const panL = leftRight.current ? 0.7 : 0.3;
    const panR = leftRight.current ? 0.3 : 0.7;

    for (let i = 0; i < left.length; i++) {
      const t = i / ctx.sampleRate;
      const envelope = Math.exp(-t * 40);
      const noise = (Math.random() * 2 - 1) * envelope;
      const thud = Math.sin(t * pitch * Math.PI * 2) * envelope * 0.5;
      const sample = (noise * 0.6 + thud * 0.4) * volume;
      left[i] = sample * panL;
      right[i] = sample * panR;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = state.isCrouching ? 400 : state.isSprinting ? 900 : 650;

    const gain = ctx.createGain();
    gain.gain.value = 1;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start();
  };

  useFrame(() => {
    if (state.paused) return;
    const dx = camera.position.x - lastPos.current.x;
    const dz = camera.position.z - lastPos.current.z;
    const dist = Math.sqrt(dx * dx + dz * dz);

    if (dist < 0.001) {
      lastPos.current.x = camera.position.x;
      lastPos.current.z = camera.position.z;
      return;
    }

    stepAccum.current += dist;

    const stepInterval = state.isCrouching ? 2.8 : state.isSprinting ? 1.4 : 2.0;
    const volume = state.isCrouching ? 0.06 : state.isSprinting ? 0.18 : 0.12;
    const pitch = state.isCrouching ? 60 : state.isSprinting ? 120 : 90;

    if (stepAccum.current > stepInterval) {
      stepAccum.current = 0;
      playStep(volume, pitch + Math.random() * 20);
    }

    lastPos.current.x = camera.position.x;
    lastPos.current.z = camera.position.z;
  });

  return null;
}
