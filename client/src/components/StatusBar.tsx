import { useGame } from '../store/GameContext';

export function StatusBar() {
  const { state } = useGame();

  const barStyle = (color: string, value: number): React.CSSProperties => ({
    width: '160px',
    height: '14px',
    background: 'rgba(0,0,0,0.6)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '2px',
    overflow: 'hidden',
    position: 'relative',
  });

  const fillStyle = (color: string, value: number): React.CSSProperties => ({
    width: `${value}%`,
    height: '100%',
    background: color,
    transition: 'width 0.3s ease',
  });

  const labelStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: '6px',
    fontSize: '9px',
    fontFamily: 'monospace',
    color: '#fff',
    lineHeight: '14px',
    textShadow: '1px 1px 1px rgba(0,0,0,0.8)',
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: '8px',
      alignItems: 'center',
      zIndex: 20,
      pointerEvents: 'none',
    }}>
      <div style={{ position: 'relative' }}>
        <div style={barStyle('#cc3333', state.health)}>
          <div style={fillStyle('#cc3333', state.health)} />
          <span style={labelStyle}>生命 {Math.ceil(state.health)}</span>
        </div>
      </div>
      <div style={{ position: 'relative' }}>
        <div style={barStyle('#3388cc', state.water)}>
          <div style={fillStyle('#3388cc', state.water)} />
          <span style={labelStyle}>水 {Math.ceil(state.water)}</span>
        </div>
      </div>
      <div style={{ position: 'relative' }}>
        <div style={barStyle('#cc8833', state.food)}>
          <div style={fillStyle('#cc8833', state.food)} />
          <span style={labelStyle}>食物 {Math.ceil(state.food)}</span>
        </div>
      </div>
    </div>
  );
}
