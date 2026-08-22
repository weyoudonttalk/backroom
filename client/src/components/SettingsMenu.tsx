import { useGame, Difficulty } from '../store/GameContext';
import { LEVELS } from '../levels/LevelConfig';

interface SettingsMenuProps {
  onClose: () => void;
}

export function SettingsMenu({ onClose }: SettingsMenuProps) {
  const { state, dispatch } = useGame();

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    fontFamily: 'monospace',
    color: '#c8b560',
  };

  const panelStyle: React.CSSProperties = {
    background: '#1a1800',
    border: '1px solid #4a4020',
    padding: '30px',
    borderRadius: '4px',
    width: '500px',
    maxHeight: '80vh',
    overflowY: 'auto',
  };

  const sectionStyle: React.CSSProperties = {
    marginBottom: '20px',
  };

  const headingStyle: React.CSSProperties = {
    fontSize: '14px',
    marginBottom: '8px',
    color: '#e8d080',
    borderBottom: '1px solid #3a3020',
    paddingBottom: '4px',
  };

  const btnStyle = (active: boolean): React.CSSProperties => ({
    padding: '6px 12px',
    margin: '2px 4px',
    background: active ? '#4a4020' : '#2a2010',
    border: `1px solid ${active ? '#8a7040' : '#3a3020'}`,
    color: active ? '#ffe080' : '#8a7a50',
    cursor: 'pointer',
    borderRadius: '2px',
    fontSize: '11px',
    fontFamily: 'monospace',
  });

  const actionBtnStyle: React.CSSProperties = {
    padding: '8px 20px',
    margin: '4px',
    background: '#3a3020',
    border: '1px solid #6a5030',
    color: '#e8d080',
    cursor: 'pointer',
    borderRadius: '2px',
    fontSize: '12px',
    fontFamily: 'monospace',
  };

  return (
    <div style={containerStyle} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={panelStyle}>
        <h2 style={{ fontSize: '18px', marginBottom: '20px', textAlign: 'center', color: '#ffe080' }}>
          设置
        </h2>

        <div style={sectionStyle}>
          <div style={headingStyle}>选择层级</div>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {LEVELS.map(level => (
              <button
                key={level.id}
                style={btnStyle(state.level === level.id)}
                onClick={() => dispatch({ type: 'SET_LEVEL', level: level.id })}
              >
                {level.name} — {level.subtitle}
              </button>
            ))}
          </div>
        </div>

        <div style={sectionStyle}>
          <div style={headingStyle}>难度</div>
          <div style={{ display: 'flex' }}>
            {(['easy', 'normal', 'hard'] as Difficulty[]).map(d => (
              <button
                key={d}
                style={btnStyle(state.difficulty === d)}
                onClick={() => dispatch({ type: 'SET_DIFFICULTY', difficulty: d })}
              >
                {d === 'easy' ? '简单' : d === 'normal' ? '普通' : '困难'}
              </button>
            ))}
          </div>
          <div style={{ fontSize: '10px', marginTop: '6px', opacity: 0.6 }}>
            {state.difficulty === 'easy' && '实体更少、更慢、探测范围更小。'}
            {state.difficulty === 'normal' && '标准体验。'}
            {state.difficulty === 'hard' && '实体更多、更快、探测范围更大。'}
          </div>
        </div>

        <div style={sectionStyle}>
          <div style={headingStyle}>操作</div>
          <div style={{ fontSize: '10px', lineHeight: '1.8', opacity: 0.7 }}>
            <div>WASD / 方向键 — 移动</div>
            <div>鼠标 — 视角</div>
            <div>左键 — 攻击</div>
            <div>Shift — 冲刺</div>
            <div>C — 蹲伏（降低被发现几率）</div>
            <div>ESC — 设置</div>
          </div>
        </div>

        <div style={sectionStyle}>
          <div style={headingStyle}>背包</div>
          {state.inventory.length === 0 ? (
            <div style={{ fontSize: '10px', opacity: 0.5 }}>空</div>
          ) : (
            <div style={{ fontSize: '10px' }}>
              {state.inventory.map(item => (
                <div key={item.id}>{item.name} x{item.quantity}</div>
              ))}
            </div>
          )}
        </div>

        <div style={sectionStyle}>
          <div style={headingStyle}>鸣谢</div>
          <div style={{ fontSize: '10px', lineHeight: '1.8', opacity: 0.7 }}>
            <div style={{ marginBottom: '4px' }}>Created by Simon Tian</div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '8px' }}>
              <a href="https://github.com/SimonSaysGiveMeSmile" target="_blank" rel="noopener noreferrer" style={{ color: '#c8b560', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.04c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.21.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.31-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.25 2.87.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 0z" />
                </svg>
                GitHub
              </a>
              <a href="https://www.linkedin.com/in/simon-tian-1333a3156" target="_blank" rel="noopener noreferrer" style={{ color: '#c8b560', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.26 2.37 4.26 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
                </svg>
                LinkedIn
              </a>
              <a href="https://x.com/realsimontian" target="_blank" rel="noopener noreferrer" style={{ color: '#c8b560', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644z" />
                </svg>
                X
              </a>
            </div>
            <div>AI-assisted development with Claude (Anthropic)</div>
            <div style={{ marginTop: '6px' }}>
              <a href="https://github.com/SimonSaysGiveMeSmile/backroom" target="_blank" rel="noopener noreferrer" style={{ color: '#c8b560', textDecoration: 'underline' }}>
                github.com/SimonSaysGiveMeSmile/backroom
              </a>
            </div>
            <div style={{ marginTop: '4px' }}>MIT License — Free and open source</div>
            <div style={{ marginTop: '6px', opacity: 0.6 }}>
              Tech: React Three Fiber, Three.js, TypeScript, WebSocket, Vite
            </div>
            <div style={{ opacity: 0.6 }}>
              Inspired by the Backrooms Wiki and SCP Foundation
            </div>
            <div style={{ marginTop: '6px', opacity: 0.5 }}>
              backrooms.online — v1.0.0
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <button style={actionBtnStyle} onClick={onClose}>继续</button>
          <button style={actionBtnStyle} onClick={() => { dispatch({ type: 'RESTART' }); onClose(); }}>
            重新开始
          </button>
        </div>
      </div>
    </div>
  );
}
