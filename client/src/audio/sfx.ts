let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

export function playPickupSound(type: 'health' | 'water' | 'food' | 'generic') {
  const c = getCtx();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.connect(gain);
  gain.connect(c.destination);

  switch (type) {
    case 'health':
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, c.currentTime);
      osc.frequency.linearRampToValueAtTime(900, c.currentTime + 0.1);
      osc.frequency.linearRampToValueAtTime(1200, c.currentTime + 0.2);
      gain.gain.setValueAtTime(0.15, c.currentTime);
      gain.gain.linearRampToValueAtTime(0, c.currentTime + 0.3);
      osc.start();
      osc.stop(c.currentTime + 0.3);
      break;
    case 'water':
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, c.currentTime);
      osc.frequency.linearRampToValueAtTime(200, c.currentTime + 0.15);
      gain.gain.setValueAtTime(0.12, c.currentTime);
      gain.gain.linearRampToValueAtTime(0, c.currentTime + 0.2);
      osc.start();
      osc.stop(c.currentTime + 0.2);
      // Bubble effect
      const osc2 = c.createOscillator();
      const gain2 = c.createGain();
      osc2.connect(gain2);
      gain2.connect(c.destination);
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(800, c.currentTime + 0.05);
      osc2.frequency.linearRampToValueAtTime(500, c.currentTime + 0.12);
      gain2.gain.setValueAtTime(0.08, c.currentTime + 0.05);
      gain2.gain.linearRampToValueAtTime(0, c.currentTime + 0.15);
      osc2.start(c.currentTime + 0.05);
      osc2.stop(c.currentTime + 0.15);
      break;
    case 'food':
      osc.type = 'square';
      osc.frequency.setValueAtTime(150, c.currentTime);
      osc.frequency.setValueAtTime(180, c.currentTime + 0.04);
      gain.gain.setValueAtTime(0.1, c.currentTime);
      gain.gain.linearRampToValueAtTime(0, c.currentTime + 0.08);
      osc.start();
      osc.stop(c.currentTime + 0.08);
      // Second crunch
      const osc3 = c.createOscillator();
      const gain3 = c.createGain();
      osc3.connect(gain3);
      gain3.connect(c.destination);
      osc3.type = 'square';
      osc3.frequency.value = 200;
      gain3.gain.setValueAtTime(0.08, c.currentTime + 0.1);
      gain3.gain.linearRampToValueAtTime(0, c.currentTime + 0.16);
      osc3.start(c.currentTime + 0.1);
      osc3.stop(c.currentTime + 0.16);
      break;
    case 'generic':
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(500, c.currentTime);
      osc.frequency.linearRampToValueAtTime(800, c.currentTime + 0.08);
      gain.gain.setValueAtTime(0.1, c.currentTime);
      gain.gain.linearRampToValueAtTime(0, c.currentTime + 0.15);
      osc.start();
      osc.stop(c.currentTime + 0.15);
      break;
  }
}

export function playAttackSound(hit: boolean) {
  const c = getCtx();

  // Swing whoosh
  const noise = c.createBufferSource();
  const buf = c.createBuffer(1, c.sampleRate * 0.12, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    const t = i / c.sampleRate;
    data[i] = (Math.random() * 2 - 1) * Math.exp(-t * 25) * 0.2;
  }
  noise.buffer = buf;
  const filter = c.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 800;
  filter.Q.value = 2;
  const gain = c.createGain();
  gain.gain.value = 0.2;
  noise.connect(filter);
  filter.connect(gain);
  gain.connect(c.destination);
  noise.start();

  if (hit) {
    // Impact thud
    const osc = c.createOscillator();
    const impactGain = c.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(100, c.currentTime + 0.05);
    osc.frequency.linearRampToValueAtTime(50, c.currentTime + 0.15);
    impactGain.gain.setValueAtTime(0.2, c.currentTime + 0.05);
    impactGain.gain.linearRampToValueAtTime(0, c.currentTime + 0.2);
    osc.connect(impactGain);
    impactGain.connect(c.destination);
    osc.start(c.currentTime + 0.05);
    osc.stop(c.currentTime + 0.2);
  }
}
