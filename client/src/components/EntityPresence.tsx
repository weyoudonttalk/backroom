import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';

export function EntityPresence() {
  const audioCtx = useRef<AudioContext | null>(null);
  const nextEventTime = useRef(15 + Math.random() * 30);
  const elapsed = useRef(0);

  useEffect(() => {
    audioCtx.current = new AudioContext();
    return () => {
      audioCtx.current?.close();
    };
  }, []);

  const playDistantSound = () => {
    const ctx = audioCtx.current;
    if (!ctx || ctx.state === 'suspended') return;

    const type = Math.random();

    if (type < 0.4) {
      // Distant footstep
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.15, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        const t = i / ctx.sampleRate;
        data[i] = (Math.random() * 2 - 1) * Math.exp(-t * 20) * 0.1;
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 300;
      const gain = ctx.createGain();
      gain.gain.value = 0.04;
      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      source.start();
    } else if (type < 0.7) {
      // Low groan / pipe sound
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = 40 + Math.random() * 30;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 0.5);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 2);
    } else {
      // Distant thud
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        const t = i / ctx.sampleRate;
        data[i] = Math.sin(t * 80) * Math.exp(-t * 10) * 0.08;
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      const gain = ctx.createGain();
      gain.gain.value = 0.05;
      source.connect(gain);
      gain.connect(ctx.destination);
      source.start();
    }
  };

  useFrame((_, delta) => {
    elapsed.current += delta;
    if (elapsed.current >= nextEventTime.current) {
      playDistantSound();
      elapsed.current = 0;
      nextEventTime.current = 20 + Math.random() * 45;
    }
  });

  return null;
}
