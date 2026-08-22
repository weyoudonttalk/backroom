import { useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { useGame } from '../store/GameContext';
import { touch } from '../touch';

/**
 * Touch overlay for the FPS: left thumb = move joystick, right side =
 * drag-to-look (replaces pointer lock), corner buttons = sprint / crouch / menu.
 * DOM-only; rendered outside the Canvas so it never disturbs WebGL.
 */
export function MobileControls({ onMenu }: { onMenu: () => void }) {
  const { state, dispatch } = useGame();

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, pointerEvents: 'none', touchAction: 'none' }}>
      <LookZone />
      <Joystick />

      {/* Right-hand action buttons */}
      <div style={{
        position: 'fixed',
        right: 'calc(env(safe-area-inset-right, 0px) + 22px)',
        bottom: 'calc(env(safe-area-inset-bottom, 0px) + 30px)',
        display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'flex-end',
        pointerEvents: 'auto',
      }}>
        <HoldButton label="冲刺" onChange={(v) => { touch.sprint = v; }} size={78} />
        <TapButton
          label={state.isCrouching ? '站起' : '蹲伏'}
          onTap={() => dispatch({ type: 'SET_CROUCHING', value: !state.isCrouching })}
          size={78}
        />
      </div>

      {/* Menu / pause */}
      <TapButton label="☰" onTap={onMenu} size={48} corner="top-right" />
    </div>
  );
}

/** Full right-side drag area that feeds camera look deltas. */
function LookZone() {
  const last = useRef<{ x: number; y: number } | null>(null);
  const down = (e: ReactPointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    last.current = { x: e.clientX, y: e.clientY };
  };
  const move = (e: ReactPointerEvent) => {
    if (!last.current) return;
    touch.lookDX += e.clientX - last.current.x;
    touch.lookDY += e.clientY - last.current.y;
    last.current = { x: e.clientX, y: e.clientY };
  };
  const up = () => { last.current = null; };
  return (
    <div
      style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '58%', pointerEvents: 'auto', touchAction: 'none' }}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
    />
  );
}

/** Bottom-left movement joystick → touch.mx / touch.my. */
function Joystick() {
  const baseRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const active = useRef(false);

  const setKnob = (dx: number, dy: number) => {
    if (knobRef.current) knobRef.current.style.transform = `translate(${dx}px, ${dy}px)`;
  };
  const down = (e: ReactPointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    active.current = true;
  };
  const move = (e: ReactPointerEvent) => {
    if (!active.current) return;
    const rect = baseRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const maxDist = rect.width / 2 - 14;
    let dx = e.clientX - cx;
    let dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);
    if (dist > maxDist) { dx = (dx / dist) * maxDist; dy = (dy / dist) * maxDist; }
    setKnob(dx, dy);
    touch.mx = dx / maxDist;
    touch.my = dy / maxDist;
  };
  const up = () => { active.current = false; touch.mx = 0; touch.my = 0; setKnob(0, 0); };

  return (
    <div
      ref={baseRef}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
      style={{
        position: 'fixed',
        left: 'calc(env(safe-area-inset-left, 0px) + 22px)',
        bottom: 'calc(env(safe-area-inset-bottom, 0px) + 30px)',
        width: 144, height: 144, borderRadius: '50%',
        background: 'rgba(20, 18, 6, 0.42)',
        border: '2px solid rgba(214, 198, 74, 0.4)',
        pointerEvents: 'auto', touchAction: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div ref={knobRef} style={{
        width: 58, height: 58, borderRadius: '50%',
        background: 'rgba(214, 198, 74, 0.55)',
        border: '2px solid rgba(214, 198, 74, 0.9)',
        boxShadow: '0 0 12px rgba(214,198,74,0.4)',
      }} />
    </div>
  );
}

const btnBase = (size: number, active: boolean): React.CSSProperties => ({
  width: size, height: size, borderRadius: 16,
  border: '2px solid rgba(214, 198, 74, 0.55)',
  background: active ? 'rgba(214, 198, 74, 0.9)' : 'rgba(20, 18, 6, 0.5)',
  color: active ? '#14120a' : '#e8dca0',
  fontFamily: 'monospace', fontWeight: 700, fontSize: 12, letterSpacing: 1,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  touchAction: 'none', userSelect: 'none', WebkitTapHighlightColor: 'transparent',
});

function HoldButton({ label, onChange, size }: { label: string; onChange: (v: boolean) => void; size: number }) {
  const [p, setP] = useState(false);
  return (
    <div
      style={btnBase(size, p)}
      onPointerDown={(e) => { e.preventDefault(); (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId); setP(true); onChange(true); }}
      onPointerUp={(e) => { e.preventDefault(); setP(false); onChange(false); }}
      onPointerCancel={() => { setP(false); onChange(false); }}
    >{label}</div>
  );
}

function TapButton({ label, onTap, size, corner }: { label: string; onTap: () => void; size: number; corner?: 'top-right' }) {
  const [p, setP] = useState(false);
  const style: React.CSSProperties = corner === 'top-right'
    ? { ...btnBase(size, p), position: 'fixed', top: 'calc(env(safe-area-inset-top, 0px) + 14px)', right: 'calc(env(safe-area-inset-right, 0px) + 16px)', fontSize: 20, pointerEvents: 'auto' }
    : btnBase(size, p);
  return (
    <div
      style={style}
      onPointerDown={(e) => { e.preventDefault(); setP(true); }}
      onPointerUp={(e) => { e.preventDefault(); setP(false); onTap(); }}
      onPointerCancel={() => setP(false)}
    >{label}</div>
  );
}
