import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

interface SoundConfig {
  waveform: OscillatorType;
  baseFreq: number;
  chaseFreq: number;
  modRate: number;
  modDepth: number;
}

const SOUND_CONFIGS: Record<string, SoundConfig> = {
  smiler: { waveform: 'sine', baseFreq: 180, chaseFreq: 300, modRate: 3, modDepth: 20 },
  hound: { waveform: 'sawtooth', baseFreq: 70, chaseFreq: 140, modRate: 8, modDepth: 15 },
  crawlers: { waveform: 'square', baseFreq: 1800, chaseFreq: 2400, modRate: 12, modDepth: 200 },
  'death-rats': { waveform: 'sawtooth', baseFreq: 2500, chaseFreq: 3200, modRate: 20, modDepth: 400 },
  deathmoths: { waveform: 'triangle', baseFreq: 350, chaseFreq: 500, modRate: 15, modDepth: 50 },
  partygoers: { waveform: 'sine', baseFreq: 440, chaseFreq: 660, modRate: 4, modDepth: 30 },
  dullers: { waveform: 'sine', baseFreq: 50, chaseFreq: 70, modRate: 1, modDepth: 5 },
  'skin-stealer': { waveform: 'sawtooth', baseFreq: 100, chaseFreq: 200, modRate: 2, modDepth: 30 },
  wretches: { waveform: 'triangle', baseFreq: 130, chaseFreq: 200, modRate: 5, modDepth: 20 },
  facelings: { waveform: 'sine', baseFreq: 200, chaseFreq: 250, modRate: 1.5, modDepth: 10 },
  jerry: { waveform: 'sine', baseFreq: 330, chaseFreq: 330, modRate: 2, modDepth: 5 },
  clumps: { waveform: 'sawtooth', baseFreq: 55, chaseFreq: 90, modRate: 3, modDepth: 10 },
  windows: { waveform: 'square', baseFreq: 600, chaseFreq: 1200, modRate: 6, modDepth: 100 },
};

interface ActiveEntitySound {
  osc: OscillatorNode;
  lfo: OscillatorNode;
  lfoGain: GainNode;
  gain: GainNode;
  panner: StereoPannerNode;
}

const MAX_SOUNDS = 6;
const SOUND_RADIUS = 30;

export function useEntitySounds(
  entities: { id: number; type: string; position: THREE.Vector3; state: string }[]
) {
  const sounds = useRef<Map<number, ActiveEntitySound>>(new Map());
  const { camera } = useThree();

  useEffect(() => {
    return () => {
      sounds.current.forEach(s => {
        s.osc.stop();
        s.lfo.stop();
      });
      sounds.current.clear();
    };
  }, []);

  useFrame(() => {
    const ctx = getCtx();
    const playerPos = camera.position;
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    forward.y = 0;
    forward.normalize();
    const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

    const nearby = entities
      .map(e => ({ ...e, dist: new THREE.Vector3(e.position.x - playerPos.x, 0, e.position.z - playerPos.z).length() }))
      .filter(e => e.dist < SOUND_RADIUS)
      .sort((a, b) => a.dist - b.dist)
      .slice(0, MAX_SOUNDS);

    const nearbyIds = new Set(nearby.map(e => e.id));

    // Remove sounds for entities no longer nearby
    sounds.current.forEach((sound, id) => {
      if (!nearbyIds.has(id)) {
        sound.gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2);
        setTimeout(() => { try { sound.osc.stop(); sound.lfo.stop(); } catch {} }, 300);
        sounds.current.delete(id);
      }
    });

    // Update or create sounds
    for (const entity of nearby) {
      const config = SOUND_CONFIGS[entity.type] || SOUND_CONFIGS.smiler;
      const toEntity = new THREE.Vector3(entity.position.x - playerPos.x, 0, entity.position.z - playerPos.z);
      const pan = Math.max(-1, Math.min(1, toEntity.dot(right) / SOUND_RADIUS));
      const volume = Math.max(0, 1 - entity.dist / SOUND_RADIUS) * 0.15;
      const isChasing = entity.state === 'chase' || entity.state === 'attack';
      const freq = isChasing ? config.chaseFreq : config.baseFreq;

      let sound = sounds.current.get(entity.id);
      if (!sound) {
        const osc = ctx.createOscillator();
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        const gain = ctx.createGain();
        const panner = ctx.createStereoPanner();

        osc.type = config.waveform;
        osc.frequency.value = freq;
        lfo.type = 'sine';
        lfo.frequency.value = config.modRate;
        lfoGain.gain.value = config.modDepth;

        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        osc.connect(gain);
        gain.connect(panner);
        panner.connect(ctx.destination);

        gain.gain.value = 0;
        osc.start();
        lfo.start();

        sound = { osc, lfo, lfoGain, gain, panner };
        sounds.current.set(entity.id, sound);
      }

      sound.osc.frequency.linearRampToValueAtTime(freq, ctx.currentTime + 0.1);
      sound.gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.1);
      sound.panner.pan.linearRampToValueAtTime(pan, ctx.currentTime + 0.05);
      sound.lfo.frequency.linearRampToValueAtTime(isChasing ? config.modRate * 2 : config.modRate, ctx.currentTime + 0.1);
    }
  });
}
