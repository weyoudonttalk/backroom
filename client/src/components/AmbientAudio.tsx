import { useEffect, useRef } from 'react';

export function AmbientAudio() {
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const ctx = new AudioContext();
    audioCtxRef.current = ctx;

    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.15;
    masterGain.connect(ctx.destination);

    // 60Hz hum (fluorescent ballast)
    const hum60 = ctx.createOscillator();
    hum60.type = 'sine';
    hum60.frequency.value = 60;
    const hum60Gain = ctx.createGain();
    hum60Gain.gain.value = 0.3;
    hum60.connect(hum60Gain);
    hum60Gain.connect(masterGain);
    hum60.start();

    // 120Hz harmonic
    const hum120 = ctx.createOscillator();
    hum120.type = 'sine';
    hum120.frequency.value = 120;
    const hum120Gain = ctx.createGain();
    hum120Gain.gain.value = 0.15;
    hum120.connect(hum120Gain);
    hum120Gain.connect(masterGain);
    hum120.start();

    // High frequency buzz
    const buzz = ctx.createOscillator();
    buzz.type = 'sawtooth';
    buzz.frequency.value = 240;
    const buzzGain = ctx.createGain();
    buzzGain.gain.value = 0.02;
    const buzzFilter = ctx.createBiquadFilter();
    buzzFilter.type = 'bandpass';
    buzzFilter.frequency.value = 240;
    buzzFilter.Q.value = 10;
    buzz.connect(buzzFilter);
    buzzFilter.connect(buzzGain);
    buzzGain.connect(masterGain);
    buzz.start();

    // Low rumble (building ambience)
    const bufferSize = ctx.sampleRate * 4;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.5;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.value = 80;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.08;
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(masterGain);
    noise.start();

    const resumeAudio = () => {
      if (ctx.state === 'suspended') ctx.resume();
    };
    document.addEventListener('click', resumeAudio);
    document.addEventListener('keydown', resumeAudio);

    return () => {
      document.removeEventListener('click', resumeAudio);
      document.removeEventListener('keydown', resumeAudio);
      hum60.stop();
      hum120.stop();
      buzz.stop();
      noise.stop();
      ctx.close();
    };
  }, []);

  return null;
}
